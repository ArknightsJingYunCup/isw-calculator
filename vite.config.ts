import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';
import UnoCSS from 'unocss/vite'

export default defineConfig({
  plugins: [devtools(), solidPlugin(), UnoCSS()],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
  base: './',
});
