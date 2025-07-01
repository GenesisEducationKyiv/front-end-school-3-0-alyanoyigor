import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

const isAnalyze = process.env.VITE_ANALYZE === 'true';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      plugins: [
        isAnalyze &&
          visualizer({
            gzipSize: true,
            template: 'treemap',
            open: true,
            filename: 'dist/stats.html',
          }),
      ],
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom/client',
            'react-router-dom',
            'axios',
            'zod',
            '@tanstack/react-query',
            'tailwind-merge',
          ],
          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-progress',
            '@radix-ui/react-select',
            '@radix-ui/react-slot',
            'sonner',
          ],
        },
      },
    },
  },
  server: {
    port: 3000,
  },
});
