// import { buildSync } from "esbuild";
const { buildSync } = require("esbuild");

buildSync({
  entryPoints: ["plugin/index.ts"],
  bundle: true,
  minify: true,
  platform: "node",
  target: ["node16"],
  outdir: "dist",
  external: ['@vue/compiler-sfc', 'vue/compiler-sfc', 'vite']
});