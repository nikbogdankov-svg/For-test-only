import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The React app lives in client/; `npm run build` outputs it to dist/ for Express to serve.
export default defineConfig({
  root: 'client',
  plugins: [react()],
  build: { outDir: '../dist', emptyOutDir: true },
});
