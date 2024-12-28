import typescript from '@rollup/plugin-typescript';
// import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'es'
  },
  plugins: [
    // nodeResolve({
    //   preferBuiltins: true,
    // }),
    commonjs({
      ignore: ['fsevents']
    }),
    json(),
    typescript({}),
    terser(),
  ],
};
