import { buildWorkerDefinition } from "./monaco-editor-workers/index.js";
buildWorkerDefinition('./monaco-editor-workers/workers', new URL('', window.location.href).href, false);

export const configureWorker = () => {
    const workerURL = new URL('./worker/pl-one-server-worker.js', import.meta.url);
    console.log(`Using the following  worker URL: ${workerURL.href}`);
    const lsWorker = new Worker(workerURL.href, {
        type: 'classic',
        name: 'PlOne Language Server'
    });

    return {
        options: {
            $type: 'WorkerDirect',
            worker: lsWorker
        }
    }
};
