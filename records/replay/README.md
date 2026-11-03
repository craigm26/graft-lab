# Signed records of the heat-engine replay

These are the signed records of the three change orders shown on graftfork.com/regen/replay, each a blind rebuild of
heat-engine from an edited duramen record on a branch of this repository:

| Record | Branch | Change | Suite | Answers compared | Changed that the record didn't ask for |
|---|---|---|---|---|---|
| po1qEN54ReZWLwQmIakuqQ.json | lab/heat-78 | green starts at 78 °F (breaking) | 215/215 | 1,892 | 0 |
| 6wwJt3NhpaD7pa7INWuJpg.json | lab/heat-units | a new reject rule (additive) | 217/217 | 1,960 | 0 |
| 8ijUl7wBOYkwN21ATgZHgA.json | lab/heat-rename | a label rename (prose only) | 215/215 | 1,760 | 0 |

Each record is signed by graftfork.com with Ed25519. Anyone can check one, with no account:

    npx graftfork verify-record records/replay/po1qEN54ReZWLwQmIakuqQ.json

It fetches the public key from https://graftfork.com/.well-known/graft-record-key and checks the signature. To check
offline, pass the key file with `--keys`.
