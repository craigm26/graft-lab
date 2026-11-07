// The composite's oracle (Graft scripts/lab/grain-composite.ts): request lines on standard input, one response line per
// request on standard output. A line whose op a part owns goes to that part's own oracle driver; anything else gets the
// answer all three agree on: bad_request with a null id when the line isn't an object with a string id, otherwise
// unknown_op.
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const PARTS = [{"label":"heat-engine","driver":"../heat-engine/oracle-driver.mjs","ops":["canonical","wetBulb","wetBulbF","flagF","flagC"]},{"label":"jsonpath","driver":"../jsonpath/driver.mjs","ops":["query"]},{"label":"rcan-gate","driver":"../rcan-gate/driver.mjs","ops":["decide"]}];
const chunks = [];
for await (const c of process.stdin) chunks.push(c);
const own = [];
const batch = PARTS.map(() => []);
for (const line of Buffer.concat(chunks).toString('utf8').split('\n')) {
  if (line.trim() === '') continue;
  let req;
  try { req = JSON.parse(line); } catch { own.push({ id: null, error: 'bad_request' }); continue; }
  if (req === null || typeof req !== 'object' || Array.isArray(req) || typeof req.id !== 'string') { own.push({ id: null, error: 'bad_request' }); continue; }
  const at = typeof req.op === 'string' ? PARTS.findIndex((p) => p.ops.includes(req.op)) : -1;
  if (at < 0) { own.push({ id: req.id, error: 'unknown_op' }); continue; }
  batch[at].push(line);
}
let out = own.map((r) => JSON.stringify(r) + '\n').join('');
for (const [i, p] of PARTS.entries()) {
  if (!batch[i].length) continue;
  const path = join(here, p.driver);
  const r = spawnSync(process.execPath, [path], { cwd: dirname(path), input: batch[i].join('\n') + '\n', encoding: 'utf8', maxBuffer: 512 * 1024 * 1024 });
  if (r.status !== 0) { process.stderr.write(p.label + ' oracle exited ' + r.status + ': ' + (r.stderr || '').slice(-2000)); process.exit(1); }
  out += r.stdout;
}
process.stdout.write(out);
