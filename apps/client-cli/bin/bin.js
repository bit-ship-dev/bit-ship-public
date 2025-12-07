#!/usr/bin/env node
import('../dist/index.js')
  .then(module => module.init())
  .catch(err => {
    console.error('Error loading module:', err);
    process.exit(1);
  });
