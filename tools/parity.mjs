// Run by tools/build.py --check: docs/compose.js must produce what compose.py produced for each case.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const docs = join(dirname(fileURLToPath(import.meta.url)), "..", "docs");
for (const file of ["catalog.js", "compose.js"]) (0, eval)(readFileSync(join(docs, file), "utf8"));

const cases = JSON.parse(readFileSync(process.argv[2], "utf8"));
let failed = 0;
for (const c of cases) {
  const target = globalThis.AGENTS_CATALOG.targets[c.target];
  const got = globalThis.AgentsCompose.compose(target, c.series, c.lang, c.chosen, c.grants);
  if (got.text !== c.text || got.selected.map((f) => f.id).join() !== c.ids.join()) {
    failed += 1;
    if (failed <= 3) console.error(`docs/compose.js differs from compose.py: ${c.target} ${c.series} ${c.lang} [${c.chosen}]`);
  }
}
if (failed) {
  console.error(`${failed} of ${cases.length} cases differ`);
  process.exit(1);
}
