#!/usr/bin/env node

const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const program = require('commander');
const sharp = require('sharp');

const {
  getContourData,
  readImage,
  rotateAndCrop,
} = require('./image-detection');

const { getFaces, createFaceID } = require('./face-detection');

const pHash = require('./perceptual-hash');
const report = require('./reporter');

program
  .option('-d, --destination <dirname>', 'output directory', './data')
  .option('-f, --output-image-format <type>', 'output image format', '.png')
  .option(
    '-r, --initial-rotation <number>',
    'rotation of scanned image before processing',
    0
  )
  .parse(process.argv);

const destination = {
  images: path.resolve(program.destination, 'images'),
  faces: path.resolve(program.destination, 'faces'),
  imageMeta: path.resolve(program.destination, 'image-meta'),
};

const imageTarget = {
  width: 4, // inches
  height: 4.0625, // inches
  resolution: 600, // pixels per inch
};

imageTarget.area =
  imageTarget.width * imageTarget.height * Math.pow(imageTarget.resolution, 2);
imageTarget.aspectRatio = imageTarget.width / imageTarget.height;

// checks if n is within ±(threshold * target) of target
const isAround = (n, target, threshold = 0.1) => {
  return target * (1 - threshold) < n && n < target * (1 + threshold);
};

const isRightSized = ({ area, width, height, target = imageTarget }) =>
  isAround(area, target.area) && isAround(width / height, target.aspectRatio);

function saveImage(imagePath, image) {
  if (image instanceof sharp) {
    image
      .toFile(imagePath)
      .catch(err =>
        report.error(`Failed to save image to destination '${imagePath}'.`, err)
      );
  }
  image.save(imagePath);
}

function saveImageMeta(id, data) {
  const file = path.join(destination.imageMeta, `${id}.json`);
  fs.writeJson(file, data, { spaces: 2 });
}

function saveFace(id, data) {
  const file = path.join(destination.faces, `${id}.json`);
  fs.writeJson(file, data, { spaces: 2 });
}

async function parseImage(pendingImage) {
  report.info('parseImage');
  try {
    const image = await pendingImage;
    const imageSharp = await sharp(image.toBuffer());

    const id = await pHash(imageSharp);
    const imagePath = path.join(
      destination.images,
      id + program.outputImageFormat
    );

    // watch out for dHash id collisions
    const imageAlreadyExists = await fs.pathExists(imagePath);
    if (imageAlreadyExists) {
      report.error(
        `Possible id collision. Image '${id +
          program.outputImageFormat}' already exists in ${destination.images}`
      );
    }

    const { faces, transform } = await getFaces(imageSharp);

    const imageMeta = {
      id,
      image: path.relative(destination.imageMeta, imagePath),
      transform,
      people: [],
      date: null,
      location: null,
    };

    saveImageMeta(id, imageMeta);
    saveImage(imagePath, image);
    faces.forEach(face => {
      let faceID = createFaceID({ imageID: id, center: face.rect.center });
      saveFace(faceID, { id: faceID, image: id, ...face });
    });
  } catch (err) {
    report(`parseImage failed with error.`, err);
  }
}

async function getImages(filePath) {
  report.info('getImages');
  if (!/\.(jpeg|jpg|png|tiff|tif)/.test(path.extname(filePath))) return;

  const originalImage = await readImage(path.resolve(filePath));

  if (parseInt(program.initialRotation) > 0) {
    originalImage.rotate(parseInt(program.initialRotation));
  }

  // drop alpha channel if it exists
  // some opencv methods expect exactly 3 channels
  if (originalImage.channels() > 3) {
    let channels = await originalImage.split();
    await originalImage.merge(channels.slice(0, 3));
  }

  // const contours = await cvGetContours(originalImage);
  const contours = await getContourData(originalImage, isRightSized);

  report.info(`contour count first pass == ${contours.length}`);

  // loop through array of contours
  // for each contour, rotate and crop, then get contours again and repeat once
  // return array of promises
  return contours.reduce(
    (acc, data) =>
      acc.concat(
        rotateAndCrop({ image: originalImage, inset: -30, ...data }).then(
          croppedImage =>
            getContourData(croppedImage, isRightSized).then(contours2 => {
              report.info(`contour count second pass == ${contours2.length}`);
              return rotateAndCrop({
                image: croppedImage,
                inset: 10,
                ...contours2[0],
              });
            })
        )
      ),
    []
  );
}

async function parseScannedImage(filePath) {
  report.info('parseScannedImage');
  try {
    // split scan into individual images
    const images = await getImages(filePath);
    // await Promise.all(images.map(parseImage));

    // we almost always expect 4 photos from each scan
    // if we don't get exactly 4, there's a good chance something went wrong
    if (images.length !== 4) {
      report.warning(
        `${images.length > 4 ? 'More' : 'Fewer'} than 4 photos detected`,
        `\t${images.length} photos were pulled from '${newFileName}'`
      );
    }

    const file = path.parse(filePath);
    const dest = path.resolve(program.destination, 'scans');
    await fs.ensureDir(dest);

    const countExisting = glob.sync(path.join(dest, '*' + file.ext)).length;
    const fileName = `cp-${countExisting.toString().padStart(5, '0')}${
      file.ext
    }`;

    // move the scan from its original location to destination/scans dir
    await fs.move(filePath, path.join(dest, fileName), { overwrite: false });
  } catch (err) {
    report.error(`parseScannedImage failed with error.`, err);
  }
}

(function() {
  return "Here's a return value";
  // report.info(path.resolve(process.env.NODE_PATH));
  // report.info(path.resolve('.'));
})();

// (function run() {
//   const filePaths = program.args.reduce((acc, input) => {
//     let files = glob.sync(input);
//     if (!files.length) files = [input];
//     return acc.concat(files);
//   }, []);

//   (async () => {
//     // ensure output paths exist
//     await Promise.all(Object.values(destination).map(dir => fs.ensureDir(dir)));
//     for (let i = 0; i < filePaths.length; i++) {
//       report.info(`Processing '${filePaths[i]}'...`);
//       await parseScannedImage(filePaths[i]);
//     }
//   })();
// })();