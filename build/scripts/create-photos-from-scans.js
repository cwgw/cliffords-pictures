#!/usr/bin/env node

const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const program = require('commander');
const sharp = require('sharp');

const pHash = require('./perceptual-hash');
const report = require('./reporter');

program
  .option('-d, --destination <dirname>', 'output directory', './build/photos')
  .option('-f, --output-image-format <type>', 'output image format', '.png')
  .option('-t, --test-run')
  .option(
    '-r, --initial-rotation <number>',
    'rotation of scanned image before processing',
    0
  )
  .parse(process.argv);

(async function run() {
  // get files
  const files = program.args.reduce((acc, input) => {
    let inputFiles = glob.sync(input);
    if (!inputFiles.length) {
      inputFiles = [input];
    }
    return acc.concat(
      inputFiles.map(filePath => ({
        path: filePath,
        ...path.parse(filePath),
      }))
    );
  }, []);

  // ensure destination
  const dest = program.testRun
    ? path.resolve('./test', 'photo-metadata')
    : path.resolve(program.destination, 'photos');

  try {
    await fs.ensureDir(dest);
  } catch (err) {
    report.error("Couldn't ensure destination", err);
  }

  // work on files
  files.forEach(file => {
    createPhotosFromScans({ file, dest });
  });
})();

function createPhotosFromScans({ file, dest }) {
  // get contours
}
