// The model of jcs.duramen, written by hand from RFC 8785 (sections 3.2.2 to 3.2.4), RFC 7493
// (I-JSON) and the record's requirements. It is not a port of x402-solidarity's jcs.ts: strings
// are escaped from RFC 8785's table code unit by code unit, members are ordered by an explicit
// UTF-16 code unit comparison, UTF-8 is encoded by hand, and canonical text is recognised by
// reading it with this file's own JSON reader. The one borrowed piece is the number text, which
// RFC 8785 section 3.2.2.3 defines as ECMAScript's Number::toString; String(n) is that function.

export class NoCanonicalForm extends Error {}

const HEX = '0123456789abcdef';
const SHORT = { 0x08: '\\b', 0x09: '\\t', 0x0a: '\\n', 0x0c: '\\f', 0x0d: '\\r', 0x22: '\\"', 0x5c: '\\\\' };
const isHigh = (u) => u >= 0xd800 && u <= 0xdbff;
const isLow = (u) => u >= 0xdc00 && u <= 0xdfff;

// RFC 8785 3.2.2.2, and RFC 7493 2.1: a string with an unpaired surrogate is not I-JSON.
function stringText(s) {
  let out = '"';
  for (let i = 0; i < s.length; i++) {
    const u = s.charCodeAt(i);
    if (isHigh(u)) {
      const next = i + 1 < s.length ? s.charCodeAt(i + 1) : -1;
      if (!isLow(next)) throw new NoCanonicalForm('unpaired high surrogate');
      out += s[i] + s[i + 1];
      i++;
      continue;
    }
    if (isLow(u)) throw new NoCanonicalForm('unpaired low surrogate');
    if (SHORT[u] !== undefined) out += SHORT[u];
    else if (u < 0x20) out += '\\u00' + HEX[u >> 4] + HEX[u & 15];
    else out += s[i];
  }
  return out + '"';
}

// RFC 8785 3.2.2.3: ECMAScript Number::toString; NaN and the infinities are not JSON numbers.
function numberText(n) {
  if (n !== n || n === Infinity || n === -Infinity) throw new NoCanonicalForm('not a finite number');
  return String(n);
}

// RFC 8785 3.2.3: compare names as arrays of UTF-16 code units.
function byCodeUnits(a, b) {
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    const d = a.charCodeAt(i) - b.charCodeAt(i);
    if (d !== 0) return d;
  }
  return a.length - b.length;
}

const MAX_STRICT = 9007199254740991; // 2^53 - 1

function strictNumberOk(n) {
  return Number.isFinite(n) && Math.floor(n) === n && n >= 0 && n <= MAX_STRICT;
}

// Objects from this file's reader are Maps (so "__proto__" is an ordinary name); plain objects
// are accepted too.
function members(v) {
  if (v instanceof Map) return [...v.entries()];
  return Object.keys(v).map((k) => [k, v[k]]);
}

export function canonical(v, strict = false) {
  if (v === null) return 'null';
  if (v === true || v === false) {
    if (strict) throw new NoCanonicalForm('booleans are outside the statement form');
    return v ? 'true' : 'false';
  }
  if (typeof v === 'string') return stringText(v);
  if (typeof v === 'number') {
    if (strict && !strictNumberOk(v)) throw new NoCanonicalForm('outside the statement form');
    return numberText(v);
  }
  if (Array.isArray(v)) {
    const parts = [];
    for (const x of v) parts.push(canonical(x, strict));
    return '[' + parts.join(',') + ']';
  }
  if (typeof v === 'object') {
    const ms = members(v).sort((x, y) => byCodeUnits(x[0], y[0]));
    const parts = [];
    for (const [k, x] of ms) parts.push(stringText(k) + ':' + canonical(x, strict));
    return '{' + parts.join(',') + '}';
  }
  throw new NoCanonicalForm(`not a JSON value: ${typeof v}`);
}

