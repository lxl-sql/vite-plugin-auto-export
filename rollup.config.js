import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import del from 'rollup-plugin-delete'

export default {
  input: "./plugin/index.ts", // 入口
  output: {
    file: "./dist/index.js",
    format: "es"
  }, // 出口
  plugins: [
    nodeResolve(),
    typescript({
      declaration: false
    }),
    terser(),
    commonjs(),
    del({ targets: 'dist/*' })
  ]
};
