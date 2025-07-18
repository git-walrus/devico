import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/devico/',
  plugins: [react()],
  server: {
    open: true
  }
});
