
import { cp, mkdir, readdir, rm } from 'node:fs/promises';
await rm('dist', { recursive: true, force: true });
await mkdir('dist');
for (const archivo of await readdir('.')) {
    if (archivo.endsWith('.html')) await cp(archivo, 'dist/' + archivo);
}
await cp('recursos', 'dist/recursos', { recursive: true });
