const fs = require('fs-extra');
const get = require('lodash/get');
const imagemin = require(`imagemin`);
const imageminMozjpeg = require(`imagemin-mozjpeg`);
const imageminPngquant = require(`imagemin-pngquant`);
const imageminWebp = require(`imagemin-webp`);
const path = require('path');
const sharp = require('sharp');

module.exports = async function createWebReadyImages({
  file,
  formats,
  reporter,
  config: { dest, imageSizes, imagePath },
}) {
  const id = file.name;
  const meta = fs.readJsonSync(
    path.resolve(dest.metadata, `${file.name}.json`)
  );
  const rotate = get(meta, 'transform.rotate', 0);
  const imagePipeline = sharp(file.filePath).rotate(rotate);
  const imageVariants = imageSizes.reduce((arr, width) => {
    return arr.concat(formats.map(format => ({ format, width })));
  }, []);

  const progress = reporter.createProgress(
    `${id} create images`,
    imageVariants.length,
    0
  );

  progress.start();

  return Promise.all(
    imageVariants.map(async ({ width, format }) => {
      const outputPath = path.join(
        dest.images,
        imagePath({ id, size: width, ext: format })
      );
      fs.ensureDirSync(path.parse(outputPath).dir);

      return imagePipeline
        .clone()
        .resize({ width })
        .png({
          adaptiveFiltering: false,
          force: format === 'png',
        })
        .webp({
          quality: 90,
          force: format === 'webp',
        })
        .jpeg({
          quality: 100,
          force: format === 'jpg' || format === 'jpeg',
        })
        .toBuffer()
        .then(buffer => {
          switch (format) {
            case 'jpg':
            case 'jpeg':
              return compressJpg(buffer, outputPath);
            case 'png':
              return compressPng(buffer, outputPath);
            case 'webp':
              return compressWebP(buffer, outputPath);
          }
        })
        .then(() => {
          progress.tick();
        })
        .catch(err => {
          reporter.panic(`Couldn't create ${outputPath}`, err);
        });
    })
  ).then(() => {
    progress.done();
  });
};

function compressPng(sharpBuffer, outputPath) {
  return imagemin
    .buffer(sharpBuffer, {
      plugins: [
        imageminPngquant({
          quality: 100,
        }),
      ],
    })
    .then(imageminBuffer => fs.writeFile(outputPath, imageminBuffer));
}

function compressJpg(sharpBuffer, outputPath) {
  return imagemin
    .buffer(sharpBuffer, {
      plugins: [imageminMozjpeg({ quality: 90 })],
    })
    .then(imageminBuffer => fs.writeFile(outputPath, imageminBuffer));
}

function compressWebP(sharpBuffer, outputPath) {
  return imagemin
    .buffer(sharpBuffer, {
      plugins: [imageminWebp({ quality: 90 })],
    })
    .then(imageminBuffer => fs.writeFile(outputPath, imageminBuffer));
}
