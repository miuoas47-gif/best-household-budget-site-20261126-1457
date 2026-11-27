// Lumbung — the program that hands the site in (Node 22, standard library only).
//
// The site is app/: plain static files a browser opens at app/index.html, with no
// build step and no network request. This program copies app/ and screenshots/
// from beside itself into the output directory and writes dossier.json there,
// using buildDossier from the kit's vendored library — the scorer rebuilds the
// dossier with its own copy and compares the two byte for byte, so this file
// must not add, drop or reorder anything.
//
// Run it with no arguments. It writes the same bytes every run:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Start from a clean output directory so a stale file can never leak into a run.
mkdirSync(out, { recursive: true });
for (const name of ["app", "screenshots", "dossier.json"]) {
  rmSync(join(out, name), { recursive: true, force: true });
}
cpSync(join(here, "app"), join(out, "app"), { recursive: true });
mkdirSync(join(out, "screenshots"), { recursive: true });
if (existsSync(join(here, "screenshots"))) {
  cpSync(join(here, "screenshots"), join(out, "screenshots"), { recursive: true });
}

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the
// bytes; the others refuse an entry the scorer would refuse — more than 4
// screenshots or one over 256 KiB; more than 993 files and directories in app/
// or 16 MiB of app files: app/ counts beside /output's own 1000-entry cap,
// its screenshots/ and dossier.json.
writeFileSync(
  join(out, "dossier.json"),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
