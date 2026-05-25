<<<<<<< HEAD
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
=======
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
>>>>>>> 944af93d08b53034c33eae1d1ba4435a6275b980
