# Claims: x402-jcs 0.1.0-extracted

Every claim in `jcs.duramen`, with its status, for a person to accept, edit or reject one at a
time (graftfork roadmap 3.1). Nothing here is accepted yet.

**Where status lives.** Graft's status for every claim is in `jcs.graft`, a `claims` block in
Graft's `.graft` format (roadmap 3.0; parser `src/regen/graftfile.ts` in the graftfork repo):
91 claims (11 requirements, 6 decisions, 3 properties, 71 examples and table rows), every one
`inferred`, none `observed`, none accepted. Graft's own `readRecord` reads it with no
diagnostics. duramen 0.3.0 ignores `.graft` files; it gives a status only to decisions, so the
record also carries `status inferred` (D-001 to D-004) and `status proposed` (D-005, D-006),
and each requirement or edge citing one gets warning T028 (13 in all). Evidence rows are not
claims in Graft's reading.

This file adds what `.graft` cannot say: where each claim came from, so a reviewer knows what
to check. The provenance labels below are not Graft statuses. All protocol and RFC-copied
claims are still `inferred` in `jcs.graft`, so each needs a person's accept; marking the
protocol claims `proposed` there would let a rebuild through without one (Graft's `UNACCEPTED`
is inferred and observed only).

**Provenance.**

- `inferred`: what the module is meant to do, read from `src/solidarity/jcs.ts`'s doc comments,
  its callers (`ledger.ts`, `policy.ts`, `facilitator.ts`), the intent its tests state, and RFC
  8785 / RFC 7493, which it cites. Expected values were worked out by hand, not by running it.
- `observed`: an expected value that only running the old code could give. **There are none.**
  The old code was run only after the record checked, as a sanity check (below), and no
  expected value was changed to match it.
- `protocol`: the record's own choices for the driver protocol, which a function library does
  not have: error codes, bytes as hex, request shape.
- `published`: values copied from RFC 8785's text.
- `open`: deliberately unpinned.

**Source.** github.com/craigm26/x402-solidarity at d6653c7 (2026-10-23),
`src/solidarity/jcs.ts`, 79 lines, Apache-2.0.

## Counts

In `jcs.graft` (Graft status): 91 inferred, 0 observed, 0 proposed, 0 accepted.

By provenance:

| provenance | requirements | decisions | examples and rows | evidence rows | properties | total |
|---|---|---|---|---|---|---|
| inferred | 9 | 4 | 60 | 0 | 3 | 76 |
| observed | 0 | 0 | 0 | 0 | 0 | 0 |
| protocol | 2 | 2 | 8 | 0 | 0 | 12 |
| published | 0 | 0 | 3 | 24 | 0 | 27 |
| open | | | | | | 5 |

Not counted as claims: the two edge packs bound from duramen's library (`json/rfc8785`,
`number-text/ecmascript`, 42 items), which check the oracle; their choice rests on D-001.

## Requirements

| id | provenance | read from |
|---|---|---|
| IF-001 Requests that cannot be handled | protocol | duramen driver protocol |
| IF-002 Extra members | protocol | duramen driver protocol |
| JC-001 Literals | inferred | doc comment ("Literals: null, true, false"), RFC 8785 3.2.2 |
| JC-002 Strings | inferred | doc comment (strings as JSON.stringify), RFC 8785 3.2.2.2 |
| JC-003 Unpaired surrogates have no canonical form | inferred | doc comment (I-JSON), test intent |
| JC-004 Numbers | inferred | doc comment (Number.prototype.toString, -0 as 0), RFC 8785 3.2.2.3 |
| JC-005 Arrays | inferred | RFC 8785 3.2 |
| JC-006 Objects | inferred | doc comment (UTF-16 code unit order), RFC 8785 3.2.3 |
| JC-007 Bytes | inferred | `canonicalBytes` doc comment, RFC 8785 3.2.4 |
| JC-008 The strict statement form | inferred | doc comment and `CanonicalizeOptions.strictIntegers`; ledger.ts |
| JC-009 Recognising canonical text | inferred | `isCanonical` doc comment; ledger.ts reads statements with it |

