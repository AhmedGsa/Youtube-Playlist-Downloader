import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  main: {
    define: {
      'process.env.YOUTUBE_API_KEY': JSON.stringify(process.env.YOUTUBE_API_KEY),
    },
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'dist/main',
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: 'dist/preload'
    }
  },
  renderer: {
    plugins: [react()],
    build: {
      outDir: 'dist/renderer',
    },
    resolve: {
      alias: {
        '@renderer': resolve(__dirname, 'src/renderer/src')
      }
    }
  }
})
