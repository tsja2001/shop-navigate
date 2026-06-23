import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/d8N4kP7sVq2R/',
  build: {
    outDir: 'dist',
  },
  server: {
    // 本地 dev 时把 /api 转发到线上后端，避免跨域；编辑器直接维护线上数据
    proxy: {
      '/api': {
        target: 'https://hbhgjjj.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
});
