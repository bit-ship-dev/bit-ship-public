import type {CommandNames,Dependencies } from './config.d'

export const commandNames: CommandNames = {
  build:{
    actions: {
      'build': { value: 50 },
      'generate': { value: 50 },
      'gen': { value: 40 },
      'compile': { value: 30 },
      'construct': { value: 10 },
      'assemble': { value: 10 },
      'make': { value: 20 },
      'produce': { value: 10 },
      'compose': { value: 25 }
    },
    modes: {
      'production': { value: 40 },
      'prod': { value: 30 }
    }
  },
  dev: {
    actions: {
      'dev': { value: 50 },
      'development': { value: 50 },
      'serve': { value: 40 },
      'watch': { value: 30 },
    },
    modes: {
      'development': { value: 40 },
      'dev': { value: 30 }
    }
  },
  start: {
    actions: {},
    modes: {}
  },
  qa: {
    actions: {
      'test': { value: 50 },
      'eslint': { value: 50 },
      'lint': { value: 50 },
      'cypress': { value: 50 },
      'vitest': { value: 40 },
      'jest': { value: 30 },
    },
    modes: {
      'coverage': { value: 40 },
      'cov': { value: 30 },
      'e2e': { value: 20 },
      'unit': { value: 20 },
    }
  }

}

export const dependencies: Dependencies = {
  build: {
    vite: {value: 30, commandPattern: 'vite'},
    rollup: {value: 30, commandPattern: 'rollup'},
    webpack: {value: 30, commandPattern: 'webpack'},
  },

  qa: {
    jest: {value: 30, commandPattern: 'jest'},
    vitest: {value: 30, commandPattern: 'vitest'},
    cypress: {value: 30, commandPattern: 'cypress open'},
    playwright: {value: 30, commandPattern: 'playwright test'},

    eslint: {value: 30, commandPattern: 'eslint'},
    'dependency-cruiser': {value: 30, commandPattern: 'depcruise'}
  },

  start: {},
  dev: {}

}