// RFC 8785 3.2.4: the canonical text as UTF-8, written here as lowercase hex.
export function utf8Hex(text) {
  let out = '';
  const byte = (b) => { out += HEX[b >> 4] + HEX[b & 15]; };
  for (let i = 0; i < text.length; i++) {
    let cp = text.charCodeAt(i);
    if (isHigh(cp) && i + 1 < text.length && isLow(text.charCodeAt(i + 1))) {
      cp = 0x10000 + ((cp - 0xd800) << 10) + (text.charCodeAt(i + 1) - 0xdc00);
      i++;
    }
    if (cp < 0x80) byte(cp);
    else if (cp < 0x800) { byte(0xc0 | (cp >> 6)); byte(0x80 | (cp & 63)); }
    else if (cp < 0x10000) { byte(0xe0 | (cp >> 12)); byte(0x80 | ((cp >> 6) & 63)); byte(0x80 | (cp & 63)); }
    else { byte(0xf0 | (cp >> 18)); byte(0x80 | ((cp >> 12) & 63)); byte(0x80 | ((cp >> 6) & 63)); byte(0x80 | (cp & 63)); }
  }
  return out;
}

// A JSON reader (RFC 8259). Objects become Maps; a repeated member name is reported through
// `dup` (I-JSON forbids it). Throws SyntaxError on anything that is not one JSON text.
export function readJson(text, dup = () => {}) {
  let i = 0;
  const bad = (why) => { throw new SyntaxError(`${why} at ${i}`); };
  const ws = () => {
    while (i < text.length) {
      const c = text[i];
      if (c === ' ' || c === '\t' || c === '\n' || c === '\r') i++;
      else break;
    }
  };
  const lit = (word, v) => { if (text.startsWith(word, i)) { i += word.length; return v; } return bad('bad literal'); };
  const str = () => {
    i++; // opening quote
    let s = '';
    for (;;) {
      if (i >= text.length) bad('unterminated string');
      const c = text[i];
      if (c === '"') { i++; return s; }
      if (c.charCodeAt(0) < 0x20) bad('control character in string');
      if (c !== '\\') { s += c; i++; continue; }
      const e = text[i + 1];
      const simple = { '"': '"', '\\': '\\', '/': '/', b: '\b', f: '\f', n: '\n', r: '\r', t: '\t' };
      if (e in simple) { s += simple[e]; i += 2; continue; }
      if (e === 'u') {
        const h = text.slice(i + 2, i + 6);
        if (!/^[0-9a-fA-F]{4}$/.test(h)) bad('bad \\u escape');
        s += String.fromCharCode(parseInt(h, 16));
        i += 6;
        continue;
      }
      bad('bad escape');
    }
  };
  const num = () => {
    const m = /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?/.exec(text.slice(i));
    if (!m) bad('bad number');
    i += m[0].length;
    return Number(m[0]);
  };
  const value = () => {
    ws();
    const c = text[i];
    if (c === '{') {
      i++;
      const o = new Map();
      ws();
      if (text[i] === '}') { i++; return o; }
      for (;;) {
        ws();
        if (text[i] !== '"') bad('expected a name');
        const k = str();
        ws();
        if (text[i] !== ':') bad('expected :');
        i++;
        const v = value();
        if (o.has(k)) dup(k);
        o.set(k, v);
        ws();
        if (text[i] === ',') { i++; continue; }
        if (text[i] === '}') { i++; return o; }
        bad('expected , or }');
      }
    }
    if (c === '[') {
      i++;
      const a = [];
      ws();
      if (text[i] === ']') { i++; return a; }
      for (;;) {
        a.push(value());
        ws();
        if (text[i] === ',') { i++; continue; }
        if (text[i] === ']') { i++; return a; }
        bad('expected , or ]');
      }
    }
    if (c === '"') return str();
    if (c === 't') return lit('true', true);
    if (c === 'f') return lit('false', false);
    if (c === 'n') return lit('null', null);
    return num();
  };
  const v = value();
  ws();
  if (i !== text.length) bad('text after the value');
  return v;
}

// Is `text` exactly the canonical form of the JSON value it holds? Text that is not one JSON
// value, that repeats a member name, or whose value has no canonical form (in strict mode too)
// is not.
export function isCanonical(text, strict = false) {
  let repeated = false;
  let v;
  try {
    v = readJson(text, () => { repeated = true; });
  } catch {
    return false;
  }
  if (repeated) return false;
  try {
    return canonical(v, strict) === text;
  } catch (e) {
    if (e instanceof NoCanonicalForm) return false;
    throw e;
  }
}
