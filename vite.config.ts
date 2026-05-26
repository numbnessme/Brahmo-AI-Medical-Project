import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api/openai': {
        target: 'https://api.openai.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/openai/, '')
      }
    }
  }
});
