// Alder Ledger — the hand-in program for the make.fun household budget
// bounty (program/v1). It copies the site (app/) and its screenshots into
// the output directory and writes dossier.json there with the vendored
// make.fun library, exactly as the gate rebuilds it. Node 22, standard
// library only, no network, no arguments. Outside the grader,
// MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) {
  cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });
}

writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);

// Fail loudly instead of handing in a half-written output directory.
const dossier = join(out, 'dossier.json');
if (!existsSync(dossier) || !existsSync(join(out, 'app', 'index.html'))) {
  throw new Error('hand-in incomplete: dossier.json or app/index.html missing from ' + out);
}
