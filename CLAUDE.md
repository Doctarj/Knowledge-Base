# kb-v2: Club Support Inc. Knowledge Base (SPFx web part)

## Overview
An SPFx web part that serves as the internal IT knowledge base for **Club Support Inc.** on SharePoint. It's used by support staff for client clubs: golf, country, yacht and city clubs in ON, BC, AB and the US.
It has brand styling, 88 clients with search and region filters, SOPs, tabbed client documentation with screenshots and photo galleries, and internal policies.

The planned KB has four sections: **Clients**, **Technical Library**, **Process Playbooks** and **Internal Operations**.

## Toolchain
- SPFx **1.20.0**, React 17, TypeScript 4.7, gulp 4. Versions 1.19+ hit a known Webpack 5 bug, and 1.20.0 is the version that worked.
- Node **20.11.0** via NVM. `package.json` `engines` says `>=18.17.1 <19`, but builds pass on 20.11.
- Release build: `npx gulp clean`, then `npx gulp bundle --ship`, then `npx gulp package-solution --ship`. This produces `sharepoint/solution/kbv-2.sppkg`, which gets uploaded to the App Catalog.
- `lib/`, `dist/`, `release/`, `temp/` and `sharepoint/solution/` are build output. Never edit them.
- Python tooling lives in `tools/.venv`. To recreate it: `python -m venv tools/.venv`, then `tools/.venv/Scripts/python -m pip install python-docx Pillow odfpy openpyxl`.

## Code layout
```
src/webparts/knowledgeBase2/
  components/KnowledgeBase2.tsx   UI: CLIENTS list, SOPS, pages, doc renderer, gallery, lightbox
  data/types.ts                   DocBlock / TreeNode / Photo / ClientTree types
  data/json.d.ts                  `*.json` module declaration (keeps tsc from parsing huge JSON)
  data/clientLoaders.ts           GENERATED: lazy import() map for each client and photo gallery
  data/clients/<CODE>.json        one client's documentation tree (docs + screenshots)
  data/clients/<CODE>/pNN.json    one photo gallery (generated)
tools/
  extract_sources.py              unzip source-docs/<REGION>/*.zip into source-docs/_extracted (handles long paths)
  build_kb_data.py                convert extracted docs into data/clients/*.json and regenerate clientLoaders.ts
```

### Lazy loading
Each client JSON and each photo gallery is its own webpack chunk, loaded only when opened. This keeps the main bundle at about 72 KB; it used to be 1.4 MB with all data inline. Don't import client JSON statically.

## Data model
`CLIENTS[].code` must equal the JSON file name / `CLIENT_LOADERS` key. A mismatch hides that client's docs.

```ts
ClientTree = { name, children: TreeNode[] }
TreeNode =
  | { type: "folder", name, children, note? }             // card grid; a single non-folder child opens directly
  | { type: "file",   name, blocks: DocBlock[] }
  | { type: "files",  tabs: [{ tab, blocks }] }            // tabbed documents
  | { type: "photos", name, chunk, count, note? }          // lazily loaded gallery (new clients)
  | { type: "photos", photos: [{ name, b64, w, h }] }      // inline gallery (older clients)
DocBlock types:
  p      paragraph; "\n" is a line break; a short line ending in ":" renders as a bold label
  sub    subheading
  step   {num, text}, a numbered step
  list   {items, level?}, a bullet list
  table  {rows}, where rows[0] is the header
  image  {b64, w, h}, a JPEG screenshot (click to zoom)
  note   amber callout: NOTE/IMPORTANT/ALL-CAPS remarks
  indent indented template or example text (email bodies, naming formats)
```

Inline text formatting is applied by `highlight()`:
- `[text](https://url)` becomes a link; bare URLs become links too.
- Emails become mailto links.
- UNC paths `\\server\share` are shown as code.
- Phone numbers in the `###-###-####` format are bolded.
- Asset tags in the `A123BC456` pattern are bolded.

## Source documents → KB
Source zips live in `source-docs/<REGION>/<Club>.zip`. Every club uses the same template:
- `Applications/`
- `General/`: Information, Network Drives, New User setup, User disable, Workstation setup, Proper Server Shutdown, Printers, plus any .xlsx
- `Network/`: Overview (.odt or .docx), RDP, VPN, plus any .xlsx
- `Photos/`: nested folders. A .docx inside a photo folder becomes that folder's note.

The converter maps them to:
- **Applications** → one file, or tabs if there are several documents
- **General** → Guides (tabs), Printers (file), spreadsheets (file), loose photos
- **Network** → tabs: Overview, VPN, RDP, spreadsheets
- **Photos** → nested galleries

To add or update clients:
1. Drop the zip into `source-docs/<REGION>/`.
2. Add a `SOURCES` entry in `tools/build_kb_data.py` (`'<REGION>/<zip name without .zip>': ('<CODE>', '<Display name>')`), using the code from `CLIENTS`.
3. Run `python tools/extract_sources.py`.
4. Run `tools/.venv/Scripts/python tools/build_kb_data.py <CODE>`. With no codes it runs on all clients; `--loaders` only regenerates the loader map.
5. Do the release build and upload the `.sppkg`.

Image settings: screenshots are capped at 1000px wide (JPEG q80) and photos at 1280px on the longest side (q62, EXIF orientation fixed). These are set at the top of `build_kb_data.py`.

The 7 older clients (CHG, CMG, CWC, EGR, GLC, PRG, SSG) have no source zips here. Their JSON was migrated from the old inline `CLIENT_TREE`, so edit those files directly.

## Local preview (no SharePoint needed)
1. Run `npx gulp bundle --ship`, then `node tools/preview/build.js`.
2. Serve `temp/preview` with `python -m http.server 8765 --directory temp/preview`. There's also a `kb-preview` entry in `.claude/launch.json`.
3. The harness renders the compiled component with React 17 from cdnjs. Its output in `temp/` is wiped by `gulp clean`, so just rebuild it.

## Status
- **Documented: 21 of 88 clients.**
  - AB: CHG, CMG, CWC, EGR, GLC, PRG, SSG
  - BC: BGR, MDG, PIT, PGR, RIC, SHA, ARB, RVYC, VGC, VLT, VRC
  - US: INV, LCC, TRC
- **Codes fixed:**
  - Glencoe: `GLE` → `GLC`
  - Priddis: `PRI` → `PRG`
  - Royal Canadian Yacht Club: `RVY` → `RCYC`
  - Royal Vancouver Yacht Club: `RVY` → `RVYC`

## Known issues and open tasks
1. **Credentials in content:** source docs include passwords and pre-shared keys (VPN PSKs, Wi-Fi, app logins). They're bundled into the JS and readable by anyone who can load the web part. Consider moving secrets to the CSMS secret system and replacing them with references.
2. **Gaps in the source docs:**
   - Several clubs have an empty Applications folder: MDG, PGR, ARB, RVYC.
   - TRC's "Router + Switches + P2P" spreadsheet is an empty template.
   - Some photo folders are named as to-dos ("update room name", "(I think)").
3. Add documentation for the remaining 67 clients.
4. Build out the planned sections: Technical Library, Process Playbooks and Internal Operations.
5. Fill in the placeholder content in `README.md` and in the `package-solution.json` metadata.
