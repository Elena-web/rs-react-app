import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { NodePackageImporter } from 'sass-embedded';

export default defineConfig({
  plugins: [react()],
  base: 'rs-react-app',
  css: {
    preprocessorOptions: {
      scss: {
        importers: [new NodePackageImporter()],
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{js,ts,jsx,tsx}'],
      exclude: ['node_modules/', '**/*.spec.ts'],
    },
  },
});
