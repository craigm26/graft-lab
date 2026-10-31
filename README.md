# graft-lab

Graft's test lab: replays of public forks for graftfork.com's experiments. Each branch mirrors a permissively licensed open-source project; history and authorship are kept as they were.

## What is here

Each case is a real public fork that once merged an upstream release itself. For case `<slug>`:

- `case/<slug>` is the fork's branch just before that merge (commit P). It sits on upstream release tag A, with the fork's own commits on top, and its full history.
- `truth/<slug>` is the fork's own merge of upstream release tag B (commit M). Its first parent is P and its second parent is the commit at tag B.

E1 cases merged cleanly. E2 cases had conflicts, which the fork's author resolved by hand. Tags are not mirrored here; tag A's and tag B's commits are in the history and the tag names are in the table.

## Ownership

The code on every case and truth branch belongs to its authors and is used under the upstream project's license (listed per case). Nothing here is relicensed. Commits, authors and dates are unchanged.

## Cases

| Branch suffix | Exp. | Upstream | Fork | License | Tag A | Tag B |
|---|---|---|---|---|---|---|
| `anthropic-sdk-python-simonw-v0-38-0` | E1 | [anthropics/anthropic-sdk-python](https://github.com/anthropics/anthropic-sdk-python) | [simonw/anthropic-sdk-python](https://github.com/simonw/anthropic-sdk-python) | Apache-2.0 | `v0.37.1` | `v0.38.0` |
| `changedetection-mlatorre31-0-45-7-3` | E1 | [dgtlmoon/changedetection.io](https://github.com/dgtlmoon/changedetection.io) | [mlatorre31/changedetection.io](https://github.com/mlatorre31/changedetection.io) | Apache-2.0 | `0.45.2` | `0.45.7.3` |
| `changedetectionio-constantin1489-0-45-23` | E1 | [dgtlmoon/changedetection.io](https://github.com/dgtlmoon/changedetection.io) | [Constantin1489/changedetection.io](https://github.com/Constantin1489/changedetection.io) | Apache-2.0 | `0.45.22` | `0.45.23` |
| `commanderjs-gylove1994-v9-4-1` | E1 | [tj/commander.js](https://github.com/tj/commander.js) | [gylove1994/commander.js](https://github.com/gylove1994/commander.js) | MIT | `v9.4.0` | `v9.4.1` |
| `cyberchef-bee-san-v10-4-0` | E1 | [gchq/CyberChef](https://github.com/gchq/CyberChef) | [bee-san/CyberFork](https://github.com/bee-san/CyberFork) | Apache-2.0 | `v9.47.5` | `v10.4.0` |
| `excalidraw-wangshijun-v0-17-5` | E1 | [excalidraw/excalidraw](https://github.com/excalidraw/excalidraw) | [wangshijun/excalidraw-blocklet](https://github.com/wangshijun/excalidraw-blocklet) | MIT | `v0.17.0` | `v0.17.5` |
| `falcon-aydeing-4-3-1` | E1 | [falconry/falcon](https://github.com/falconry/falcon) | [Aydeing/falcon](https://github.com/Aydeing/falcon) | Apache-2.0 | `4.3.0` | `4.3.1` |
| `falcon-tudorgr-4-2-0` | E1 | [falconry/falcon](https://github.com/falconry/falcon) | [TudorGR/falcon](https://github.com/TudorGR/falcon) | Apache-2.0 | `4.2.0rc1` | `4.2.0` |
| `fastapi-bilalalpaslan-0-104-0` | E1 | [fastapi/fastapi](https://github.com/fastapi/fastapi) | [BilalAlpaslan/fastapi](https://github.com/BilalAlpaslan/fastapi) | MIT | `0.96.0` | `0.104.0` |
| `fastapi-jina-ai-0-74-1` | E1 | [fastapi/fastapi](https://github.com/fastapi/fastapi) | [jina-ai/fastapi](https://github.com/jina-ai/fastapi) | MIT | `0.74.0` | `0.74.1` |
| `fastapi-jujumilk3-0-97-0` | E1 | [fastapi/fastapi](https://github.com/fastapi/fastapi) | [jujumilk3/fastapi](https://github.com/jujumilk3/fastapi) | MIT | `0.89.1` | `0.97.0` |
| `fastify-zkasuran-v6-0-0-alpha-5` | E1 | [fastify/fastify](https://github.com/fastify/fastify) | [zkasuran/fastify](https://github.com/zkasuran/fastify) | MIT | `v6.0.0-alpha.3` | `v6.0.0-alpha.5` |
| `homebridge-danieloleary-v2-4-0` | E1 | [homebridge/homebridge](https://github.com/homebridge/homebridge) | [danieloleary/homebridge](https://github.com/danieloleary/homebridge) | Apache-2.0 | `v2.3.1` | `v2.4.0` |
| `hoppscotch-luczkow-2026-9-0` | E1 | [hoppscotch/hoppscotch](https://github.com/hoppscotch/hoppscotch) | [WojciechLuczkow-Flyr/hoppscotch](https://github.com/WojciechLuczkow-Flyr/hoppscotch) | MIT | `2026.8.1` | `2026.9.0` |
| `hoppscotch-nammayatri-2025-9-2` | E1 | [hoppscotch/hoppscotch](https://github.com/hoppscotch/hoppscotch) | [nammayatri/hoppscotch](https://github.com/nammayatri/hoppscotch) | MIT | `2025.9.1` | `2025.9.2` |
| `hoppscotch-rubenpari-2026-10-0` | E1 | [hoppscotch/hoppscotch](https://github.com/hoppscotch/hoppscotch) | [RubenPari/hoppscotch](https://github.com/RubenPari/hoppscotch) | MIT | `2026.9.0` | `2026.10.0` |
| `mermaid-jgraph-mermaid-11-12-2` | E1 | [mermaid-js/mermaid](https://github.com/mermaid-js/mermaid) | [jgraph/mermaid](https://github.com/jgraph/mermaid) | MIT | `mermaid@11.12.1` | `mermaid@11.12.2` |
| `node-red-dennis-seg-4-1-4` | E1 | [node-red/node-red](https://github.com/node-red/node-red) | [Dennis-SEG/node-red](https://github.com/Dennis-SEG/node-red) | Apache-2.0 | `4.1.3` | `4.1.4` |
| `openai-python-marcelpetrick-v2-53-0` | E1 | [openai/openai-python](https://github.com/openai/openai-python) | [marcelpetrick/openai-python](https://github.com/marcelpetrick/openai-python) | Apache-2.0 | `v2.47.0` | `v2.53.0` |
| `openai-python-mukundakatta-v3-16-1` | E1 | [openai/openai-python](https://github.com/openai/openai-python) | [MukundaKatta/openai-python](https://github.com/MukundaKatta/openai-python) | Apache-2.0 | `v2.31.0` | `v3.16.1` |
| `openai-python-quratulain-bil-v2-32-0` | E1 | [openai/openai-python](https://github.com/openai/openai-python) | [Quratulain-bilal/openai-python](https://github.com/Quratulain-bilal/openai-python) | Apache-2.0 | `v2.31.0` | `v2.32.0` |
| `quart-marklark86-0-19-9` | E1 | [pallets/quart](https://github.com/pallets/quart) | [MarkLark86/quart](https://github.com/MarkLark86/quart) | MIT | `0.19.6` | `0.19.9` |
| `saleor-dashboard-ems-press-3-11-3` | E1 | [saleor/saleor-dashboard](https://github.com/saleor/saleor-dashboard) | [ems-press/saleor-dashboard](https://github.com/ems-press/saleor-dashboard) | BSD-3-Clause | `3.11.0` | `3.11.3` |
| `slidev-micooz-v52-13-0` | E1 | [slidevjs/slidev](https://github.com/slidevjs/slidev) | [micooz/slidev](https://github.com/micooz/slidev) | MIT | `v52.12.0` | `v52.13.0` |
| `studio-fgreinacher-asyncapi-studio-0-24-0` | E1 | [asyncapi/studio](https://github.com/asyncapi/studio) | [fgreinacher/studio](https://github.com/fgreinacher/studio) | Apache-2.0 | `@asyncapi/studio@0.23.1` | `@asyncapi/studio@0.24.0` |
| `textual-dhirschfeld-v8-2-7` | E1 | [Textualize/textual](https://github.com/Textualize/textual) | [dhirschfeld/textual](https://github.com/dhirschfeld/textual) | MIT | `v7.4.0` | `v8.2.7` |
| `textual-lenkadea-v1-0-0` | E1 | [Textualize/textual](https://github.com/Textualize/textual) | [LenkaDEA/textual](https://github.com/LenkaDEA/textual) | MIT | `v0.85.2` | `v1.0.0` |
| `textual-nspc911-forks-v8-1-0` | E1 | [Textualize/textual](https://github.com/Textualize/textual) | [NSPC911-forks/textual](https://github.com/NSPC911-forks/textual) | MIT | `v6.6.0` | `v8.1.0` |
| `yargs-forficate-v17-7-2` | E1 | [yargs/yargs](https://github.com/yargs/yargs) | [forficate/yargs](https://github.com/forficate/yargs) | MIT | `v17.7.1` | `v17.7.2` |
| `yargs-pengbouestc-v17-7-2` | E1 | [yargs/yargs](https://github.com/yargs/yargs) | [PengBoUESTC/yargs](https://github.com/PengBoUESTC/yargs) | MIT | `v17.7.1` | `v17.7.2` |
| `aiohttp-neurovert-v3-11-10` | E2 | [aio-libs/aiohttp](https://github.com/aio-libs/aiohttp) | [Neurovert/aiohttp-termux](https://github.com/Neurovert/aiohttp-termux) | Apache-2.0 | `v3.10.11` | `v3.11.10` |
| `anthropic-sdk-python-afloat16-v1-17-0` | E2 | [anthropics/anthropic-sdk-python](https://github.com/anthropics/anthropic-sdk-python) | [Afloat16/anthropic-sdk-python](https://github.com/Afloat16/anthropic-sdk-python) | Apache-2.0 | `v1.16.0` | `v1.17.0` |
| `anthropic-sdk-python-linxiushen-v1-15-0` | E2 | [anthropics/anthropic-sdk-python](https://github.com/anthropics/anthropic-sdk-python) | [Linxiushen/anthropic-sdk-python](https://github.com/Linxiushen/anthropic-sdk-python) | Apache-2.0 | `v1.8.0` | `v1.15.0` |
| `anthropic-sdk-python-xianjianlf2-v1-14-0` | E2 | [anthropics/anthropic-sdk-python](https://github.com/anthropics/anthropic-sdk-python) | [xianjianlf2/anthropic-sdk-python](https://github.com/xianjianlf2/anthropic-sdk-python) | Apache-2.0 | `v1.4.0` | `v1.14.0` |
| `cyberchef-mitre-v10-19-2` | E2 | [gchq/CyberChef](https://github.com/gchq/CyberChef) | [mitre/CyberChef](https://github.com/mitre/CyberChef) | Apache-2.0 | `v10.4.0` | `v10.19.2` |
| `cyberchef-raka-loah-v9-46-4` | E2 | [gchq/CyberChef](https://github.com/gchq/CyberChef) | [Raka-loah/SRK-Toolbox](https://github.com/Raka-loah/SRK-Toolbox) | Apache-2.0 | `v9.32.3` | `v9.46.4` |
| `cyberchef-tonycrane-v10-4-0` | E2 | [gchq/CyberChef](https://github.com/gchq/CyberChef) | [TonyCrane/CyberChef](https://github.com/TonyCrane/CyberChef) | Apache-2.0 | `v9.48.0` | `v10.4.0` |
| `dayjs-xty1992a-v1-10-7` | E2 | [iamkun/dayjs](https://github.com/iamkun/dayjs) | [xty1992a/dayjs](https://github.com/xty1992a/dayjs) | MIT | `v1.8.13` | `v1.10.7` |
| `excalidraw-alkem-io-v0-17-0` | E2 | [excalidraw/excalidraw](https://github.com/excalidraw/excalidraw) | [alkem-io/excalidraw-fork](https://github.com/alkem-io/excalidraw-fork) | MIT | `v0.16.1` | `v0.17.0` |
| `fastapi-yezz123-0-83-0` | E2 | [fastapi/fastapi](https://github.com/fastapi/fastapi) | [yezz123/fastapi](https://github.com/yezz123/fastapi) | MIT | `0.70.1` | `0.83.0` |
| `gunicorn-christianbundy-21-2-0` | E2 | [benoitc/gunicorn](https://github.com/benoitc/gunicorn) | [christianbundy/gunicorn](https://github.com/christianbundy/gunicorn) | MIT | `21.1.0` | `21.2.0` |
| `httpx-httpj-0-28-1` | E2 | [encode/httpx](https://github.com/encode/httpx) | [gtors/httpj](https://github.com/gtors/httpj) | BSD-3-Clause | `0.27.2` | `0.28.1` |
| `langchain-bborn-0-0-154` | E2 | [langchain-ai/langchain](https://github.com/langchain-ai/langchain) | [bborn/langchain](https://github.com/bborn/langchain) | MIT | `v0.0.113` | `v0.0.154` |
| `mitmproxy-ytoku-12-1-2` | E2 | [mitmproxy/mitmproxy](https://github.com/mitmproxy/mitmproxy) | [ytoku/mitmproxy](https://github.com/ytoku/mitmproxy) | MIT | `v11.0.2` | `v12.1.2` |
| `openai-python-aimlapi-v2-24-0` | E2 | [openai/openai-python](https://github.com/openai/openai-python) | [aimlapi/aimlapi-sdk-python](https://github.com/aimlapi/aimlapi-sdk-python) | Apache-2.0 | `v2.8.1` | `v2.24.0` |
| `requests-sigmavirus24-v2-32-2` | E2 | [psf/requests](https://github.com/psf/requests) | [sigmavirus24/requests](https://github.com/sigmavirus24/requests) | Apache-2.0 | `v2.32.1` | `v2.32.2` |
| `saleor-dashboard-jimmykamau-2-11-0` | E2 | [saleor/saleor-dashboard](https://github.com/saleor/saleor-dashboard) | [jimmykamau/saleor-dashboard](https://github.com/jimmykamau/saleor-dashboard) | BSD-3-Clause | `2.10.0` | `2.11.0` |
| `saleor-dashboard-siyoola-3-3-1` | E2 | [saleor/saleor-dashboard](https://github.com/saleor/saleor-dashboard) | [siyoola/saleor-dashboard](https://github.com/siyoola/saleor-dashboard) | BSD-3-Clause | `3.1.0` | `3.3.1` |
| `slidev-yuyinws-v51-7-0` | E2 | [slidevjs/slidev](https://github.com/slidevjs/slidev) | [yuyinws/slidev](https://github.com/yuyinws/slidev) | MIT | `v51.6.2` | `v51.7.0` |
| `starlette-py38deps-1-10-0` | E2 | [encode/starlette](https://github.com/encode/starlette) | [py38deps/starlette](https://github.com/py38deps/starlette) | BSD-3-Clause | `1.9.0` | `1.10.0` |
| `starlette-tekumara-0-45-2` | E2 | [encode/starlette](https://github.com/encode/starlette) | [tekumara/starlette](https://github.com/tekumara/starlette) | BSD-3-Clause | `0.41.2` | `0.45.2` |
| `textual-nijingzhe-v8-2-2` | E2 | [Textualize/textual](https://github.com/Textualize/textual) | [NiJingzhe/textual](https://github.com/NiJingzhe/textual) | MIT | `v8.2.1` | `v8.2.2` |
| `uvicorn-reallistic-0-11-3` | E2 | [encode/uvicorn](https://github.com/encode/uvicorn) | [reallistic/uvicorn](https://github.com/reallistic/uvicorn) | BSD-3-Clause | `0.9.0` | `0.11.3` |
| `uvicorn-socratescli-0-32-0` | E2 | [encode/uvicorn](https://github.com/encode/uvicorn) | [socratescli/uvicorn](https://github.com/socratescli/uvicorn) | BSD-3-Clause | `0.30.3` | `0.32.0` |
