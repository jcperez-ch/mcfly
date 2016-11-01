/* eslint-disable import/no-extraneous-dependencies */
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify'; // eslint-disable-line import/extensions

// TODO need to inject process, NODE_ENV and those values.

export default {
  entry: './src/Flaxs.js',
  exports: 'named',
  dest: './lib/flaxs.min.js',
  format: 'iife',
  moduleName: 'flaxs',
  plugins: [
    builtins(),
    resolve({
      jsnext: true,
      browser: true,
    }),
    commonjs({
      sourceMap: false,
      include: [
        'node_modules/**',
      ],
    }),
    eslint({
      exclude: [],
    }),
    babel({
      exclude: 'node_modules/**',
    }),
    replace({
      'process.env.NODE_ENV': '"production"',
    }),
    uglify(),
  ],
};
