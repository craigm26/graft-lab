// A driver for the OLD code, for the sanity check only (never the oracle): x402-solidarity's
// src/solidarity/jcs.ts behind jcs.duramen's driver protocol.
//
//   duramen run jcs.duramen --driver "node old-code/driver.mjs <path to jcs.ts> <path to duramen>"
//
// Request lines are read with duramen's src/json.mjs (JSON.parse without Node.js 24's escaped-key
// misreading), so any difference on Node.js 24 comes from the module itself, not from here.
// Any Error the module throws whose message starts with "JCS" is answered `no_canonical_form`
// (D-006); anything else is not caught.
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

const [jcsPath, duramenDir] = process.argv.slice(2);
const J = await import(pathToFileURL(jcsPath).href);
const { parseJson } = await import(pathToFileURL(join(duramenDir, 'src/json.mjs')).href);

class Bad extends Error {}
const isObj = (x) => typeof x === 'object' && x !== null && !Array.isArray(x);
const has = (o, k) => Object.hasOwn(o, k);
const opts = (i) => {
  if (!has(i, 'strict')) return {};
  if (typeof i.strict !== 'boolean') throw new Bad();
  return { strictIntegers: i.strict };
};
const value = (i) => { if (!has(i, 'value')) throw new Bad(); return i.value; };

const OPS = {
  canonicalize: (i) => J.canonicalize(value(i), opts(i)),
  canonicalBytes: (i) => Buffer.from(J.canonicalBytes(value(i), opts(i))).toString('hex'),
  isCanonical: (i) => { if (typeof i.text !== 'string') throw new Bad(); return J.isCanonical(i.text, opts(i)); },
};

function handle(line) {
  let req;
  try { req = parseJson(line); } catch { req = undefined; }
  if (!isObj(req) || typeof req.id !== 'string') return JSON.stringify({ id: null, error: 'bad_request' });
  const { id } = req;
  if (typeof req.op !== 'string' || !has(OPS, req.op)) return JSON.stringify({ id, error: 'unknown_op' });
  try {
    if (!isObj(req.input)) throw new Bad();
    return JSON.stringify({ id, result: OPS[req.op](req.input) });
  } catch (e) {
    if (e instanceof Bad) return JSON.stringify({ id, error: 'bad_request' });
    if (e instanceof Error && e.message.startsWith('JCS')) return JSON.stringify({ id, error: 'no_canonical_form' });
    throw e;
  }
}

const chunks = [];
for await (const c of process.stdin) chunks.push(c);
const out = [];
for (const line of Buffer.concat(chunks).toString('utf8').split('\n')) {
  if (line.trim() === '') continue;
  try { out.push(handle(line) + '\n'); } catch (e) {
    out.push(JSON.stringify({ id: null, crashed: String(e && e.message) }) + '\n');
  }
}
process.stdout.write(out.join(''));
