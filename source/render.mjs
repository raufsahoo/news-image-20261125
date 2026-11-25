// Renders source/news.html to entry.png (1024 x 1024) with a local headless Chrome or Edge.
// This runs only on the author's machine; the entry itself (main.ts) just copies entry.png.
//   node source/render.mjs [path-to-chrome]
import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', 'entry.png');
const candidates = [
  process.argv[2],
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);
const browser = candidates.find((p) => existsSync(p));
if (!browser) throw new Error('no Chrome or Edge found: pass its path as the first argument');

execFileSync(browser, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
  '--window-size=1024,1024', `--screenshot=${out}`,
  pathToFileURL(join(here, 'news.html')).href,
], { stdio: 'inherit' });

const bytes = statSync(out).size;
if (bytes > 1048576) throw new Error(`entry.png is ${bytes} bytes, over the 1 MiB cap`);
console.log(`wrote ${out} (${bytes} bytes)`);
