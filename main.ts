// Hearth Ledger entrypoint (Node 22, standard library only).
//
// The site itself is plain static files in app/ — index.html, one stylesheet,
// and ES modules with no build step. This program hands it in: it copies app/
// and screenshots/ from beside this file into the output directory and writes
// dossier.json there with the vendored make.fun library, which is the summary
// the judge reads (screenshots, first-load bytes, and the site's source).
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// The program takes no arguments and writes the same bytes on every run.

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = fileURLToPath(new URL(".", import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const appDir = join(repoRoot, "app");
if (!existsSync(join(appDir, "index.html"))) {
  throw new Error("app/index.html is missing — the site cannot be handed in");
}

mkdirSync(outputDir, { recursive: true });
cpSync(appDir, join(outputDir, "app"), { recursive: true });

const shotsDir = join(repoRoot, "screenshots");
mkdirSync(join(outputDir, "screenshots"), { recursive: true });
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(outputDir, "screenshots"), { recursive: true });
}

// The gate's own caps, so a bad entry is refused here instead of at the gate:
// at most 4 screenshots of 256 KiB, at most 993 app files/directories and
// 16 MiB of app files, and a dossier text of at most 160 KiB.
const dossier = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});
const dossierPath = join(outputDir, "dossier.json");
writeFileSync(dossierPath, dossier);

// A hand-in with no dossier is no hand-in: refuse to finish quietly if the
// file did not land or came out empty.
if (!existsSync(dossierPath) || dossier.length === 0) {
  throw new Error("dossier.json was not written — the entry is incomplete");
}
