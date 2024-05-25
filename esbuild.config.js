// import { buildSync } from "esbuild";

const { buildSync } = require("esbuild");
const { dependencies, peerDependencies } = require('./package.json')
const { Generator } = require('npm-dts');


const sharedConfig = {
  entryPoints: ["plugin/test.ts"],
  bundle: true,
  minify: true,
  external: Object.keys(dependencies | {}).concat(Object.keys(peerDependencies)),
};

buildSync({
  ...sharedConfig,
  platform: 'node', // for CJS
  outfile: "dist/index.js",
});

buildSync({
  ...sharedConfig,
  outfile: "dist/index.esm.js",
  platform: 'neutral', // for ESM
  format: "esm",
});

new Generator({
  entry: 'plugin/test.ts',
  output: 'dist/index.d.ts',
  tsc: '--extendedDiagnostics',
}).generate();