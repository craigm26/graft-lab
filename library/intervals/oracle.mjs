// The intervals record's oracle: a driver, speaking duramen's protocol, written to the record.
import { createInterface } from "node:readline";

class Refused extends Error { constructor(code) { super(code); this.code = code; } }
const isInt = (v) => typeof v === "number" && Number.isInteger(v);
function items(input) {
	const xs = input.items;
	if (!Array.isArray(xs)) throw new Refused("bad_request");
	for (const x of xs) if (!x || typeof x !== "object" || Array.isArray(x) || !isInt(x.start) || !isInt(x.end)) throw new Refused("bad_request");
	return xs;
}
function merged(xs) {
	for (const x of xs) if (x.start > x.end) throw new Refused("bad_interval");
	const out = [];
	for (const x of [...xs].sort((a, b) => a.start - b.start || a.end - b.end)) {
		const last = out[out.length - 1];
		if (last && x.start <= last.end) last.end = Math.max(last.end, x.end);
		else out.push({ start: x.start, end: x.end });
	}
	return out;
}
const OPS = {
	merge: (input) => merged(items(input)),
	total: (input) => merged(items(input)).reduce((n, x) => n + x.end - x.start, 0),
	contains: (input) => {
		const xs = items(input);
		if (!isInt(input.point)) throw new Refused("bad_request");
		for (const x of xs) if (x.start > x.end) throw new Refused("bad_interval");
		return xs.some((x) => x.start <= input.point && input.point <= x.end);
	},
};
const say = (a) => process.stdout.write(JSON.stringify(a) + "\n");
for await (const line of createInterface({ input: process.stdin, crlfDelay: Infinity })) {
	if (!line.trim()) continue;
	let req;
	try { req = JSON.parse(line); } catch { say({ id: null, error: "bad_request" }); continue; }
	if (!req || typeof req !== "object" || Array.isArray(req)) { say({ id: null, error: "bad_request" }); continue; }
	const id = Object.hasOwn(req, "id") ? req.id : null;
	if (!Object.hasOwn(OPS, req.op)) { say({ id, error: "unknown_op" }); continue; }
	if (!req.input || typeof req.input !== "object" || Array.isArray(req.input)) { say({ id, error: "bad_request" }); continue; }
	try { say({ id, result: OPS[req.op](req.input) }); } catch (e) { if (e instanceof Refused) say({ id, error: e.code }); else throw e; }
}
