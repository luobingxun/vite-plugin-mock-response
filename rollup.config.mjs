import { defineConfig } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default defineConfig([
  {
    input: './src/index.ts',
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json', sourceMap: true })
    ],
    external: ['vite'],
    output: [
      {
        file: 'dist/index.mjs',
        format: 'esm'
      },
      {
        file: 'dist/index.cjs',
        format: 'cjs'
      }
    ]
  },
  {
    input: './src/index.ts',
    plugins: [dts()],
    output: [
      {
        file: 'dist/index.d.mts',
        format: 'esm'
      },
      {
        file: 'dist/index.d.cts',
        format: 'cjs'
      }
    ]
  }
]);
