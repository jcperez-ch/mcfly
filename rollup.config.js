/* eslint-disable import/no-extraneous-dependencies */
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';

export default {
  entry: './src/Flaxs.js',
  exports: 'named',
  dest: './lib/flaxs.js',
  external: ['events'],
  plugins: [
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
  ],
};