## Decisions

| id | provenance | note |
|---|---|---|
| D-001 RFC 8785 is the rule for canonical text | inferred | |
| D-002 Unpaired surrogates are refused, not escaped | inferred | |
| D-003 The strict form is the statement form | inferred | |
| D-004 Negative zero is zero in the strict form | inferred | not stated anywhere in the module; the doc says "non-negative integers" and "-0 serializes as 0". The likeliest claim to edit. |
| D-005 Bytes travel as lowercase hex | protocol | duramen status proposed |
| D-006 One error code for every value with no canonical form | protocol | duramen status proposed |

## Properties

| id | provenance |
|---|---|
| JC-P1 The canonical text reads back as the value and is canonical | inferred |
| JC-P2 Strict mode refuses or agrees | inferred |
| JC-P3 Bytes are never fewer than characters | inferred |

## Open items

IF-003 error text and standard error; IF-004 repeated member names in a request; JC-010 values
outside JSON (NaN, infinities, undefined members: the library handles them, no request can carry
them); JC-011 depth; JC-012 which part is refused.

## Sanity check against the old code

The oracle (`oracle.mjs`) is written from RFC 8785 and does not port `jcs.ts`: its own escape
table, code unit comparison, UTF-8 encoder and JSON reader. `old-code/driver.mjs` puts `jcs.ts`
behind the same protocol. Run after the record checked:

```
duramen run jcs.duramen --driver "node old-code/driver.mjs <jcs.ts> <duramen checkout>"
duramen agree jcs.duramen --impl <dir whose REGEN.json names that driver> --oracle --samples 2000
```

- Node.js 22.23.2: 143 of 143 (71 examples, 24 evidence rows, 42 edge items, 3 properties, 3
  protocol cases); `agree`: 6000 generated requests, 0 disagreements.
