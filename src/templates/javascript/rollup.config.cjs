const { defineConfig } = require("rollup");
const babel = require("@rollup/plugin-babel");
const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const terser = require("@rollup/plugin-terser");
const peerDepsExternal = require("rollup-plugin-peer-deps-external");
const postcss = require("rollup-plugin-postcss");
const copy = require("rollup-plugin-copy");
const postcssUrl = require("postcss-url");
{{% if (options.modules.includes('umd') || options.modules.includes('standalone')) { -%}}
const replace = require("@rollup/plugin-replace");
{{% } -%}}

function createBabelConfig(modules = false) {
  return {
    babelHelpers: "bundled",
    exclude: "node_modules/**",
    presets: [
      ["@babel/preset-env", { modules }],
      ["@babel/preset-react", { runtime: "automatic" }],
    ],
  };
}

module.exports = defineConfig([
  // CJS and ESM builds for npm packages (with external React)
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
      postcss({
        extract: false,
        inject: true,
        minimize: true,
        plugins: [
          postcssUrl({
            url: "rebase",
          }),
        ],
      }),
      babel(createBabelConfig(false)),
      commonjs(),
      copy({
        targets: [{ src: "src/assets", dest: "lib" }],
      }),
      terser(),
    ],
    external: ["react", "react-dom"],
  },
{{% if (options.modules.includes('umd')) { -%}}
  // UMD build for browser usage (with React bundled)
  {
    input: "src/index.js",
    output: [
      {
        file: "lib/index.umd.js",
        format: "umd",
        name: "{{%=PACKAGE_NAME%}}",
        sourcemap: true,
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
      {
        file: "lib/index.umd.min.js",
        format: "umd",
        name: "{{%=PACKAGE_NAME%}}",
        sourcemap: true,
        plugins: [terser()],
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    ],
    plugins: [
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
        preventAssignment: true,
      }),
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      postcss({
        extract: false,
        inject: true,
        minimize: true,
      }),
      babel(createBabelConfig(false)),
      commonjs(),
    ],
    external: ["react", "react-dom"],
  },
{{% } -%}}
{{% if (options.modules.includes('standalone')) { -%}}
  // Standalone UMD build (with React bundled) - for vanilla JS
  {
    input: "src/index.js",
    output: [
      {
        file: "lib/index.standalone.js",
        format: "umd",
        name: "{{%=PACKAGE_NAME%}}",
        sourcemap: true,
      },
      {
        file: "lib/index.standalone.min.js",
        format: "umd",
        name: "{{%=PACKAGE_NAME%}}",
        sourcemap: true,
        plugins: [terser()],
      },
    ],
    plugins: [
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
        preventAssignment: true,
      }),
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      postcss({
        extract: false,
        inject: true,
        minimize: true,
      }),
      babel(createBabelConfig(false)),
      commonjs(),
    ],
    external: [], // Bundle everything including React
  },
{{% } -%}}
]);
