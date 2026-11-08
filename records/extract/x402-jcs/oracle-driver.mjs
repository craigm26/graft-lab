// jcs.duramen's oracle behind duramen's driver protocol: JSON request lines on standard input,
// one response line per request on standard output. Requests are read with oracle.mjs's own
// JSON reader, not JSON.parse (Node.js 24's JSON.parse misreads some escaped keys), and lines
// end at LF only (JSON leaves U+2028 raw inside strings).
import { canonical, isCanonical, utf8Hex, readJson, NoCanonicalForm } from './oracle.mjs';

class Bad extends Error {}
const isMap = (x) => x instanceof Map;

function field(input, name, test, optional) {
  if (!input.has(name)) { if (optional) return undefined; throw new Bad(); }
  const v = input.get(name);
  if (!test(v)) throw new Bad();
  return v;
}
const anyValue = () => true;
const isBool = (v) => v === true || v === false;
const isStr = (v) => typeof v === 'string';

const OPS = {
  canonicalize: (i) => canonical(field(i, 'value', anyValue), field(i, 'strict', isBool, true) ?? false),
  canonicalBytes: (i) => utf8Hex(canonical(field(i, 'value', anyValue), field(i, 'strict', isBool, true) ?? false)),
  isCanonical: (i) => isCanonical(field(i, 'text', isStr), field(i, 'strict', isBool, true) ?? false),
};

function respond(id, body) {
  // Responses are written with this oracle's canonical writer, so they are plain JSON.
  return canonical(new Map([['id', id], ...Object.entries(body)]));
}

function handle(line) {
  let req;
  try { req = readJson(line); } catch { req = undefined; }
  if (!isMap(req) || !isStr(req.get('id'))) return respond(null, { error: 'bad_request' });
  const id = req.get('id');
  const op = req.get('op');
  if (!isStr(op) || !Object.hasOwn(OPS, op)) return respond(id, { error: 'unknown_op' });
  const input = req.get('input');
  try {
    if (!isMap(input)) throw new Bad();
    return respond(id, { result: OPS[op](input) });
  } catch (e) {
    if (e instanceof Bad) return respond(id, { error: 'bad_request' });
    if (e instanceof NoCanonicalForm) return respond(id, { error: 'no_canonical_form' });
    throw e;
  }
}

const chunks = [];
for await (const c of process.stdin) chunks.push(c);
const out = [];
for (const line of Buffer.concat(chunks).toString('utf8').split('\n')) {
  if (line.trim() === '') continue;
  try { out.push(handle(line) + '\n'); } catch (e) {
    let id = null;
    try { const r = readJson(line); if (isMap(r) && isStr(r.get('id'))) id = r.get('id'); } catch {}
    out.push(JSON.stringify({ id, oracle_error: String(e && e.message) }) + '\n');
  }
}
process.stdout.write(out.join(''));
