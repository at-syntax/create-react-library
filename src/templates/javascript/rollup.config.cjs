const { defineConfig } = require("rollup");
const babel = require("@rollup/plugin-babel");
const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const terser = require("@rollup/plugin-terser");
const peerDepsExternal = require("rollup-plugin-peer-deps-external");

module.exports = defineConfig([
  {
    input: "src/index.js",
    output: [
      {
        file: "lib/index.js",
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "lib/index.esm.js",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve({
        browser: true,
      }),
      babel({
        babelHelpers: "bundled",
        exclude: "node_modules/**",
        presets: [
          ["@babel/preset-env", { modules: false }],
          ["@babel/preset-react", { runtime: "automatic" }],
        ],
      }),
      commonjs(),
      terser(),
    ],
    external: ["react", "react-dom"],
  },
]);
