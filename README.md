# Camden Nights

Interactive **Oriole Park at Camden Yards** night-game park map / fan desk for Christopher Boyd (lifelong Baltimore Orioles fan). Orange / black / white night chrome. Fully offline.

**Port:** `http://127.0.0.1:4290/`  
**Offline file:** `dist/camden-nights.html`

## Run

```bash
./run.sh           # build + serve
./run.sh --shots   # build + screenshots + serve
```

Python stdlib + vanilla HTML/CSS/JS only. No npm, no CDNs. Binds **127.0.0.1** only.

## Screens

1. **Night Home** — dusk-to-night animated sky over a stylized park silhouette; EXAMPLE “tonight” card labeled DEMO
2. **Park Map** — interactive SVG of Camden Yards sections (lower bowl, upper deck, warehouse view, bullpens) with hover tooltips; click opens EXAMPLE fan tips
3. **Hot Stove Desk** — EXAMPLE offseason board (fictional free-agent / arbitration placeholders — not real rumors)
4. **Season Timeline** — horizontal scroll of EXAMPLE milestones (Opening Day, rivalry weekends) as demo only
5. **Fan Notes** — localStorage scorebook notepad + night-game packing checklist

## Honesty: EXAMPLE vs public facts

| Kind | What’s here |
|------|-------------|
| **Public facts** | Baltimore Orioles; Oriole Park at Camden Yards; team orange `#DF4601`; black & white; AL East; B&O Warehouse visible beyond RF as a landmark |
| **EXAMPLE / DEMO** | Tonight’s opponent, score, standings, payroll, free-agent targets, arbitration lists, timeline dates, fan tips, any “2026 roster” flavor text |

Never treat EXAMPLE panels as live MLB data or verified 2026 moves.

## Layout

```
camden-nights/
  README.md  build.py  server.py  run.sh
  web/index.html  web/app.css  web/app.js
  dist/camden-nights.html
  tests/screenshot.sh
  screenshots/00-best-home.png
```

Inline build injects CSS/JS via `/*__CSS__*/` and `/*__APP__*/` (same pattern as chelsea-tactics).


---
## Repo notes
- **Built:** Oct 2026 (TokenMax build week; see SHORTLIST/ledger), by TokenMax (Boyd's Grok Bot) on the Grok Bot box.
- **Run:** `./run.sh` (then open the localhost URL it prints).
- Imported from `/workspace/tokenmax/camden-nights` on Oct 23, 2026. node_modules, virtualenvs, logs and files over 20 MB were left out.
