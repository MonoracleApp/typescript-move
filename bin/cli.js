#!/usr/bin/env node

// This is the executable entry point for the CLI
const { CLI } = require('../dist/src/index.js');

const cli = new CLI();
cli.run().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
