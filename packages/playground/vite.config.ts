import path from 'path';
import importMetaUrlPlugin from '@codingame/esbuild-import-meta-url-plugin';

export default {
    build: {
        target: 'ES2022',
        rollupOptions: {
            input: {
                index: path.resolve(__dirname, 'index.html')
            }
        },
        emptyOutDir: false,
        assetsInlineLimit: 0,
        outDir: path.resolve(__dirname, 'out')
    },
    worker: {
        format: 'es'
    },
    esbuild: {
        minifySyntax: false
    },
    optimizeDeps: {
        esbuildOptions: {
            plugins: [
                importMetaUrlPlugin
            ]
        },
        include: [
            'vscode-textmate',
            'vscode-oniguruma'
        ]
    },
};
