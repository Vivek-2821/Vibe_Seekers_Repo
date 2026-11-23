import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

function copy404Plugin() {
  return {
    name: 'copy-404-plugin',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const indexPath = path.resolve(distDir, 'index.html');
      const notFoundPath = path.resolve(distDir, '404.html');
      try {
        if (fs.existsSync(indexPath)) {
          fs.copyFileSync(indexPath, notFoundPath);
          console.log('[copy-404-plugin] Successfully copied index.html -> 404.html for GitHub Pages SPA support');
        }
      } catch (err) {
        console.error('[copy-404-plugin] Failed to copy index.html to 404.html:', err);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), copy404Plugin()],
  base: '/',
  server: {
    port: 5173,
    host: true,
  },
});
