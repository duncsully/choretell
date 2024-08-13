import { defineConfig } from 'vite'
import { resolve } from 'path'

// Config to build pb_hooks as CommonJS files
export default defineConfig({
  build: {
    target: 'es6',
    outDir: 'server/pb_hooks',
    emptyOutDir: false,
    copyPublicDir: false,
    lib: {
      entry: {
        vapidConfig: resolve(__dirname, './vapidConfig.ts'),
      },
      fileName(_, entryName) {
        return `${entryName}.js`
      },
      formats: ['cjs'],
    },
  },
})
