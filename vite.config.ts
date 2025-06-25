import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mkcert from 'vite-plugin-mkcert'
import path from "path"
import { visualizer } from 'rollup-plugin-visualizer';
// https://vite.dev/config/
export default defineConfig(() => {
  // const env = loadEnv(mode, process.cwd());

  return ({
    plugins: [react(), tailwindcss(), mkcert(), visualizer({ open: true })],
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
              const directories = id.split('node_modules/')[1].split('/');
              const name = directories[0].startsWith('@') ? `${directories[0]}/${directories[1]}` : directories[0];
              return `vendor-${name}`;
            }
          }
        },
      },
    },
    // server: {
    //   proxy: {
    //     '/api': {
    //       target: env.VITE_REACT_APP_API_URL,
    //       changeOrigin: true, 
    //       secure: false,
    //       rewrite: (path) => path.replace(/^\/api/, ''),
    //     },
    //   },
    // },
  })
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

// NORMAL MANUAL CHUNKING
// manualChunks(id) {
//   if (id.includes('node_modules')) {
//     if (id.includes('react')) return 'vendor_react';
//     if (id.includes('antd')) return 'vendor_antd';
//     if (id.includes('tiptap')) return 'vendor_tiptap';
//     if (id.includes('firebase')) return 'vendor_firebase';
//     if (id.includes('tailwind')) return 'vendor_tailwind';
//     if (id.includes('victory')) return 'vendor_charts';
//     if (id.includes('react-slick') || id.includes('react-player') || id.includes('lightbox')) return 'vendor_media';
//     if (id.includes('react-router-dom')) return 'vendor_router';
//     if (id.includes('moment')) return 'vendor_moment';
//     if (id.includes('react-icons')) return 'vendor_icons'
//     return 'vendor_misc';
//   }
// },