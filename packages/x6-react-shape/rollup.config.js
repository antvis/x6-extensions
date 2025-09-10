import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/x6-react-shape.min.js',
    name: 'X6ReactShape',
    format: 'umd',
    sourcemap: false,
  },
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfig: './tsconfig.json',
      exclude: ['__tests__/**', 'demo/**'],
    }),
    json(),
    terser(),
  ],
  context: 'window',
  onwarn(warning) {
    console.warn('Rollup warning:', warning.message)
  },
}
