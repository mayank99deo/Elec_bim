// Assembles the hostable static site in public/ from the single-file builds in dist/.
// Vercel (and most static hosts) serve public/ as the site root.
//   public/index.html        the Phase-Balancing Copilot
//   public/field/index.html  Pinnacle BIM Field, when that build exists
import { copyFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, "public");
rmSync(pub, { recursive: true, force: true });
mkdirSync(pub, { recursive: true });

const ROUTES = [
  { from: "dist/phase-balancer-copilot.html", to: "index.html", required: true },
  { from: "dist/pinnacle-bim-field.html", to: "field/index.html", required: false },
];
for (const r of ROUTES) {
  const src = join(root, r.from);
  if (!existsSync(src)) {
    if (r.required) throw new Error(`${r.from} is missing; run scripts/build.mjs first`);
    continue;
  }
  const dest = join(pub, r.to);
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(src, dest);
  console.log(`site: ${r.from} → public/${r.to}`);
}