- Node.js 24.16.0 (the module's `engines` is `>=24`): 142 of 143. **JC-009#24 fails**:
  `isCanonical('{"":0,"\"":0}')` answers false right after `isCanonical('{"":0,"\\":0}')` in the
  same process; it is canonical, and answers true on Node.js 22. The cause is V8's JSON.parse,
  which on Node.js 24 misreads an escaped one-character key after an object with the same keys
  and a key that is one backslash (duramen DESIGN.md, "Node.js versions"); `isCanonical` calls
  JSON.parse. The record's claim stands: this is an old-code bug on its declared engine, not a
  wrong claim. Effect in x402-solidarity: `ledger.ts` checks a statement payload with
  `isCanonical(..., { strictIntegers: true })`, so a valid payload can be rejected (a false
  refusal, not a false acceptance) in a process that has just read such a key. Before rows #23
  and #24 existed, the suite passed on Node.js 24 too (142 of 142); a direct probe of the
  module on Node.js 24 found the bug, and the two rows were then added to pin it. Their
  expected values (both true) are written from JC-009, not from the old code's answers.

## Example and row claims

| id | provenance | source | example |
|---|---|---|---|
| IF-001#1 | protocol | duramen driver protocol, as heat-engine | `raw "{not json"` |
| IF-001#2 | protocol | duramen driver protocol, as heat-engine | `canonicalize {"value": 1}` |
| IF-001#3 | protocol | duramen driver protocol, as heat-engine | `canonicalise {"value": 1}` |
| IF-001#4 | protocol | duramen driver protocol, as heat-engine | `canonicalize` |
| IF-001#5 | protocol | duramen driver protocol, as heat-engine | `canonicalize {}` |
| IF-001#6 | protocol | duramen driver protocol, as heat-engine | `isCanonical {"text": 1}` |
| IF-001#7 | protocol | duramen driver protocol, as heat-engine | `canonicalize {"value": 1, "strict": "yes"}` |
| IF-002#1 | protocol | duramen driver protocol, as heat-engine | `raw '{"id":"extra","op":"canonicalize","input":{"value":[1],"note":"x"},"trace":true}'` |
| JC-001#1 | inferred | worked by hand from the requirement | `canonicalize {"value": null}` |
| JC-001#2 | inferred | worked by hand from the requirement | `canonicalize {"value": [true, false, null]}` |
| JC-002#1 | inferred | worked by hand from the requirement | `canonicalize {"value": "\u0008\u0009\u000a\u000c\u000d"}` |
| JC-002#2 | inferred | worked by hand from the requirement | `canonicalize {"value": "\u0000\u000b\u001F"}` |
| JC-002#3 | inferred | worked by hand from the requirement | `canonicalize {"value": "a\"b\\c\/d"}` |
| JC-002#4 | inferred | worked by hand from the requirement | `canonicalize {"value": "\u007f\u2028\u00e9\u20ac\ud83d\ude00"}` |
| JC-003#1 | inferred | worked by hand from the requirement | `canonicalize {"value": "\ud800"}` |
| JC-003#2 | inferred | worked by hand from the requirement | `canonicalize {"value": "x\udc00"}` |
| JC-003#3 | inferred | worked by hand from the requirement | `canonicalize {"value": "\ude00\ud83d"}` |
| JC-003#4 | inferred | worked by hand from the requirement | `canonicalize {"value": ["ok", {"\udc00": 1}]}` |
| JC-003#5 | inferred | worked by hand from the requirement | `canonicalBytes {"value": "\ud83d"}` |
| JC-003#6 | inferred | worked by hand from the requirement | `canonicalize {"value": "\ud83d\ude00"}` |
| JC-004#1 | published | RFC 8785 3.2.2 sample (and 3.2.4 bytes) | `canonicalize {"value": [333333333.33333329, 1E30, 4.50, 2e-3, 0.000000000000000000000000001]}` |
| JC-004#2 | inferred | worked by hand from the requirement | `canonicalize {"value": [100, 1e2, 1.0e2, 100.000]}` |
| JC-004#3 | inferred | worked by hand from the requirement | `canonicalize {"value": -0}` |
| JC-004#4 | inferred | worked by hand from the requirement | `canonicalize {"value": [1e20, 1e21, 0.000001, 1e-7, -1.5]}` |
| JC-004#5 | inferred | worked by hand from the requirement | `canonicalize {"value": 9007199254740993}` |
| JC-005#1 | inferred | worked by hand from the requirement | `canonicalize {"value": [3, 1, 2, [], [{}], ""]}` |
| JC-006#1 | inferred | worked by hand from the requirement | `canonicalize {"value": {"b": 1, "a": {"d": 2, "c": [3]}}}` |
| JC-006#2 | inferred | worked by hand from the requirement | `canonicalize {"value": {"ab": 1, "a": 2, "": 3, "B": 4}}` |
| JC-006#3 | published | RFC 8785 3.2.3 sorting sample | `canonicalize {"value": {"\u20ac": "Euro Sign", "\r": "Carriage Return", "\ufb33": "Hebrew Letter Dalet With Dagesh", "1": "One", "\ud83d\ude00": "Emoji: Grinning Face", "\u0080": "Control", "\u00f6": "Latin Small Letter O With Diaeresis"}}` |
| JC-006#4 | inferred | worked by hand from the requirement | `canonicalize {"value": {"__proto__": 1, "a": 2}}` |
| JC-006#5 | inferred | worked by hand from the requirement | `canonicalize {"value": {"\\": 1, "\"": 2}}` |
| JC-007#1 | inferred | worked by hand from the requirement | `canonicalBytes {"value": "\u20ac"}` |
| JC-007#2 | inferred | worked by hand from the requirement | `canonicalBytes {"value": {"\ud83d\ude00": 1, "\u00e9": 2}}` |
| JC-007#3 | published | RFC 8785 3.2.2 sample (and 3.2.4 bytes) | `canonicalBytes {"value": {"numbers": [333333333.33333329, 1E30, 4.50, 2e-3, 0.000000000000000000000000001], "string": "\u20ac$\u000F\u000aA'\u0042\u0022\u005c\\\"\/", "literals": [null, true, false]}}` |
| JC-008#1 | inferred | worked by hand from the requirement | `canonicalize {"value": {"b": 9007199254740991, "a": [null, "x"]}, "strict": true}` |
| JC-008#2 | inferred | worked by hand from the requirement | `canonicalize {"value": 1.5, "strict": true}` |
| JC-008#3 | inferred | worked by hand from the requirement | `canonicalize {"value": 1.5}` |
| JC-008#4 | inferred | worked by hand from the requirement | `canonicalize {"value": 9007199254740992, "strict": true}` |
| JC-008#5 | inferred | worked by hand from the requirement | `canonicalize {"value": -1, "strict": true}` |
| JC-008#6 | inferred | worked by hand from the requirement | `canonicalize {"value": {"a": [false]}, "strict": true}` |
| JC-008#7 | inferred | worked by hand from the requirement | `canonicalBytes {"value": true, "strict": true}` |
| JC-008#8 | inferred | worked by hand from the requirement | `canonicalize {"value": [0, 1.0, 1e2], "strict": true}` |
| JC-008#9 | inferred | worked by hand from the requirement | `canonicalize {"value": -0, "strict": true}` |
| JC-009#1 | inferred | worked by hand from the requirement | row `\| "{\"a\":1,\"b\":2}" \| \| true \|` |
| JC-009#2 | inferred | worked by hand from the requirement | row `\| "{\"b\":2,\"a\":1}" \| \| false \|` |
| JC-009#3 | inferred | worked by hand from the requirement | row `\| "{\"a\": 1}" \| \| false \|` |
| JC-009#4 | inferred | worked by hand from the requirement | row `\| " {\"a\":1}" \| \| false \|` |
| JC-009#5 | inferred | worked by hand from the requirement | row `\| "{\"a\":1}\n" \| \| false \|` |
| JC-009#6 | inferred | worked by hand from the requirement | row `\| "{\"a\":1.0}" \| \| false \|` |
| JC-009#7 | inferred | worked by hand from the requirement | row `\| "{\"a\":\"\\u0041\"}" \| \| false \|` |
| JC-009#8 | inferred | worked by hand from the requirement | row `\| "\"\\u001f\"" \| \| true \|` |
| JC-009#9 | inferred | worked by hand from the requirement | row `\| "\"\\u001F\"" \| \| false \|` |
| JC-009#10 | inferred | worked by hand from the requirement | row `\| "\"\\/\"" \| \| false \|` |
| JC-009#11 | inferred | worked by hand from the requirement | row `\| "\"/\"" \| \| true \|` |
| JC-009#12 | inferred | worked by hand from the requirement | row `\| "\"\\ud800\"" \| \| false \|` |
| JC-009#13 | inferred | worked by hand from the requirement | row `\| "1e+21" \| \| true \|` |
| JC-009#14 | inferred | worked by hand from the requirement | row `\| "1E+21" \| \| false \|` |
| JC-009#15 | inferred | worked by hand from the requirement | row `\| "1e21" \| \| false \|` |
| JC-009#16 | inferred | worked by hand from the requirement | row `\| "-0" \| \| false \|` |
| JC-009#17 | inferred | worked by hand from the requirement | row `\| "0" \| \| true \|` |
| JC-009#18 | inferred | worked by hand from the requirement | row `\| "null" \| \| true \|` |
| JC-009#19 | inferred | worked by hand from the requirement | row `\| "" \| \| false \|` |
| JC-009#20 | inferred | worked by hand from the requirement | row `\| "nul" \| \| false \|` |
| JC-009#21 | inferred | worked by hand from the requirement | row `\| "{\"a\":1,\"a\":1}" \| \| false \|` |
| JC-009#22 | inferred | worked by hand from the requirement | row `\| "{\"\\\\\":1}" \| \| true \|` |
| JC-009#23 | inferred | worked by hand from the requirement | row `\| "{\"\":0,\"\\\\\":0}" \| \| true \|` |
| JC-009#24 | inferred | worked by hand from the requirement | row `\| "{\"\":0,\"\\\"\":0}" \| \| true \|` |
| JC-009#25 | inferred | worked by hand from the requirement | row `\| "{\"a\":true}" \| \| true \|` |
| JC-009#26 | inferred | worked by hand from the requirement | row `\| "{\"a\":true}" \| true \| false \|` |
| JC-009#27 | inferred | worked by hand from the requirement | row `\| "9007199254740991" \| true \| true \|` |
| JC-009#28 | inferred | worked by hand from the requirement | row `\| "9007199254740992" \| true \| false \|` |
| JC-NUMBERS#1 | published | RFC 8785 Appendix B | row `\| 0 \| "0" \|` |
| JC-NUMBERS#2 | published | RFC 8785 Appendix B | row `\| -0 \| "0" \|` |
| JC-NUMBERS#3 | published | RFC 8785 Appendix B | row `\| 5e-324 \| "5e-324" \|` |
| JC-NUMBERS#4 | published | RFC 8785 Appendix B | row `\| -5e-324 \| "-5e-324" \|` |
| JC-NUMBERS#5 | published | RFC 8785 Appendix B | row `\| 1.7976931348623157e308 \| "1.7976931348623157e+308" \|` |
| JC-NUMBERS#6 | published | RFC 8785 Appendix B | row `\| -1.7976931348623157e308 \| "-1.7976931348623157e+308" \|` |
| JC-NUMBERS#7 | published | RFC 8785 Appendix B | row `\| 9007199254740992 \| "9007199254740992" \|` |
| JC-NUMBERS#8 | published | RFC 8785 Appendix B | row `\| -9007199254740992 \| "-9007199254740992" \|` |
| JC-NUMBERS#9 | published | RFC 8785 Appendix B | row `\| 295147905179352825856 \| "295147905179352830000" \|` |
| JC-NUMBERS#10 | published | RFC 8785 Appendix B | row `\| 9.999999999999997e22 \| "9.999999999999997e+22" \|` |
| JC-NUMBERS#11 | published | RFC 8785 Appendix B | row `\| 1e23 \| "1e+23" \|` |
| JC-NUMBERS#12 | published | RFC 8785 Appendix B | row `\| 1.0000000000000001e23 \| "1.0000000000000001e+23" \|` |
| JC-NUMBERS#13 | published | RFC 8785 Appendix B | row `\| 999999999999999700000 \| "999999999999999700000" \|` |
| JC-NUMBERS#14 | published | RFC 8785 Appendix B | row `\| 999999999999999900000 \| "999999999999999900000" \|` |
| JC-NUMBERS#15 | published | RFC 8785 Appendix B | row `\| 1e21 \| "1e+21" \|` |
| JC-NUMBERS#16 | published | RFC 8785 Appendix B | row `\| 9.999999999999997e-7 \| "9.999999999999997e-7" \|` |
| JC-NUMBERS#17 | published | RFC 8785 Appendix B | row `\| 0.000001 \| "0.000001" \|` |
| JC-NUMBERS#18 | published | RFC 8785 Appendix B | row `\| 333333333.3333332 \| "333333333.3333332" \|` |
| JC-NUMBERS#19 | published | RFC 8785 Appendix B | row `\| 333333333.33333325 \| "333333333.33333325" \|` |
| JC-NUMBERS#20 | published | RFC 8785 Appendix B | row `\| 333333333.3333333 \| "333333333.3333333" \|` |
| JC-NUMBERS#21 | published | RFC 8785 Appendix B | row `\| 333333333.3333334 \| "333333333.3333334" \|` |
| JC-NUMBERS#22 | published | RFC 8785 Appendix B | row `\| 333333333.33333343 \| "333333333.33333343" \|` |
| JC-NUMBERS#23 | published | RFC 8785 Appendix B | row `\| -0.0000033333333333333333 \| "-0.0000033333333333333333" \|` |
| JC-NUMBERS#24 | published | RFC 8785 Appendix B | row `\| 1424953923781206.2 \| "1424953923781206.2" \|` |
