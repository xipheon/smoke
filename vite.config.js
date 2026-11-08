import { defineConfig } from 'vite';

export default defineConfig({
  // Relative asset paths, so the built site works from any folder or subpath
  // (e.g. https://yourname.github.io/smoke/ or an itch.io HTML upload).
  base: './',
});
