import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import { compression } from 'vite-plugin-compression2'
import tailwindcss from 'tailwindcss'
//import { analyzer } from 'vite-bundle-analyzer'

export default defineConfig({
    // depending on your application, base can also be "/"
    root: '',
    base: '/',
    plugins: [
        react(), 
        viteTsconfigPaths(),
        compression({
            algorithm: 'gzip', exclude: [/\.(br)$ /, /\.(gz)$/]
        })
        //analyzer(),
    ],
    css: {
        postcss: {
            plugins: [tailwindcss],
        },
    },
    build: {
        minify: true,
        cssCodeSplit: true,
        outDir: 'build',
        rollupOptions: {
            output: {
                manualChunks: (id) => {

                    if (id.includes('react')) {
                        return `v-react`
                    }
                    if (id.includes('echarts')) {
                        return `v-echarts`
                    }
                    if (id.includes('lodash')) {
                        return `v-lodash`
                    }
                    if (id.includes('prosemirror')) {
                        return `v-prosemirror`
                    }
                    if (id.includes('@sentry')) {
                        return `v-@sentry`
                    }                          
                },
            }
        }
    },
    define: {
        global: 'globalThis',
    },
    server: {    
        // this ensures that the browser opens upon server start
        open: true,
        // this sets a default port to 3000  
        port: 3000, 
    },
})