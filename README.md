# Theme Picker — Diætist Danmark

Static client-facing theme picker for GitHub Pages. Lets the client preview four WordPress-ready designs, swap palette colors, cycle logo variants, and export their choices.

## GitHub Pages

1. Push this repo to GitHub.
2. **Settings → Pages → Build and deployment → Source:** Deploy from branch.
3. Set folder to `/Theme picker` (or move `Theme picker/` contents to `/docs` and deploy `/docs`).
4. Open `https://<user>.github.io/<repo>/` (or `/Theme picker/` depending on layout).

Local preview:

```bash
cd "Theme picker"
npx --yes serve .
```

## Structure

| Path | Purpose |
|------|---------|
| `index.html` | Landing page with links to all themes |
| `1st/` … `4th/` | Per-theme preview (`index.html` loads block-editor export) |
| `shared/brand.json` | Site info, palette slots, logos, WP variable maps |
| `shared/picker.js` | Header UI, palette swap, logo cycle, export |
| `shared/wordpress-unified-tokens.css` | Reference CSS for WordPress Additional CSS |

## Client workflow

1. Open the overview and pick a theme.
2. Use the fixed header to jump between themes.
3. **Colors:** each labeled swatch shows what it controls (blue = buttons/links, brown = headings, etc.). Click two to swap roles. Use **Light / Dark** to preview each mode. **Original colors** reverts swaps; **Reset all** also restores logo and light mode.
4. **Logo:** use ◀ ▶ to cycle through brand SVG variants.
5. **Export:** downloads `.json` (full spec) + `.css` (WordPress Additional CSS).

Choices persist in `localStorage` across pages.

## WordPress handoff

After the client picks a theme:

1. Install files from `Theme picker/{id}/theme/` per that folder's `README.md`.
2. Paste exported CSS into **Appearance → Customize → Additional CSS** (or use `shared/wordpress-unified-tokens.css` as base).
3. Upload the exported logo SVG to the media library.
4. Attach the exported JSON to the project brief.

## Brand assets

Logo SVGs live in `shared/assets/logos/` — nine files only (`logo-3D3D3D.svg` … `logo-F5F1EB.svg`, plus `LOGO-black.svg`, `LOGO-red.svg`, `LOGO-white.svg`), synced from project root.
