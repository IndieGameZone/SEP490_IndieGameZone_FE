import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mkcert from 'vite-plugin-mkcert'

import path from "path"
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), mkcert()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('antd')) return 'vendor_antd'
            if (id.includes('@tiptap')) return 'vendor_tiptap'
            if (id.includes('react-icons')) return 'vendor_icons'
            if (id.includes('react-router-dom')) return 'vendor_router'
            if (id.includes('firebase')) return 'vendor_firebase'
            if (id.includes('moment')) return 'vendor_moment'
            return 'vendor_misc'
          }
        },
      },
    },
  }
});

// SMARTER CHUNKING
// manualChunks(id) {
//   if (id.includes('node_modules')) {
//     const directories = id.split('node_modules/')[1].split('/');
//     // Handle scoped packages (@scope/name)
//     const name = directories[0].startsWith('@') ? `${directories[0]}/${directories[1]}` : directories[0];
//     return `vendor-${name}`;
//   }
// }