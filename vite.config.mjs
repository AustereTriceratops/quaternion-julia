import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const ReactCompilerConfig = {};

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react({
    babel: {plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]]}
  })],
  esbuild: {
    loader: 'jsx',
  },
})
