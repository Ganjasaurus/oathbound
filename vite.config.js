import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
export default defineConfig({
  resolve: {
    alias: [{ find: /^three$/, replacement: fileURLToPath(new URL('./vendor/three-r162.module.min.js', import.meta.url)) }],
  },
});
