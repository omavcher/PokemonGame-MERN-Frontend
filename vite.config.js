import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',  // Adjust based on deployment path
  plugins: [react()],
});
