#!/usr/bin/env node

/**
 * to do:
 *  - add 'clean' flag that wipes destination dir before starting
 *  - add flag that allows for skipping files that already exist in dest
 */

const fs = require('fs-extra');
const glob = require('glob');
const path = require('path');
const program = require('commander');
const PQueue = require('p-queue').default;

const config = require('../../cpconfig');
const createMetadata = require('./create-photo-metadata');
const createImages = require('./create-web-ready-images');
const reporter = require('./reporter');

program
  .option('-m, --create-metadata')
  .option('-i, --create-images')
  .option('-t, --test-run')
  .parse(process.argv);

(async function run() {
  const nothingToDo = () => {
    reporter.info(`There's nothing to do. Exiting process early...`);
    process.exit();
  };

  const files = program.args.reduce((acc, input) => {
    let inputFiles = glob.sync(input);
    if (!inputFiles.length) {
      inputFiles = [input];
    }
    return acc.concat(
      inputFiles.map(filePath => ({
        filePath,
        ...path.parse(filePath),
      }))
    );
  }, []);

  if (!files.length) {
    reporter.warn('no files enqueued');
    nothingToDo();
  }

  const dest = config.dest;

  if (program.testRun) {
    for (let d in dest) {
      dest[d] = path.join('./test', dest[d]);
    }
  }

  const tasks = [];

  if (program.createMetadata) {
    fs.ensureDirSync(dest.metadata);
    tasks.push(createMetadata);
  }

  if (program.createImages) {
    const formats = [config.imageFormat];
    if (config.withWebp && config.imageFormat !== 'webp') {
      formats.push('webp');
    }
    fs.ensureDirSync(dest.images);
    tasks.push(args => createImages({ formats, ...args }));
  }

  if (!tasks.length) {
    reporter.warn('no tasks specified');
    nothingToDo();
  }

  const queue = new PQueue({ concurrency: 4 });

  const progress = reporter.createProgress(`process files`, files.length, 0);

  progress.start();

  queue.addAll(
    files.map(file => () =>
      tasks
        .reduce(
          (chain, func) =>
            chain.then(() =>
              func({
                file,
                config: {
                  ...config,
                  dest,
                },
                reporter,
              })
            ),
          Promise.resolve()
        )
        .then(() => {
          progress.tick();
        })
        .catch(err => {
          reporter.panic('', err);
        })
    )
  );

  queue.onIdle().then(() => {
    progress.done();
  });
})();
