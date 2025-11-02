import { defineConfig, loadEnv } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';
import UnoCSS from 'unocss/vite'

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [devtools(), solidPlugin(), UnoCSS()],
    server: {
      port: 3000,
    },
    build: {
      target: 'esnext',
    },
    // 优先使用环境变量 BASE_URL，否则根据 mode 决定
    base: env.BASE_URL || '/',
  };
});
