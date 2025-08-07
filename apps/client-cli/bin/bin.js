#!/usr/bin/env node

import('../dist/index.js')
  .then(_module => {})
  .catch(err => {
    console.error('Error loading module:', err);
    process.exit(1);
  });
