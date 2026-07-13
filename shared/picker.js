/**
 * Diætist Danmark — unified theme picker
 * Palette swap, logo cycle, localStorage sync, WordPress export
 */
(function () {
  const STORAGE_KEY = "dd-theme-picker-state-v1";
  const sharedBase = resolveSharedBase();

  let brand = null;
  let state = loadState();
  let swapSourceId = null;

  function isEmbedPreview() {
    return new URLSearchParams(window.location.search).get("embed") === "1";
  }

  function resolveSharedBase() {
    const script = document.currentScript;
    if (script?.src) {
      const url = new URL(script.src, window.location.href);
      return url.pathname.replace(/\/[^/]+$/, "/");
    }
    const path = window.location.pathname;
    if (path.includes("/shared/")) return path.replace(/\/[^/]+$/, "/");
    if (/\/(1st|2nd|3rd|4th)\//.test(path)) return path.replace(/\/(1st|2nd|3rd|4th)\/.*$/, "/shared/");
    if (path.endsWith("/Theme picker/") || path.endsWith("/Theme picker/index.html")) {
      return path.replace(/\/?index\.html$/, "").replace(/\/?$/, "/") + "shared/";
    }
    return "./shared/";
  }

  function assetUrl(file) {
    return sharedBase + "assets/logos/" + file;
  }

  function defaultPalette() {
    const p = {};
    (brand?.paletteSlots || []).forEach((slot) => {
      p[slot.id] = slot.default;
    });
    return p;
  }

  function getOriginalPaletteForMode(mode) {
    const m = mode || state.appearance || "light";
    const preset = brand?.appearancePresets?.[m];
    if (!preset) return defaultPalette();
    return { ...preset };
  }

  function isPaletteModified() {
    const original = getOriginalPaletteForMode();
    return (brand?.paletteSlots || []).some(
      (slot) =>
        (state.palette[slot.id] || "").toUpperCase() !== (original[slot.id] || "").toUpperCase()
    );
  }

  function applyAppearanceClass() {
    document.body.classList.toggle("dd-appearance-dark", state.appearance === "dark");
    document.body.classList.toggle("dd-appearance-light", state.appearance !== "dark");
  }

  function setAppearance(mode) {
    state.appearance = mode === "dark" ? "dark" : "light";
    state.palette = getOriginalPaletteForMode();
    swapSourceId = null;
    saveState();
    applyAppearanceClass();
    applyThemeColors();
    refreshPickerUI();
  }

  function revertPalette() {
    state.palette = getOriginalPaletteForMode();
    swapSourceId = null;
    saveState();
    applyThemeColors();
    refreshPickerUI();
  }

  function defaultState() {
    return {
      palette: defaultPalette(),
      appearance: "light",
      logoIndex: 2,
      logoId: "3393C0",
      selectedTheme: null,
      controlsExpanded: false,
    };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...defaultState(),
          ...parsed,
          appearance: parsed.appearance === "dark" ? "dark" : "light",
          controlsExpanded: Boolean(parsed.controlsExpanded),
        };
      }
    } catch (_) {}
    return defaultState();
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function hexToRgb(hex) {
    const h = hex.replace("#", "");
    const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  function rgbToHex(r, g, b) {
    return (
      "#" +
      [r, g, b]
        .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0"))
        .join("")
    );
  }

  function mixHex(a, b, t) {
    const c1 = hexToRgb(a);
    const c2 = hexToRgb(b);
    return rgbToHex(
      c1.r + (c2.r - c1.r) * t,
      c1.g + (c2.g - c1.g) * t,
      c1.b + (c2.b - c1.b) * t
    );
  }

  function darken(hex, amount = 0.15) {
    return mixHex(hex, "#000000", amount);
  }

  function lighten(hex, amount = 0.35) {
    return mixHex(hex, "#ffffff", amount);
  }

  function resolvedPalette() {
    const p = { ...state.palette, white: "#FFFFFF" };
    p.primaryDark = darken(p.primary, 0.18);
    p.greenLight = lighten(p.green, 0.55);
    return p;
  }

  function normalizeLogoState() {
    const logos = brand?.logos || [];
    if (!logos.length) return;

    if (state.logoId) {
      const byId = logos.findIndex((logo) => logo.id === state.logoId);
      if (byId >= 0) {
        state.logoIndex = byId;
        return;
      }
    }

    if (
      typeof state.logoIndex !== "number" ||
      state.logoIndex < 0 ||
      state.logoIndex >= logos.length
    ) {
      const primaryIdx = logos.findIndex((logo) => logo.id === "3393C0");
      state.logoIndex = primaryIdx >= 0 ? primaryIdx : 0;
    }

    state.logoId = logos[state.logoIndex]?.id || logos[0].id;
  }

  function currentLogo() {
    const logos = brand?.logos || [];
    if (!logos.length) return null;

    if (state.logoId) {
      const matched = logos.find((logo) => logo.id === state.logoId);
      if (matched) return matched;
    }

    const index =
      typeof state.logoIndex === "number" && state.logoIndex >= 0 && state.logoIndex < logos.length
        ? state.logoIndex
        : 0;
    return logos[index];
  }

  function cycleLogo(dir = 1) {
    const logos = brand?.logos || [];
    if (!logos.length) return;

    const currentIndex = logos.findIndex((logo) => logo.id === currentLogo()?.id);
    const baseIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex = (baseIndex + dir + logos.length) % logos.length;

    state.logoIndex = nextIndex;
    state.logoId = logos[nextIndex].id;
    saveState();
    applyLogo();
    refreshPickerUI();
  }

  function swapPaletteColors(idA, idB) {
    if (!state.palette[idA] || !state.palette[idB]) return;
    const tmp = state.palette[idA];
    state.palette[idA] = state.palette[idB];
    state.palette[idB] = tmp;
    saveState();
    applyThemeColors();
    refreshPickerUI();
  }

  function applyThemeColors(themeId) {
    const id = themeId || document.body.dataset.ddTheme || state.selectedTheme;
    if (!id || !brand?.themeVariableMaps?.[id]) return;

    const palette = resolvedPalette();
    const map = brand.themeVariableMaps[id];
    const root = document.documentElement;

    Object.entries(map).forEach(([cssVar, slotId]) => {
      const value = palette[slotId];
      if (value) root.style.setProperty(cssVar, value);
    });

    root.style.setProperty("--dd-primary", palette.primary);
    root.style.setProperty("--dd-brown", palette.brown);
    root.style.setProperty("--dd-sand", palette.sand);
    root.style.setProperty("--dd-green", palette.green);
    root.style.setProperty("--dd-background", palette.background);
    root.style.setProperty("--dd-text", palette.text);
    root.style.setProperty("--dd-primary-dark", palette.primaryDark);
    root.style.setProperty("--dd-green-light", palette.greenLight);
  }

  function applyLogo() {
    const logo = currentLogo();
    if (!logo) return;

    const src = assetUrl(logo.file);
    const alt = brand?.site?.name || "Diætist Danmark";

    document
      .querySelectorAll(".dd-picker-brand img, .dd-logo-preview, img.dd-brand-logo")
      .forEach((img) => {
        img.src = src;
        img.alt = alt;
      });
  }

  function buildExportPayload() {
    const themeId = document.body.dataset.ddTheme || state.selectedTheme;
    const theme = brand?.themes?.find((t) => t.id === themeId);
    const palette = resolvedPalette();
    const logo = currentLogo();

    const unifiedCss = [
      "/* Diætist Danmark — unified brand tokens (paste in Appearance → Customize → Additional CSS) */",
      ":root {",
      `  --dd-primary: ${palette.primary};`,
      `  --dd-primary-dark: ${palette.primaryDark};`,
      `  --dd-brown: ${palette.brown};`,
      `  --dd-sand: ${palette.sand};`,
      `  --dd-green: ${palette.green};`,
      `  --dd-green-light: ${palette.greenLight};`,
      `  --dd-background: ${palette.background};`,
      `  --dd-text: ${palette.text};`,
      "}",
      "",
      themeId && brand?.themeVariableMaps?.[themeId]
        ? `/* Theme-specific overrides for ${themeId} */`
        : "/* Apply theme map after selecting a design */",
    ];

    if (themeId && brand?.themeVariableMaps?.[themeId]) {
      unifiedCss.push(":root {");
      Object.entries(brand.themeVariableMaps[themeId]).forEach(([cssVar, slotId]) => {
        unifiedCss.push(`  ${cssVar}: ${palette[slotId]};`);
      });
      unifiedCss.push("}");
    }

    return {
      exportedAt: new Date().toISOString(),
      site: brand?.site,
      selectedTheme: theme
        ? { id: theme.id, name: theme.name, wordpressTemplate: theme.wordpressTemplate }
        : null,
      palette: {
        appearance: state.appearance || "light",
        slots: { ...state.palette },
        resolved: {
          primary: palette.primary,
          primaryDark: palette.primaryDark,
          brown: palette.brown,
          sand: palette.sand,
          green: palette.green,
          greenLight: palette.greenLight,
          background: palette.background,
          text: palette.text,
          white: palette.white,
        },
      },
      logo: {
        id: logo?.id,
        label: logo?.label,
        file: logo?.file,
        tint: logo?.tint,
        source: logo?.source,
        path: "shared/assets/logos/" + logo?.file,
      },
      wordpress: {
        instructions:
          "Paste additionalCss into Appearance → Customize → Additional CSS. Upload the logo SVG to Media Library. Install the chosen theme folder from Theme picker/{id}/theme/ per that theme README.",
        additionalCss: unifiedCss.join("\n"),
        recommendedLogo: logo?.file,
      },
    };
  }

  function downloadFile(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function exportChoices() {
    const payload = buildExportPayload();
    downloadFile(
      `diaetist-danmark-brand-${payload.selectedTheme?.id || "palette"}.json`,
      JSON.stringify(payload, null, 2),
      "application/json"
    );
    downloadFile(
      `diaetist-danmark-brand-${payload.selectedTheme?.id || "palette"}.css`,
      payload.wordpress.additionalCss,
      "text/css"
    );
  }

  function resetAll() {
    state.appearance = "light";
    state.palette = getOriginalPaletteForMode("light");
    state.logoIndex = 2;
    state.logoId = "3393C0";
    swapSourceId = null;
    saveState();
    applyAppearanceClass();
    applyThemeColors();
    applyLogo();
    refreshPickerUI();
  }

  function syncPickerOffset() {
    const mount = document.getElementById("dd-picker-mount");
    if (!mount) return;
    const height = Math.ceil(mount.getBoundingClientRect().height);
    const px = `${height}px`;
    document.documentElement.style.setProperty("--dd-picker-offset", px);
    document.documentElement.style.setProperty("--dd-picker-stack-h", px);
    syncMobileNavInsets();
  }

  function syncMobileNavInsets() {
    const scope = document.querySelector("#dd-theme-root .variated-export");
    if (!scope) return;
    const header = scope.querySelector("header, #header");
    if (!header) return;
    const height = Math.max(64, Math.ceil(header.getBoundingClientRect().height));
    document.documentElement.style.setProperty("--dd-theme-header-h", `${height}px`);
    const pickerOffset = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--dd-picker-offset")
    ) || 0;
    document.documentElement.style.setProperty(
      "--dd-theme-chrome-top",
      `${Math.ceil(pickerOffset + height)}px`
    );
  }

  function bindPickerOffsetSync() {
    const mount = document.getElementById("dd-picker-mount");
    if (!mount || mount.dataset.ddOffsetBound === "true") return;
    mount.dataset.ddOffsetBound = "true";

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(() => syncPickerOffset());
      observer.observe(mount);
    }

    window.addEventListener("resize", syncPickerOffset);
    syncPickerOffset();
  }

  function setControlsExpanded(expanded) {
    state.controlsExpanded = Boolean(expanded);
    saveState();
    syncControlsPanelUI();
    requestAnimationFrame(syncPickerOffset);
  }

  function syncControlsPanelUI() {
    const controls = document.getElementById("dd-picker-controls");
    const toggle = document.getElementById("dd-picker-controls-toggle");
    const expanded = Boolean(state.controlsExpanded);

    controls?.classList.toggle("is-open", expanded);
    toggle?.classList.toggle("is-active", expanded);
    toggle?.setAttribute("aria-expanded", expanded ? "true" : "false");
    if (toggle) {
      toggle.textContent = expanded ? "Hide options" : "Customize";
    }
  }

  function renderPickerBar(container, activeThemeId) {
    const themes = brand?.themes || [];
    const logos = brand?.logos || [];
    const logo = currentLogo();

    container.innerHTML = `
      <div class="dd-picker-bar" role="banner">
        <div class="dd-picker-inner">
          <div class="dd-picker-toolbar">
            <div class="dd-picker-brand">
              <img src="${assetUrl(logo?.file || "logo-3393C0.svg")}" alt="" />
              <div>
                <strong>${brand?.site?.name || "Diætist Danmark"}</strong>
                <span>Theme picker</span>
              </div>
            </div>
            <nav class="dd-picker-nav" aria-label="Theme navigation">
              <a href="${navHref("")}"${!activeThemeId ? ' class="is-active"' : ""}>Overview</a>
              ${themes
                .map(
                  (t) =>
                    `<a href="${navHref(t.folder + "/")}" class="${t.id === activeThemeId ? "is-active" : ""}">${t.shortName}</a>`
                )
                .join("")}
            </nav>
            <button type="button" class="dd-picker-controls-toggle" id="dd-picker-controls-toggle" aria-expanded="${state.controlsExpanded ? "true" : "false"}" aria-controls="dd-picker-controls">
              ${state.controlsExpanded ? "Hide options" : "Customize"}
            </button>
          </div>
          <div class="dd-picker-controls${state.controlsExpanded ? " is-open" : ""}" id="dd-picker-controls">
            <div class="dd-picker-group dd-picker-group--palette">
              <span class="dd-picker-label">Colors</span>
              <div class="dd-appearance-toggle" role="group" aria-label="Preview appearance">
                <button type="button" class="dd-appearance-btn${state.appearance !== "dark" ? " is-active" : ""}" id="dd-appearance-light">Light</button>
                <button type="button" class="dd-appearance-btn${state.appearance === "dark" ? " is-active" : ""}" id="dd-appearance-dark">Dark</button>
              </div>
              <div class="dd-palette-panel">
                <p class="dd-palette-hint">Each swatch shows its role. Click two to swap what they control.</p>
                <div class="dd-swatch-grid" id="dd-swatch-grid"></div>
              </div>
              <button type="button" class="dd-picker-btn" id="dd-revert-colors"${isPaletteModified() ? "" : " disabled"}>Original colors</button>
            </div>
            <div class="dd-picker-group dd-picker-group--logo">
              <span class="dd-picker-label">Logo</span>
              <img class="dd-logo-preview" id="dd-logo-preview" src="${assetUrl(logo?.file || "")}" alt="" />
              <button type="button" class="dd-picker-btn" id="dd-logo-prev" title="Previous logo">◀</button>
              <button type="button" class="dd-picker-btn" id="dd-logo-next" title="Next logo">▶</button>
            </div>
            <div class="dd-picker-group">
              <button type="button" class="dd-picker-btn" id="dd-reset">Reset all</button>
              <button type="button" class="dd-picker-btn dd-picker-btn--accent" id="dd-export">Export</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const swatchGrid = container.querySelector("#dd-swatch-grid");
    (brand?.paletteSlots || []).forEach((slot) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "dd-swatch-item";
      btn.title = `${slot.label}: ${slot.description}. Click two to swap roles.`;
      btn.dataset.slotId = slot.id;
      btn.innerHTML = `
        <span class="dd-swatch-dot" style="background-color: ${state.palette[slot.id] || slot.default}"></span>
        <span class="dd-swatch-meta">
          <strong>${slot.shortLabel || slot.label}</strong>
          <span>${slot.description || ""}</span>
        </span>
      `;
      btn.addEventListener("click", () => onSwatchClick(slot.id, btn));
      swatchGrid.appendChild(btn);
    });

    container.querySelector("#dd-appearance-light")?.addEventListener("click", () => setAppearance("light"));
    container.querySelector("#dd-appearance-dark")?.addEventListener("click", () => setAppearance("dark"));
    container.querySelector("#dd-revert-colors")?.addEventListener("click", revertPalette);

    container.querySelector("#dd-logo-prev")?.addEventListener("click", () => cycleLogo(-1));
    container.querySelector("#dd-logo-next")?.addEventListener("click", () => cycleLogo(1));
    container.querySelector("#dd-reset")?.addEventListener("click", resetAll);
    container.querySelector("#dd-export")?.addEventListener("click", exportChoices);

    container.querySelector("#dd-picker-controls-toggle")?.addEventListener("click", () => {
      setControlsExpanded(!state.controlsExpanded);
    });

    syncControlsPanelUI();
    bindPickerOffsetSync();
  }

  function onSwatchClick(slotId, btn) {
    if (!swapSourceId) {
      swapSourceId = slotId;
      document.querySelectorAll(".dd-swatch-item").forEach((s) => s.classList.remove("is-selected"));
      btn.classList.add("is-selected");
      return;
    }
    if (swapSourceId === slotId) {
      swapSourceId = null;
      btn.classList.remove("is-selected");
      return;
    }
    swapPaletteColors(swapSourceId, slotId);
    swapSourceId = null;
    document.querySelectorAll(".dd-swatch-item").forEach((s) => s.classList.remove("is-selected"));
  }

  function refreshPickerUI() {
    const logo = currentLogo();
    const preview = document.getElementById("dd-logo-preview");
    if (preview && logo) preview.src = assetUrl(logo.file);

    document.querySelectorAll(".dd-swatch-item").forEach((btn) => {
      const id = btn.dataset.slotId;
      const dot = btn.querySelector(".dd-swatch-dot");
      if (id && state.palette[id] && dot) dot.style.backgroundColor = state.palette[id];
    });

    document.querySelectorAll(".dd-appearance-btn").forEach((btn) => {
      const isDark = btn.id === "dd-appearance-dark";
      btn.classList.toggle("is-active", isDark ? state.appearance === "dark" : state.appearance !== "dark");
    });

    const revertBtn = document.getElementById("dd-revert-colors");
    if (revertBtn) revertBtn.disabled = !isPaletteModified();

    const brandImg = document.querySelector(".dd-picker-brand img");
    if (brandImg && logo) brandImg.src = assetUrl(logo.file);
  }

  function navHref(path) {
    const loc = window.location.pathname;
    let base = loc;
    if (/\/(1st|2nd|3rd|4th)(\/|$)/.test(loc)) {
      base = loc.replace(/\/(1st|2nd|3rd|4th)\/.*$/, "/");
    } else {
      base = loc.replace(/\/?index\.html$/, "/");
    }
    if (!base.endsWith("/")) base += "/";
    return base + path;
  }

  async function loadBrand() {
    const res = await fetch(sharedBase + "brand.json");
    brand = await res.json();
    if (!Object.keys(state.palette).length) state.palette = getOriginalPaletteForMode();
    if (!state.appearance) state.appearance = "light";
    normalizeLogoState();
    saveState();
  }

  async function initPicker(options = {}) {
    await loadBrand();
    const { mount = "#dd-picker-mount", themeId = null, mode = "bar", skipBar = false } = options;

    if (themeId) {
      state.selectedTheme = themeId;
      document.body.dataset.ddTheme = themeId;
      saveState();
    }

    document.body.classList.add("dd-has-picker");

    const mountEl = document.querySelector(mount);
    if (mountEl && mode === "bar" && !skipBar) {
      renderPickerBar(mountEl, themeId);
    }

    applyAppearanceClass();
    applyThemeColors(themeId);
    applyLogo();

    return { brand, state, exportChoices, applyThemeColors, applyLogo };
  }

  async function loadThemePreview(themeId) {
    await loadBrand();
    const embed = isEmbedPreview();
    if (embed) document.body.classList.add("dd-embed-preview");

    const theme = brand.themes.find((t) => t.id === themeId);
    if (!theme) throw new Error("Unknown theme: " + themeId);

    const deps = brand.themeDependencies[themeId];
    const base = "./";

    deps.css.forEach((href) => {
      if (!document.querySelector(`link[href="${href}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        document.head.appendChild(link);
      }
    });

    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = base + "block-editor/additional-css.css";
    document.head.appendChild(cssLink);

    const pickerCss = document.createElement("link");
    pickerCss.rel = "stylesheet";
    pickerCss.href = sharedBase + "picker.css";
    document.head.appendChild(pickerCss);

    const mobileCss = document.createElement("link");
    mobileCss.rel = "stylesheet";
    mobileCss.href = sharedBase + "mobile-base.css";
    document.head.appendChild(mobileCss);

    const themeNavCss = document.createElement("link");
    themeNavCss.rel = "stylesheet";
    themeNavCss.href = sharedBase + "theme-mobile-nav.css";
    document.head.appendChild(themeNavCss);

    const root = document.getElementById("dd-theme-root");
    const htmlRes = await fetch(base + "block-editor/page-content.html");
    root.innerHTML = await htmlRes.text();

    for (const src of deps.js) {
      await loadScript(src);
    }

    await loadScript(base + "assets/script.js");

    await initPicker({ themeId, mount: "#dd-picker-mount", skipBar: embed });

    if (themeId === "4th" && window.lucide) window.lucide.createIcons();
    if (themeId === "3rd" && window.AOS) window.AOS.init({ once: true, duration: 800 });

    requestAnimationFrame(() => {
      applyLogo();
      syncPickerOffset();
      initThemeNavigation();
    });
  }

  function initThemeNavigation() {
    const scope = document.querySelector("#dd-theme-root .variated-export");
    if (!scope || scope.dataset.ddNavInit === "1") return;
    scope.dataset.ddNavInit = "1";

    function lockScroll() {
      const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);
      const pad = `${scrollbarWidth}px`;
      document.documentElement.style.setProperty("--dd-scroll-lock-pad", pad);
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = pad;
      const mount = document.getElementById("dd-picker-mount");
      if (mount) mount.style.paddingRight = pad;
      document.body.classList.add("dd-mobile-nav-open");
    }

    function unlockScroll() {
      document.documentElement.style.setProperty("--dd-scroll-lock-pad", "0px");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      const mount = document.getElementById("dd-picker-mount");
      if (mount) mount.style.paddingRight = "";
      document.body.classList.remove("dd-mobile-nav-open");
    }

    function ensureOverlay() {
      let overlay = scope.querySelector(".dd-mobile-nav-overlay");
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "dd-mobile-nav-overlay";
        overlay.setAttribute("aria-hidden", "true");
        scope.insertBefore(overlay, scope.firstChild);
      }
      return overlay;
    }

    function ensureMobileNavClose(panel) {
      if (!panel || panel.querySelector(".dd-mobile-nav-close, .mobile-nav-close")) return;
      const closeBtn = document.createElement("button");
      closeBtn.type = "button";
      closeBtn.className = "dd-mobile-nav-close";
      closeBtn.setAttribute("aria-label", "Luk menu");
      closeBtn.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        closeAllMobileNavs();
      });
      panel.insertBefore(closeBtn, panel.firstChild);
    }

    function activateAnimated(panel, overlay) {
      panel.classList.remove("active");
      if (overlay) overlay.classList.remove("is-active", "active");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          panel.classList.add("active");
          panel.setAttribute("aria-hidden", "false");
          if (overlay) {
            overlay.classList.add(overlay.classList.contains("dd-mobile-nav-overlay") ? "is-active" : "active");
            overlay.setAttribute("aria-hidden", "false");
          }
        });
      });
    }

    function closeAllMobileNavs() {
      scope.querySelectorAll(".mobile-nav.active, .mobile-nav-panel.active, .nav-menu.active").forEach((el) => {
        el.classList.remove("active");
        el.setAttribute("aria-hidden", "true");
      });
      scope.querySelectorAll(".menu-toggle.active, #menuToggle.active, .mobile-menu-btn.active").forEach((el) => {
        el.classList.remove("active");
      });

      const overlay4 = scope.querySelector("#mobile-nav-overlay");
      if (overlay4) {
        overlay4.classList.remove("active");
        overlay4.setAttribute("aria-hidden", "true");
      }

      const sharedOverlay = scope.querySelector(".dd-mobile-nav-overlay");
      if (sharedOverlay) {
        sharedOverlay.classList.remove("is-active");
        sharedOverlay.setAttribute("aria-hidden", "true");
      }

      unlockScroll();
    }

    function openSlideNav(toggle, panel) {
      const wasOpen = panel.classList.contains("active");
      closeAllMobileNavs();
      if (wasOpen) return;
      syncMobileNavInsets();
      ensureMobileNavClose(panel);
      toggle.classList.add("active");
      const overlay = ensureOverlay();
      overlay.onclick = closeAllMobileNavs;
      activateAnimated(panel, overlay);
      lockScroll();
    }

    function bindSlideNav(toggleSelector, panelSelector) {
      const toggle = scope.querySelector(toggleSelector);
      const panel = scope.querySelector(panelSelector);
      if (!toggle || !panel) return;

      ensureMobileNavClose(panel);
      const existingClose = panel.querySelector(".dd-mobile-nav-close, .mobile-nav-close");
      existingClose?.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        closeAllMobileNavs();
      });

      toggle.setAttribute("type", "button");
      toggle.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (panel.classList.contains("active")) closeAllMobileNavs();
        else openSlideNav(toggle, panel);
      });

      panel.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeAllMobileNavs);
      });
    }

    bindSlideNav("#menu-toggle", "#mobile-nav");
    bindSlideNav("#menuToggle", "#mobile-nav");

    const menuBtn = scope.querySelector("#mobile-menu-btn");
    const navPanel = scope.querySelector("#mobile-nav-panel");
    const navOverlay = scope.querySelector("#mobile-nav-overlay");
    const navClose = scope.querySelector("#mobile-nav-close");

    if (menuBtn && navPanel) {
      menuBtn.setAttribute("type", "button");

      const openTheme4Nav = () => {
        closeAllMobileNavs();
        syncMobileNavInsets();
        menuBtn.classList.add("active");
        if (navOverlay) navOverlay.onclick = closeAllMobileNavs;
        activateAnimated(navPanel, navOverlay);
        lockScroll();
        if (window.lucide) window.lucide.createIcons();
      };

      menuBtn.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (navPanel.classList.contains("active")) closeAllMobileNavs();
        else openTheme4Nav();
      });

      navClose?.addEventListener("click", closeAllMobileNavs);
      navOverlay?.addEventListener("click", closeAllMobileNavs);
      navPanel.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeAllMobileNavs);
      });
    }

    ensureOverlay();
    syncMobileNavInsets();
    window.addEventListener("resize", syncMobileNavInsets);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeAllMobileNavs();
    });
  }

  function runDeferredDomReady() {
    if (document.readyState !== "loading") {
      document.dispatchEvent(new Event("DOMContentLoaded"));
    }
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        runDeferredDomReady();
        resolve();
        return;
      }
      const s = document.createElement("script");
      s.src = src;
      s.onload = () => {
        runDeferredDomReady();
        resolve();
      };
      s.onerror = reject;
      document.body.appendChild(s);
    });
  }

  window.DDThemePicker = {
    initPicker,
    loadThemePreview,
    exportChoices,
    applyThemeColors,
    applyLogo,
    syncPickerOffset,
    syncMobileNavInsets,
    initThemeNavigation,
    getState: () => state,
    getBrand: () => brand,
  };
})();
