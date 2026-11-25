// news-image-20261125 entry: one image summing up the world news of Wednesday 25 November 2026.
// The image (entry.png, rendered from source/news.html by source/render.mjs) ships in the repository;
// this program, Node 22 standard library only, copies it to /output/entry.png.
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const image = readFileSync(new URL('./entry.png', import.meta.url));

// The gate takes a whole PNG of at most 1 MiB and 1024 x 1024 pixels: refuse anything else here, loudly.
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!image.subarray(0, 8).equals(PNG_SIGNATURE)) throw new Error('entry.png is not a PNG');
if (image.length > 1048576) throw new Error(`entry.png is ${image.length} bytes, over 1 MiB`);
const width = image.readUInt32BE(16);
const height = image.readUInt32BE(20);
if (width > 1024 || height > 1024) throw new Error(`entry.png is ${width}x${height}, over 1024x1024`);
if (!image.subarray(-8, -4).equals(Buffer.from('IEND'))) throw new Error('entry.png is cut short (no IEND chunk)');

writeFileSync(join(process.env.MAKEFUN_OUTPUT_DIR ?? '/output', 'entry.png'), image);
