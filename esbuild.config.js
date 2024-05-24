// const { buildSync } = require("esbuild");
import { buildSync } from "esbuild";

buildSync({
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  platform: "node",
  target: ["node16"],
  external: ["@vue/compiler-sfc", "vue/compiler-sfc", "vite"],
  outfile: "dist/index.js"
});
