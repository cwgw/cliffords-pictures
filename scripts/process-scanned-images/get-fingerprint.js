#!/usr/bin/env node

const chalk = require('chalk');
const Decimal = require('decimal.js');
const sharp = require('sharp');

const report = require('./reporter');

function getFingerprint(image) {
  console.log(chalk.gray('getFingerprint'));

  if (!(image instanceof sharp)) {
    image = sharp(image);
  }

  return image
    .greyscale()
    .normalise()
    .resize(9, 8, { fit: sharp.fit.fill })
    .raw()
    .toBuffer()
    .then(data => {
      let fingerprint = '0b';
      for (let col = 0; col < 8; col++) {
        for (let row = 0; row < 8; row++) {
          const left = data[row * 8 + col];
          const right = data[row * 8 + col + 1];
          fingerprint = fingerprint + (left < right ? '1' : '0');
        }
      }
      // convert to hex
      fingerprint = new Decimal(fingerprint).toHexadecimal();
      return fingerprint;
    })
    .catch(report);
}

module.exports = exports = getFingerprint;
