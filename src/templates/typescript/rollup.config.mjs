import { defineConfig } from "rollup";
import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import copy from "rollup-plugin-copy";
import postcssUrl from "postcss-url";
{{% if (options.modules.includes('umd') || options.modules.includes('standalone')) { -%}}
import replace from "@rollup/plugin-replace";
{{% } -%}}

const createBabelConfig = (modules = false) => ({
  babelHelpers: "bundled",
  exclude: "node_modules/**",
  extensions: [".ts", ".tsx"],
  presets: [
    ["@babel/preset-env", { modules }],
    ["@babel/preset-react", { runtime: "automatic" }],
    "@babel/preset-typescript",
  ],
});

export default defineConfig([
  // CJS and ESM builds for npm packages (with external React)
  {
    input: "src/index.tsx",
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
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: true,
        declarationDir: "lib",
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
    input: "src/index.tsx",
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
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
        declarationMap: false,
        compilerOptions: {
          declaration: false,
          declarationMap: false,
          declarationDir: undefined,
          outDir: undefined,
        },
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
    input: "src/index.tsx",
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
      typescript({
        tsconfig: "./tsconfig.json",
        declaration: false,
        declarationMap: false,
        compilerOptions: {
          declaration: false,
          declarationMap: false,
          declarationDir: undefined,
          outDir: undefined,
        },
      }),
      babel(createBabelConfig(false)),
      commonjs(),
    ],
    external: [], // Bundle everything including React
  },
{{% } -%}}
]);
