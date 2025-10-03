import { defineConfig } from 'rollup';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default defineConfig([
  {
    input: 'src/index.js',
    output: [
      {
        file: 'lib/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'lib/index.esm.js',
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve({
        browser: true,
      }),
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
        presets: [
          ['@babel/preset-env', { modules: false }],
          ['@babel/preset-react', { runtime: 'automatic' }],
        ],
      }),
      commonjs(),
      terser(),
    ],
    external: ['react', 'react-dom'],
  },
]);