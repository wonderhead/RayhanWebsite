import { copyFile } from 'node:fs/promises'
import { join } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'pages-route-fallback',
      apply: 'build',
      async writeBundle({ dir }) {
        if (dir) await copyFile(join(dir, 'index.html'), join(dir, '404.html'))
      },
    },
  ],
  test: {
    environment: 'jsdom',
  },
})
