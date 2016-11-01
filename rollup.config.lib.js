/* eslint-disable import/no-extraneous-dependencies */
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: './src/Flaxs.js',
  exports: 'named',
  dest: './lib/flaxs-cjs.js',
  format: 'cjs',
  external: ['events', 'flux', 'invariant'],
  plugins: [
    resolve({
      jsnext: true,
      browser: true,
    }),
    commonjs({
      sourceMap: false,
    }),
    eslint({
      exclude: [],
    }),
    babel({
      exclude: 'node_modules/**',
    }),
  ],
};
