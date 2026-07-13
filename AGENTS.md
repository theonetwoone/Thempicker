# Theme Picker

Client-facing static site to preview four Diætist Danmark WordPress design directions, tweak brand colors and logo, and export choices for development handoff.

## Ownership

- `index.html` — overview landing with live iframe previews (`?embed=1`), Danish client guide, and export handoff instructions
- `{1st,2nd,3rd,4th}/index.html` — live previews (load `block-editor/` exports)
- `shared/brand.json` — site metadata, palette slots, logo list, per-theme CSS variable maps, CDN dependencies
- `shared/picker.js` + `shared/picker.css` — fixed header, palette swap, logo cycle, localStorage, export
- `shared/mobile-base.css` — cross-theme text wrapping and mobile overflow fixes (loaded on previews); fluid `img` rule excludes `.dietitian-avatar` and `.dd-brand-logo` so fixed-size avatars stay square
- `shared/theme-mobile-nav.css` — fixed header height, slide-panel mobile nav without header reflow (loaded on previews); **tablet breakpoint is viewport < 1300px** (`max-width: 1299px` / `min-width: 1300px`)
- `shared/wordpress-unified-tokens.css` — reference Additional CSS for WordPress
- `shared/assets/logos/` — brand SVGs for picker (sync from project root when logos change)

## Local Contracts

- **Palette swap:** labeled swatches show each role (`Blue` → buttons/links, `Brown` → headings, etc.). Click two to swap semantic slots (`primary`, `brown`, `sand`, `green`, `background`, `text`).
- **Appearance:** Light / Dark toggle applies `appearancePresets` from `brand.json` and updates theme CSS variables. Switching mode resets colors to that mode’s originals.
- **Original colors:** reverts palette to the current mode’s preset without changing logo or appearance.
- **Reset all:** restores light mode, default palette, and default logo (`3393C0`).
- **Logo cycle:** header ◀ ▶ cycles only the nine canonical SVGs in `shared/assets/logos/`. Headers/footers use a single `img.dd-brand-logo` (no duplicate text marks or icon circles).
- **Export:** downloads `diaetist-danmark-brand-{theme}.json` and `.css` with unified tokens and theme-specific `:root` overrides. Overview (`index.html`) explains in Danish what to export and email back.
- **Embed previews:** `{id}/?embed=1` hides the picker bar for iframe thumbnails on the overview page; full previews use `{id}/` without the query param.
- **Persistence:** `localStorage` key `dd-theme-picker-state-v1` syncs choices across theme pages.
- **Layout:** `#dd-picker-mount` is `position: fixed`; `--dd-picker-offset` / `--dd-picker-stack-h` (measured via `ResizeObserver`) push theme headers and body content below the picker bar. Color/logo/export controls are **collapsed by default** — click **Customize** to expand; state persists in `localStorage` (`controlsExpanded`). Mobile hamburger menus use fixed-position slide panels (`theme-mobile-nav.css`) with transform slide, backdrop fade, staggered link reveal, header hamburger→X morph, and panel close (X) button; header height stays constant via `--dd-theme-header-h`; scroll lock compensates for scrollbar width. At ≤1299px in picker previews, theme headers are fixed below the picker bar with reserved `padding-top` so hero content is not covered.
- **WordPress:** each `{id}/theme/` folder remains the import source; export CSS supplements `block-editor/additional-css.css`.

## Work Guidance

- GitHub Pages: deploy this folder (or copy to `/docs`). See `README.md`.
- When adding a fifth theme: extend `brand.json` (`themes`, `themeVariableMaps`, `themeDependencies`), add `{id}/index.html`, update picker nav.
- When root logos change, recopy into `shared/assets/logos/` (use `Copy-Item -LiteralPath` for `logo [HEX].svg` names) and update `brand.json` if filenames differ.

## Verification

```bash
cd "Theme picker"
npx --yes serve .
```

Check: overview loads with four live iframe previews and Danish guide; all four full previews render, header nav works, swatch swap updates page colors, export produces valid JSON/CSS. On a narrow viewport (~375px), no horizontal scroll; hamburger menus open/close on all four themes. At tablet widths (768px–1299px), desktop nav links stay hidden and hamburger is shown (no cramped header wrapping).

## Child DOX Index

- `1st/`, `2nd/`, `3rd/`, `4th/` — Variated WordPress exports (each has own `README.md`; no separate AGENTS.md unless scope grows)
