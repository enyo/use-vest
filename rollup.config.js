// rollup.config.js
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'

export default [
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
      format: 'esm',
      name: 'index',
      sourcemap: true,
    },
    plugins: [typescript()],
  },

  // Unfortunately it's necessary to use dts plugin to generate the d.ts file
  // because the default typescript rollup plugin creates a subfolder.
  {
    input: 'src/index.ts',
    output: {
      dir: 'dist',
      name: 'index',
      sourcemap: false,
    },
    plugins: [dts()],
  },
]
