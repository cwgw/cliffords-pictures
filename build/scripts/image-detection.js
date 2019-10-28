#!/usr/bin/env node

const cv = require('opencv');
const report = require('./reporter');

const smoothNumberForComparison = (n, fac = 100) => Math.floor(n / fac) * fac;

const getRectCenter = ({ x, y, width, height }) => ({
  x: Math.round(x + width / 2),
  y: Math.round(y + height / 2),
});

function getContourData(image, iteratee) {
  return getContours(image)
    .then(result => getRectsFromContours(result, iteratee))
    .catch(err => report.error('getContours failed with error.', err));
}

// // copy image, scale down, blur and find contours
// function getContours (image, { scale = 0.5 } = {}) {
//   console.log(chalk.gray('getContours'));
//   return new Promise((resolve, reject) => {
//     const im = image.copy();
//     const [h, w] = im.size();

//     if (im.channels() > 3) {
//       let channels = im.split();
//       im.merge(channels.slice(0, 3));
//     }

//     im.convertGrayscale();
//     im.resize(w * scale, h * scale);
//     im.gaussianBlur([3, 3]);
//     im.bilateralFilter(30, 30, 100);
//     im.canny(180, 255);
//     const contours = im.findContours();
//     resolve({contours, scale});
//   });
// }

// copy image, scale down, blur and find contours
function getContours(image, { scale = 0.5 } = {}) {
  report.info('getContours');
  return new Promise((resolve, reject) => {
    const im = image.copy();
    const [h, w] = im.size();

    // scale down for faster operations
    im.resize(w * scale, h * scale);

    // split channels
    let channels = im.split();

    // save blue channel
    const blueChannel = channels[0];

    // discard alpha channel if it exists
    if (im.channels() > 3) {
      im.merge(channels.slice(0, 3));
    }

    // grayscale
    im.convertGrayscale();

    // create mask from inverted blue channel
    const blackMat = new cv.Matrix.Zeros(h * scale, w * scale);
    blueChannel.bitwiseNot(blackMat);
    const blueInverted = im.add(blackMat);
    const mask = blueInverted.threshold(180, 255);

    // add mask to original
    im.bitwiseAnd(im, mask);

    // blur, erode, and threshold
    im.gaussianBlur([7, 7]);
    im.erode(2);
    im.bilateralFilter(30, 30, 100);
    let imThreshold = im.threshold(70, 255);

    // return contours (and scale for fitting contours to unscaled original)
    const contours = imThreshold.findContours();
    resolve({ contours, scale });
  });
}

function getRectsFromContours({ contours, scale = 0.5 }, iteratee) {
  report.info('getRectsFromContours');
  return new Promise((resolve, reject) => {
    // Loop through contours and push to output array.
    // Skip those that fail iteratee (if iteratee is callable).
    // Near duplicate contours may exist, so skip those too.
    const contourArray = [];
    const existingContours = {};

    for (let i = 0; i < contours.size(); ++i) {
      let rect = contours.minAreaRect(i);
      let center = getRectCenter(contours.boundingRect(i));
      let data = {
        angle: rect.angle <= -45 ? rect.angle + 90 : rect.angle,
        center: {
          x: Math.round(center.x / scale),
          y: Math.round(center.y / scale),
        },
        width: Math.round(
          rect.size[rect.angle <= -45 ? 'height' : 'width'] / scale
        ),
        height: Math.round(
          rect.size[rect.angle <= -45 ? 'width' : 'height'] / scale
        ),
        area: (rect.size.width * rect.size.width) / Math.pow(scale, 2),
      };

      // validate contour data
      if (typeof iteratee === 'function' && !iteratee(data)) {
        continue;
      }

      // check for very similar contours that already exist
      let x = smoothNumberForComparison(data.center.x);
      let y = smoothNumberForComparison(data.center.y);
      let key = '' + x + y;

      if (existingContours[key]) {
        continue;
      } else {
        existingContours[key] = true;
      }

      contourArray.push(data);
    }

    resolve(contourArray);
  });
}

function readImage(filePath) {
  report.info('readImage');
  return new Promise((resolve, reject) => {
    cv.readImage(filePath, (err, image) => {
      if (err) {
        report.error(`failed to readImage.`, err);
        reject(err);
      } else {
        resolve(image);
      }
    });
  });
}

function rotateAndCrop({ image, angle, center, width, height, inset }) {
  report.info('rotateAndCrop');
  return new Promise((resolve, reject) => {
    inset = inset || 0;
    im = image.copy();
    im.rotate(angle, center.x, center.y);
    const left = Math.round(center.x - width / 2);
    const top = Math.round(center.y - height / 2);
    const croppedImage = im.crop(
      left + inset,
      top + inset,
      width - inset * 2,
      height - inset * 2
    );
    resolve(croppedImage);
  });
}

module.exports = exports = {
  getContourData,
  getContours,
  getRectsFromContours,
  readImage,
  rotateAndCrop,
};
