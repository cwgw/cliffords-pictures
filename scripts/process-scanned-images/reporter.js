#!/usr/bin/env node

const chalk = require('chalk');

function logAndQuit(err) {
  console.trace(chalk.yellow(err));
  process.exit(1);
}

module.exports = exports = logAndQuit;
