/* =====================================================================
   Clearwell — main.js (v2 · "Daylight & Blueprint")
   ---------------------------------------------------------------------
   One script for every page. Each feature initialises only when its
   markup exists, so this file runs without errors everywhere.

    1. Config — site + estimator (the editable, white-label layer)
    2. Helpers
    3. Window diagrams (single source for every window drawing)
    4. Site chrome: header, mobile menu, reveal, config items
    5. Components: story, studio, compare, tabs, accordion, quotes
    6. Page features: gallery + lightbox, contact form
    7. Photos: validation, compression, object URLs
    8. Estimator
    9. Init
   ===================================================================== */

(function () {
  'use strict';

  const docEl = document.documentElement;
  docEl.classList.add('js');

  /* ===================================================================
     1. CONFIG
     -------------------------------------------------------------------
     A CMS (WordPress) overrides any key by printing, before this file:
       window.SITE_CONFIG_OVERRIDES = { submissionEndpoint: '…', phone: '…' };
       window.ESTIMATOR_CONFIG_OVERRIDES = { windows: { colors: [ … ] } };
     Objects merge deeply; arrays are replaced whole.
     =================================================================== */

  function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  function deepMerge(base, extra) {
    if (!isPlainObject(extra)) return base;
    const out = { ...base };
    Object.keys(extra).forEach((key) => {
      out[key] = isPlainObject(base[key]) && isPlainObject(extra[key]) ? deepMerge(base[key], extra[key]) : extra[key];
    });
    return out;
  }

  const SITE_CONFIG = deepMerge(
    {
      brandName: 'Clearwell Home Remodeling',
      phone: '', // Add only when supplied by the client
      email: '', // Add only when supplied by the client
      showDevNotes: true, // Set to false before launch
      hidePlaceholderSections: false, // true removes sections marked data-placeholder-section (sample reviews)
      submissionEndpoint: '', // Estimate POST endpoint (multipart/form-data). Empty = development mode.
      contactEndpoint: '', // Contact form POST endpoint (JSON). Empty = development mode.
      draftStorageKey: 'clearwell:estimate-draft:v2',
      draftMaxAgeDays: 7,
    },
    window.SITE_CONFIG_OVERRIDES
  );

  const SUBMISSION_ENDPOINT = SITE_CONFIG.submissionEndpoint || '';
  const CONTACT_ENDPOINT = SITE_CONFIG.contactEndpoint || '';

  if (!SITE_CONFIG.showDevNotes) docEl.classList.add('no-dev-notes');

  /* Finish colors. On-screen approximations — confirm with the client. */
  const FINISH = {
    white: { name: 'White', hex: '#F4F4F0' },
    black: { name: 'Black', hex: '#1F2124' },
    oak: { name: 'Oak', hex: '#A87545' },
    brown: { name: 'Dark Brown', hex: '#4A3428' },
    tan: { name: 'Tan', hex: '#C7AD86' },
    green: { name: 'Green', hex: '#2F4B3A' },
    almond: { name: 'Almond', hex: '#E4D9C3' },
  };

  const ESTIMATOR_CONFIG = deepMerge(
    {
      products: {
        windows: {
          label: 'Replacement Windows',
          short: 'Windows',
          text: 'Count, photos, style, color & grids',
          image: 'assets/images/windows/windows-double-hung-grids',
          size: [1600, 1066],
        },
        bath: {
          label: 'Bath Remodel',
          short: 'Bath Remodel',
          text: 'The areas to update, photos & your style',
          image: 'assets/images/bath/bath-glass-shower',
          size: [1600, 1066],
        },
        both: {
          label: 'Both',
          short: 'Windows + Bath',
          text: 'Windows first, then your bathroom',
          images: ['assets/images/windows/windows-bedroom-white', 'assets/images/bath/bath-oak-vanity'],
        },
      },

      /* ---- WINDOWS — the client's exact flow (CLAUDE.md §4) ---- */
      windows: {
        maxCount: 60,
        quickPicks: [1, 3, 5, 8, 12, 20],
        intro: {
          title: "Looks like you're wanting to replace your windows — great idea!",
          // CLIENT CLAIM — keep verbatim; confirm substantiation before launch (CLAUDE.md §6).
          text: 'Energy efficient windows pay for themselves! You can save up to 60% on your energy bills just by replacing your windows.',
        },
        photoTip: 'Pro Tip: take photos of each side of your home.',
        locations: ['Front', 'Back', 'Left side', 'Right side'],
        styles: [
          { id: 'same', label: 'Same style', text: 'Replace them with the same style you currently have.' },
          { id: 'you-decide', label: 'You decide!', text: 'Let us replace them with the best option for your home.' },
        ],
        /* The client's list is headed "Interior/Exterior": the first color is the interior.
           CONFIRM the orientation of the mixed pairs with the client. */
        colors: [
          { id: 'white-white', label: 'White / White', interior: FINISH.white, exterior: FINISH.white },
          { id: 'black-black', label: 'Black / Black', interior: FINISH.black, exterior: FINISH.black },
          { id: 'white-black', label: 'White / Black', interior: FINISH.white, exterior: FINISH.black },
          { id: 'white-oak', label: 'White / Oak', interior: FINISH.white, exterior: FINISH.oak },
          { id: 'brown-brown', label: 'Dark Brown / Dark Brown', interior: FINISH.brown, exterior: FINISH.brown },
          { id: 'tan-tan', label: 'Tan / Tan', interior: FINISH.tan, exterior: FINISH.tan },
          { id: 'white-green', label: 'White / Green', interior: FINISH.white, exterior: FINISH.green },
          { id: 'white-almond', label: 'White / Almond', interior: FINISH.white, exterior: FINISH.almond },
        ],
        grids: [
          { id: 'none', label: 'No', short: 'None', text: 'Clear, uninterrupted glass.' },
          { id: 'same', label: 'Same style as my current windows', short: 'Match current', text: 'We’ll match the grids you have today.' },
          { id: 'colonial', label: 'Colonial grids', short: 'Colonial', text: 'Evenly divided panes — a classic look.' },
          { id: 'diamond', label: 'Diamond grids', short: 'Diamond', text: 'A diagonal lattice with traditional charm.' },
          { id: 'queen-anne', label: 'Queen Anne grids', short: 'Queen Anne', text: 'Small panes framing a larger center pane.' },
        ],
        // CLIENT COPY — verbatim.
        note: 'All of our window replacements come complete with new framing. Any windows that are on 2nd floor landings, in bathrooms, or are 16" or less from the floor, will be tempered.',
        noteFacts: [
          { icon: 'frame', title: 'New framing', text: 'Included with every replacement' },
          { icon: 'stairs', title: '2nd-floor landings', text: 'Tempered glass' },
          { icon: 'bath', title: 'Bathrooms', text: 'Tempered glass' },
          { icon: 'ruler', title: '16″ or less from the floor', text: 'Tempered glass' },
        ],
      },

      /* ---- BATH — PROVISIONAL until the client's video + item photos arrive (CLAUDE.md §5) ---- */
      bath: {
        provisional: true,
        maxPhotos: 12,
        areas: [
          { id: 'tub-to-shower', label: 'Tub-to-shower conversion', icon: 'convert' },
          { id: 'shower', label: 'Shower', icon: 'shower' },
          { id: 'tub', label: 'Bathtub', icon: 'bath' },
          { id: 'vanity', label: 'Vanity', icon: 'vanity' },
          { id: 'flooring', label: 'Flooring', icon: 'floor' },
          { id: 'walls', label: 'Walls & tile', icon: 'tile' },
          { id: 'toilet', label: 'Toilet', icon: 'toilet' },
          { id: 'full', label: 'Complete remodel', icon: 'sparkle' },
        ],
        looks: [
          { id: 'bright', label: 'Bright & clean', image: 'assets/images/bath/bath-glass-shower', size: [1600, 1066] },
          { id: 'spa', label: 'Spa-like calm', image: 'assets/images/bath/bath-freestanding-tub', size: [1600, 1068] },
          { id: 'marble', label: 'Classic marble', image: 'assets/images/bath/bath-marble-vanity', size: [1600, 1089] },
          { id: 'warm-wood', label: 'Warm wood', image: 'assets/images/bath/bath-oak-vanity', size: [1600, 1200] },
          { id: 'contrast', label: 'Modern contrast', image: 'assets/images/bath/bath-grey-black-sink', size: [1600, 1066] },
          { id: 'natural', label: 'Soft & natural', image: 'assets/images/bath/bath-floating-vanity-sage', size: [1600, 1060] },
        ],
        photoTips: [
          'Shoot from the doorway to capture the whole room',
          'Add close-ups of the tub, shower or vanity',
          'Turn the lights on for clearer photos',
        ],
      },

      copy: {
        steps: {
          contact: { kicker: 'About you', title: 'Let’s start with you.', desc: 'Your name, address, phone and email — so we know where the project is and how to reach you.' },
          project: { kicker: 'Your project', title: 'What can we help you with?', desc: 'Choose one, or both if you’re planning windows and a bathroom.' },
          'w-count': { kicker: 'Windows', title: 'How many windows would you like to replace?', desc: '' },
          'w-photos': { kicker: 'Windows · Photos', title: 'Please upload a photo of each window you’d like to replace.', desc: '' },
          'w-style': { kicker: 'Windows · Style', title: 'Would you like to replace your windows with the same style you currently have, or would you like us to replace your windows with the best option?', desc: '' },
          'w-color': { kicker: 'Windows · Color', title: 'Choose a color for your windows.', desc: 'Each option is interior / exterior. On-screen colors are approximate.' },
          'w-grid': { kicker: 'Windows · Grids', title: 'Would you like grids in your windows?', desc: 'Diagrams are shown in the interior color you chose.' },
          'w-note': { kicker: 'Windows · Good to know', title: 'Included with every window.', desc: '' },
          'b-areas': { kicker: 'Bath', title: 'What would you like to update?', desc: 'Choose everything that applies.' },
          'b-photos': { kicker: 'Bath · Photos', title: 'Show us your bathroom.', desc: 'A wide shot from the doorway, plus close-ups of anything you’d like to change.' },
          'b-looks': { kicker: 'Bath · Style', title: 'Which of these feel like you?', desc: 'Optional — pick any that are close to what you have in mind.' },
          finish: { kicker: 'Finish', title: 'Anything else we should know?', desc: 'Add any additional information, check your details, then hit complete.' },
        },
        // CLIENT COPY — verbatim pop-up text.
        congrats: { title: 'CONGRATS!', text: 'Your estimate has been submitted. You will receive your proposal soon.' },
        completeLabel: 'Complete',
      },
    },
    window.ESTIMATOR_CONFIG_OVERRIDES
  );

  const PHOTO_RULES = {
    maxFileMB: 25,
    maxEdge: 2000, // longest side after compression
    quality: 0.82,
    extensions: /\.(jpe?g|png|webp|heic|heif)$/i,
  };

  /* ===================================================================
     2. HELPERS
     =================================================================== */

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  function on(target, type, handler, options) {
    if (target) target.addEventListener(type, handler, options);
  }

  function esc(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getPath(obj, path) {
    return path.split('.').reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
  }

  function setPath(obj, path, value) {
    const keys = path.split('.');
    const last = keys.pop();
    const target = keys.reduce((acc, key) => {
      if (acc[key] == null || typeof acc[key] !== 'object') acc[key] = {};
      return acc[key];
    }, obj);
    target[last] = value;
  }

  const icon = (name, cls = 'i') =>
    `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;

  function srcset(base, widths = [640, 1024, 1600]) {
    return widths.map((w) => `${base}-${w}.webp ${w}w`).join(', ');
  }

  function imgTag(base, { size = [1600, 1066], sizes = '100vw', alt = '', cls = '' } = {}) {
    return `<img${cls ? ` class="${cls}"` : ''} src="${base}-1024.webp" srcset="${srcset(base)}" sizes="${sizes}" width="${size[0]}" height="${size[1]}" alt="${esc(alt)}" loading="lazy" decoding="async">`;
  }

  const pad2 = (n) => String(n).padStart(2, '0');
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const uid = () => Math.random().toString(36).slice(2, 10);
  const slug = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  function debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  function lockScroll() {
    const gap = window.innerWidth - docEl.clientWidth;
    document.body.style.setProperty('--scrollbar-comp', `${gap}px`);
    document.body.classList.add('is-scroll-locked');
  }

  function unlockScroll() {
    document.body.classList.remove('is-scroll-locked');
    document.body.style.removeProperty('--scrollbar-comp');
  }

  function isDark(hex) {
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 140;
  }

  const W = ESTIMATOR_CONFIG.windows;
  const B = ESTIMATOR_CONFIG.bath;
  const colorById = (id) => W.colors.find((c) => c.id === id);
  const gridById = (id) => W.grids.find((g) => g.id === id);
  const styleById = (id) => W.styles.find((s) => s.id === id);

  /* ===================================================================
     3. WINDOW DIAGRAMS — one generator for the studio, the estimator,
        the spec sheet, the phone mockup and the Windows page.
     =================================================================== */

  const fmt = (n) => Math.round(n * 10) / 10;
  const seg = (x1, y1, x2, y2) => `M${fmt(x1)} ${fmt(y1)}L${fmt(x2)} ${fmt(y2)}`;
  const SASH_UPPER = { x: 17, y: 15, w: 86, h: 60 };
  const SASH_LOWER = { x: 17, y: 85, w: 86, h: 60 };

  function colonialLines(g) {
    return (
      seg(g.x + g.w / 3, g.y, g.x + g.w / 3, g.y + g.h) +
      seg(g.x + (2 * g.w) / 3, g.y, g.x + (2 * g.w) / 3, g.y + g.h) +
      seg(g.x, g.y + g.h / 2, g.x + g.w, g.y + g.h / 2)
    );
  }

  /** Diagonal lattice clipped to the glass rectangle. */
  function diamondLines(g, spacing) {
    let d = '';
    for (let c = -g.h + spacing / 2; c < g.w; c += spacing) {
      const x1 = Math.max(0, c);
      const x2 = Math.min(g.w, c + g.h);
      if (x2 > x1) d += seg(g.x + x1, g.y + x1 - c, g.x + x2, g.y + x2 - c);
    }
    for (let c = spacing / 2; c < g.w + g.h; c += spacing) {
      const x1 = Math.max(0, c - g.h);
      const x2 = Math.min(g.w, c);
      if (x2 > x1) d += seg(g.x + x1, g.y + c - x1, g.x + x2, g.y + c - x2);
    }
    return d;
  }

  /** Small perimeter panes around a large center pane. */
  function queenAnneLines(g, border) {
    let d =
      seg(g.x + border, g.y, g.x + border, g.y + g.h) +
      seg(g.x + g.w - border, g.y, g.x + g.w - border, g.y + g.h) +
      seg(g.x, g.y + border, g.x + g.w, g.y + border) +
      seg(g.x, g.y + g.h - border, g.x + g.w, g.y + g.h - border);
    const innerW = g.w - border * 2;
    for (let i = 1; i < 4; i += 1) {
      const x = g.x + border + (innerW * i) / 4;
      d += seg(x, g.y, x, g.y + border) + seg(x, g.y + g.h - border, x, g.y + g.h);
    }
    const midY = g.y + g.h / 2;
    d += seg(g.x, midY, g.x + border, midY) + seg(g.x + g.w - border, midY, g.x + g.w, midY);
    return d;
  }

  function gridPath(grid) {
    switch (grid) {
      case 'colonial':
      case 'same':
        return colonialLines(SASH_UPPER) + colonialLines(SASH_LOWER);
      case 'diamond':
        return diamondLines(SASH_UPPER, 17.2);
      case 'queen-anne':
        return queenAnneLines(SASH_UPPER, 11);
      default:
        return '';
    }
  }

  function muntinMarkup(grid) {
    const d = gridPath(grid);
    if (!d) return '';
    if (grid === 'same') return `<path class="win__muntin-dashed" d="${d}" stroke-width="1.4" fill="none"/>`;
    return (
      `<path class="win__muntin-edge" d="${d}" stroke-width="4" fill="none" stroke-linecap="square"/>` +
      `<path class="win__muntin" d="${d}" stroke-width="2.6" fill="none" stroke-linecap="square"/>`
    );
  }

  /** Double-hung window elevation. Frame color follows the CSS var --frame. */
  function windowSVG({ grid = 'none', frame = FINISH.white.hex, cls = '' } = {}) {
    return (
      `<svg class="win ${cls}" viewBox="0 0 120 162" style="--frame:${frame}" aria-hidden="true" focusable="false">` +
      '<rect class="win__frame" x="8" y="6" width="104" height="148" rx="3" stroke-width="1"/>' +
      '<rect class="win__frame" x="13" y="11" width="94" height="68" rx="1.5" stroke-width="0.8"/>' +
      '<rect class="win__frame" x="13" y="81" width="94" height="68" rx="1.5" stroke-width="0.8"/>' +
      '<rect class="win__glass" x="17" y="15" width="86" height="60"/>' +
      '<rect class="win__glass" x="17" y="85" width="86" height="60"/>' +
      '<path class="win__glare" d="M17 56 58 15h13L17 69zM17 126l41-41h13l-54 54z"/>' +
      `<g class="win__muntins" data-grid="${grid}">${muntinMarkup(grid)}</g>` +
      '<rect class="win__sill" x="3" y="153" width="114" height="7" rx="1.5" stroke-width="1"/>' +
      '</svg>'
    );
  }

  function updateWindowSVG(svg, { grid, frame } = {}) {
    if (!svg) return;
    if (frame) svg.style.setProperty('--frame', frame);
    if (grid !== undefined) {
      const g = svg.querySelector('.win__muntins');
      if (g && g.dataset.grid !== grid) {
        g.innerHTML = muntinMarkup(grid);
        g.dataset.grid = grid;
      }
    }
  }

  /** Static diagrams in markup: <div data-diagram="window" data-grid data-color data-side> */
  function initDiagrams(root = document) {
    $$('[data-diagram="window"]', root).forEach((el) => {
      const color = colorById(el.dataset.color) || W.colors[0];
      const frame = el.dataset.side === 'exterior' ? color.exterior.hex : color.interior.hex;
      el.innerHTML = windowSVG({ grid: el.dataset.grid || 'none', frame, cls: el.dataset.cls || '' });
    });
    // Split interior/exterior swatches in static markup
    $$('[data-sw]', root).forEach((el) => {
      const color = colorById(el.dataset.sw);
      if (!color) return;
      el.style.setProperty('--int', color.interior.hex);
      el.style.setProperty('--ext', color.exterior.hex);
    });
  }

  /* ===================================================================
     4. SITE CHROME
     =================================================================== */

  function initHeader(header) {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      const y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 8);
      const delta = y - lastY;
      if (Math.abs(delta) > 6) {
        const hide = delta > 0 && y > 560 && !header.contains(document.activeElement);
        header.classList.toggle('is-hidden', hide);
        lastY = y;
      }
      if (y < 560) header.classList.remove('is-hidden');
      ticking = false;
    };

    update();
    on(window, 'scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }, { passive: true });
    on(header, 'focusin', () => header.classList.remove('is-hidden'));
  }

  function initMobileNav() {
    const toggle = $('[data-nav-toggle]');
    const nav = $('[data-mobile-nav]');
    if (!toggle || !nav) return;

    const focusables = () => $$('a[href], button:not([disabled])', nav);

    function onKey(event) {
      if (event.key === 'Escape') {
        close();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    function open() {
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      lockScroll();
      document.addEventListener('keydown', onKey);
      window.setTimeout(() => {
        const target = $('.mobile-nav__link', nav) || focusables()[0];
        if (target) target.focus({ preventScroll: true });
      }, 80);
    }

    function close({ restoreFocus = true } = {}) {
      if (!nav.classList.contains('is-open')) return;
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      unlockScroll();
      document.removeEventListener('keydown', onKey);
      if (restoreFocus) toggle.focus({ preventScroll: true });
    }

    on(toggle, 'click', open);
    $$('[data-nav-close]', nav).forEach((btn) => on(btn, 'click', () => close()));
    $$('a[href]', nav).forEach((link) => on(link, 'click', () => close({ restoreFocus: false })));
    window.matchMedia('(min-width: 1024px)').addEventListener('change', (event) => {
      if (event.matches) close({ restoreFocus: false });
    });
  }

  function initReveal() {
    const items = $$('[data-reveal]');
    if (!items.length) return;

    items.forEach((el) => {
      if (el.dataset.reveal === 'stagger') {
        Array.from(el.children).forEach((child, i) => child.style.setProperty('--i', i));
      }
    });

    if (!('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
    );

    // Anything already on screen is shown immediately — never hidden.
    const vh = window.innerHeight;
    items.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < vh * 0.94 && rect.bottom > 0) el.classList.add('is-in');
      else io.observe(el);
    });
  }

  function initConfigItems() {
    $$('[data-config-item]').forEach((item) => {
      const key = item.dataset.configItem;
      const value = SITE_CONFIG[key];
      if (!value) return;
      const link = $('[data-config-link]', item) || item;
      link.textContent = value;
      if (link.tagName === 'A') {
        link.href = key === 'phone' ? `tel:${value.replace(/[^\d+]/g, '')}` : `mailto:${value}`;
      }
      item.hidden = false;
    });
  }

  function initPlaceholderSections() {
    if (!SITE_CONFIG.hidePlaceholderSections) return;
    $$('[data-placeholder-section]').forEach((el) => el.remove());
  }

  function initYear() {
    const year = String(new Date().getFullYear());
    $$('[data-year]').forEach((el) => {
      el.textContent = year;
    });
  }

  /* ===================================================================
     5. COMPONENTS
     =================================================================== */

  /** Sticky phone that plays the estimate steps as the story scrolls. */
  function initStory(root) {
    const steps = $$('[data-story-step]', root);
    const screens = $$('[data-screen]', root);
    const list = $('[data-story-steps]', root);
    const progress = $('[data-phone-progress]', root);
    const counter = $('[data-phone-count]', root);
    if (!steps.length || !screens.length) return;

    const total = steps.length;
    let current = 0;

    function activate(n) {
      if (n === current) return;
      current = n;
      steps.forEach((s) => s.classList.toggle('is-active', Number(s.dataset.storyStep) === n));
      screens.forEach((s) => s.classList.toggle('is-active', Number(s.dataset.screen) === n));
      if (progress) progress.style.transform = `scaleX(${n / total})`;
      if (counter) counter.textContent = `${pad2(n)} / ${pad2(total)}`;
    }

    const desktop = window.matchMedia('(min-width: 1024px)');
    let io = null;

    function observe() {
      if (io) io.disconnect();
      if (!('IntersectionObserver' in window)) return;
      io = desktop.matches
        ? new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && activate(Number(e.target.dataset.storyStep))),
            { rootMargin: '-46% 0px -46% 0px' }
          )
        : new IntersectionObserver(
            (entries) => entries.forEach((e) => e.isIntersecting && activate(Number(e.target.dataset.storyStep))),
            { root: list, threshold: 0.6 }
          );
      steps.forEach((s) => io.observe(s));
    }

    steps.forEach((step) => {
      on(step, 'click', () => {
        if (desktop.matches) return;
        activate(Number(step.dataset.storyStep));
        list.scrollTo({ left: step.offsetLeft - list.offsetLeft - parseFloat(getComputedStyle(list).paddingLeft || 0), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      });
    });

    desktop.addEventListener('change', observe);
    current = 0;
    activate(1);
    observe();
  }

  /** Color & grid studio — shares ESTIMATOR_CONFIG.windows with the estimator. */
  function initStudio(root) {
    const colorsWrap = $('[data-render="studio-colors"]', root);
    const gridsWrap = $('[data-render="studio-grids"]', root);
    const view = $('[data-studio-view]', root);
    if (!colorsWrap || !gridsWrap || !view) return;

    const s = { color: W.colors[0].id, grid: 'colonial', side: 'interior' };
    const name = root.id || 'studio';

    colorsWrap.innerHTML = W.colors
      .map(
        (c) =>
          `<label class="swatch"><input type="radio" name="${name}-color" value="${c.id}"${c.id === s.color ? ' checked' : ''}>` +
          `<span class="swatch__chip" style="--int:${c.interior.hex};--ext:${c.exterior.hex}"></span>` +
          `<span class="swatch__name">${esc(c.label)}</span></label>`
      )
      .join('');

    gridsWrap.innerHTML = W.grids
      .map(
        (g) =>
          `<label class="grid-opt"><input type="radio" name="${name}-grid" value="${g.id}"${g.id === s.grid ? ' checked' : ''}>` +
          `${windowSVG({ grid: g.id, cls: 'win--on-ink' })}<span class="grid-opt__name">${esc(g.short)}</span></label>`
      )
      .join('');

    view.innerHTML = windowSVG({ grid: s.grid, cls: 'win--on-ink' });
    const big = $('svg', view);
    const colorLabel = $('[data-studio-color-label]', root);
    const gridLabel = $('[data-studio-grid-label]', root);
    const cta = $('[data-studio-cta]', root);

    function update() {
      const color = colorById(s.color);
      const hex = s.side === 'interior' ? color.interior.hex : color.exterior.hex;
      updateWindowSVG(big, { grid: s.grid, frame: hex });
      $$('svg', gridsWrap).forEach((svg) => updateWindowSVG(svg, { frame: hex }));
      if (colorLabel) colorLabel.textContent = `${color.interior.name} inside · ${color.exterior.name} outside`;
      if (gridLabel) gridLabel.textContent = gridById(s.grid).short;
      $$('[data-studio-side]', root).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.studioSide === s.side)));
      if (cta) cta.href = `estimate.html?project=windows&color=${s.color}&grid=${s.grid}`;
    }

    on(colorsWrap, 'change', (e) => {
      s.color = e.target.value;
      update();
    });
    on(gridsWrap, 'change', (e) => {
      s.grid = e.target.value;
      update();
    });
    $$('[data-studio-side]', root).forEach((btn) =>
      on(btn, 'click', () => {
        s.side = btn.dataset.studioSide;
        update();
      })
    );
    update();
  }

  /** Before/after slider: clip-path + transform, backed by a real range input. */
  function initCompare(fig) {
    const stage = $('[data-compare-stage]', fig);
    const before = $('[data-compare-before]', fig);
    const handle = $('[data-compare-handle]', fig);
    const range = $('[data-compare-range]', fig);
    if (!stage || !before || !handle || !range) return;

    let dragging = false;

    function set(pct) {
      const p = clamp(pct, 0, 100);
      before.style.clipPath = `inset(0 ${100 - p}% 0 0)`;
      handle.style.transform = `translateX(${p}%)`;
      range.value = String(Math.round(p));
      range.setAttribute('aria-valuetext', `${Math.round(p)}% before, ${100 - Math.round(p)}% after`);
    }

    const pctFromEvent = (event) => {
      const rect = stage.getBoundingClientRect();
      return ((event.clientX - rect.left) / rect.width) * 100;
    };

    on(stage, 'pointerdown', (event) => {
      if (event.button !== 0) return;
      dragging = true;
      fig.classList.add('is-dragging');
      stage.setPointerCapture(event.pointerId);
      set(pctFromEvent(event));
    });
    on(stage, 'pointermove', (event) => {
      if (dragging) set(pctFromEvent(event));
    });
    const end = (event) => {
      if (!dragging) return;
      dragging = false;
      fig.classList.remove('is-dragging');
      try {
        stage.releasePointerCapture(event.pointerId);
      } catch (err) {
        /* pointer already released */
      }
    };
    on(stage, 'pointerup', end);
    on(stage, 'pointercancel', end);
    on(range, 'input', () => set(Number(range.value)));
    set(Number(range.value) || 50);
  }

  function initTabs(root) {
    const tabs = $$('[role="tab"]', root);
    function select(tab, focus) {
      tabs.forEach((t) => {
        const selected = t === tab;
        t.setAttribute('aria-selected', String(selected));
        t.tabIndex = selected ? 0 : -1;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !selected;
      });
      if (focus) tab.focus();
    }
    tabs.forEach((tab, i) => {
      on(tab, 'click', () => select(tab));
      on(tab, 'keydown', (event) => {
        const map = {
          ArrowRight: tabs[(i + 1) % tabs.length],
          ArrowLeft: tabs[(i - 1 + tabs.length) % tabs.length],
          Home: tabs[0],
          End: tabs[tabs.length - 1],
        };
        const next = map[event.key];
        if (next) {
          event.preventDefault();
          select(next, true);
        }
      });
    });
  }

  function initAccordion(root) {
    $$('[data-accordion-trigger]', root).forEach((btn) =>
      on(btn, 'click', () => {
        const item = btn.closest('.accordion__item');
        const open = !item.classList.contains('is-open');
        item.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', String(open));
      })
    );
  }

  function initQuotes(root) {
    const quotes = $$('[data-quote]', root);
    const counter = $('[data-quotes-count]', root);
    if (quotes.length < 2) return;
    let index = 0;

    function show(n) {
      const prev = quotes[index];
      index = (n + quotes.length) % quotes.length;
      prev.hidden = true;
      prev.classList.remove('is-active', 'is-entering');
      const next = quotes[index];
      next.hidden = false;
      next.classList.add('is-active');
      if (!prefersReducedMotion()) {
        next.classList.remove('is-entering');
        void next.offsetWidth;
        next.classList.add('is-entering');
      }
      if (counter) counter.textContent = `${pad2(index + 1)} / ${pad2(quotes.length)}`;
    }

    on($('[data-quotes-prev]', root), 'click', () => show(index - 1));
    on($('[data-quotes-next]', root), 'click', () => show(index + 1));
  }

  /* ===================================================================
     6. PAGE FEATURES
     =================================================================== */

  /** Our Work: category filter + native <dialog> lightbox. */
  function initGallery(grid) {
    const items = $$('.gallery__item', grid);
    const filters = $$('[data-filter]');
    const dialog = $('[data-lightbox]');

    function applyFilter(value) {
      filters.forEach((f) => f.setAttribute('aria-pressed', String(f.dataset.filter === value)));
      items.forEach((item) => {
        const show = value === 'all' || item.dataset.category === value;
        item.hidden = !show;
        if (show && !prefersReducedMotion()) {
          item.classList.remove('is-entering');
          void item.offsetWidth;
          item.classList.add('is-entering');
        }
      });
    }

    filters.forEach((btn) => {
      const count = $('[data-count]', btn);
      if (count) {
        const n = btn.dataset.filter === 'all' ? items.length : items.filter((i) => i.dataset.category === btn.dataset.filter).length;
        count.textContent = pad2(n);
      }
      on(btn, 'click', () => applyFilter(btn.dataset.filter));
    });

    if (!dialog || typeof dialog.showModal !== 'function') return;
    const img = $('[data-lightbox-img]', dialog);
    const caption = $('[data-lightbox-caption]', dialog);
    const counter = $('[data-lightbox-count]', dialog);
    let visible = [];
    let index = 0;
    let opener = null;

    function show(i) {
      index = (i + visible.length) % visible.length;
      const btn = $('[data-lightbox-src]', visible[index]);
      const base = btn.dataset.lightboxSrc;
      img.src = `${base}-1600.webp`;
      img.srcset = srcset(base, [1024, 1600]);
      img.sizes = '92vw';
      img.width = Number(btn.dataset.w || 1600);
      img.height = Number(btn.dataset.h || 1066);
      img.alt = btn.dataset.caption || '';
      caption.textContent = btn.dataset.caption || '';
      if (counter) counter.textContent = `${pad2(index + 1)} / ${pad2(visible.length)}`;
    }

    items.forEach((item) => {
      const btn = $('[data-lightbox-src]', item);
      on(btn, 'click', () => {
        visible = items.filter((it) => !it.hidden);
        opener = btn;
        show(visible.indexOf(item));
        dialog.showModal();
      });
    });

    on($('[data-lightbox-prev]', dialog), 'click', () => show(index - 1));
    on($('[data-lightbox-next]', dialog), 'click', () => show(index + 1));
    on($('[data-lightbox-close]', dialog), 'click', () => dialog.close());
    on(dialog, 'keydown', (event) => {
      if (event.key === 'ArrowRight') show(index + 1);
      if (event.key === 'ArrowLeft') show(index - 1);
    });
    on(dialog, 'click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    on(dialog, 'close', () => {
      if (opener) opener.focus({ preventScroll: true });
    });
  }

  /* ---- Shared field validation (contact form + estimator) ---- */

  const FIELD_NAMES = {
    'contact.firstName': 'first name',
    'contact.lastName': 'last name',
    'contact.email': 'email address',
    'contact.phone': 'phone number',
    'address.street': 'street address',
    'address.city': 'city',
    'address.region': 'state',
    'address.postalCode': 'ZIP code',
    name: 'name',
    email: 'email address',
    phone: 'phone number',
    address: 'address',
    message: 'message',
  };

  const VALIDATORS = {
    required: (v) => (String(v).trim() ? '' : 'required'),
    email: (v) => (!String(v).trim() || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim()) ? '' : 'Please enter a valid email address, like name@example.com.'),
    phone: (v) => (!String(v).trim() || String(v).replace(/\D/g, '').length >= 7 ? '' : 'Please enter a phone number we can reach you on.'),
    postal: (v) => (!String(v).trim() || /^[A-Za-z0-9][A-Za-z0-9 -]{2,9}$/.test(String(v).trim()) ? '' : 'Please enter a valid ZIP code.'),
    count: (v) => {
      const n = Number(v);
      return Number.isInteger(n) && n >= 1 && n <= W.maxCount ? '' : `Please enter a number between 1 and ${W.maxCount}.`;
    },
  };

  function fieldKey(field) {
    return field.dataset.bind || field.name || field.id;
  }

  function showFieldError(field, message) {
    const err = document.getElementById(`${field.id}-err`);
    field.setAttribute('aria-invalid', 'true');
    field.closest('.field')?.classList.add('has-error');
    if (err) err.textContent = message;
  }

  function clearFieldError(field) {
    const err = document.getElementById(`${field.id}-err`);
    field.removeAttribute('aria-invalid');
    field.closest('.field')?.classList.remove('has-error');
    if (err) err.textContent = '';
  }

  function validateField(field) {
    const rules = (field.dataset.validate || '').split(/\s+/).filter(Boolean);
    for (const rule of rules) {
      const fn = VALIDATORS[rule];
      if (!fn) continue;
      const result = fn(field.value);
      if (result) {
        const message = result === 'required' ? `Please enter your ${FIELD_NAMES[fieldKey(field)] || 'answer'}.` : result;
        showFieldError(field, message);
        return false;
      }
    }
    clearFieldError(field);
    return true;
  }

  function wireLiveValidation(root) {
    $$('[data-validate]', root).forEach((field) => {
      on(field, 'blur', () => {
        if (field.value.trim() || field.hasAttribute('aria-invalid')) validateField(field);
      });
      on(field, 'input', () => {
        if (field.hasAttribute('aria-invalid')) validateField(field);
      });
    });
  }

  /** Contact / in-person quote form. */
  function initContactForm(form) {
    const status = $('[data-contact-status]', form);
    const success = $('[data-contact-success]');
    const submitBtn = $('[type="submit"]', form);
    const typeInputs = $$('[data-contact-type]', form);

    function currentType() {
      const checked = typeInputs.find((i) => i.checked);
      return checked ? checked.value : 'question';
    }

    function syncType() {
      const type = currentType();
      $$('[data-when-type]', form).forEach((el) => {
        el.hidden = el.dataset.whenType !== type;
      });
      $$('[data-required-when]', form).forEach((field) => {
        const required = field.dataset.requiredWhen === type;
        const rules = new Set((field.dataset.validate || '').split(/\s+/).filter(Boolean));
        if (required) rules.add('required');
        else rules.delete('required');
        field.dataset.validate = Array.from(rules).join(' ');
        const optional = form.querySelector(`[data-optional-for="${field.id}"]`);
        if (optional) optional.hidden = required;
        if (!required) clearFieldError(field);
      });
      const label = $('[data-contact-submit-label]', form);
      if (label) label.textContent = type === 'in-person' ? 'Request my in-person quote' : 'Send message';
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('type') === 'in-person') {
      const input = typeInputs.find((i) => i.value === 'in-person');
      if (input) input.checked = true;
    }
    typeInputs.forEach((i) => on(i, 'change', syncType));
    syncType();
    wireLiveValidation(form);

    on(form, 'submit', async (event) => {
      event.preventDefault();
      const fields = $$('[data-validate]', form).filter((f) => !f.closest('[hidden]'));
      const invalid = fields.filter((f) => !validateField(f));
      if (invalid.length) {
        invalid[0].focus();
        return;
      }
      const hp = $('[data-hp]', form);
      const data = Object.fromEntries(new FormData(form).entries());
      delete data.website;
      data.interests = $$('input[name="interests"]:checked', form).map((i) => i.value);
      data.submittedAt = new Date().toISOString();

      submitBtn.classList.add('is-loading');
      submitBtn.disabled = true;
      try {
        if (hp && hp.value) {
          /* bot — pretend success */
        } else if (CONTACT_ENDPOINT) {
          const res = await fetch(CONTACT_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
        } else {
          console.info('[Clearwell contact] Development mode — nothing was sent.', data);
        }
        form.hidden = true;
        if (success) {
          success.hidden = false;
          const dev = $('[data-dev-only]', success);
          if (dev) dev.hidden = Boolean(CONTACT_ENDPOINT);
          success.focus({ preventScroll: false });
        }
      } catch (err) {
        if (status) status.textContent = 'Sorry — your message couldn’t be sent. Please check your connection and try again.';
      } finally {
        submitBtn.classList.remove('is-loading');
        submitBtn.disabled = false;
      }
    });
  }

  /* ===================================================================
     7. PHOTOS — validation, client-side compression, object URLs
     =================================================================== */

  function checkPhoto(file) {
    const typeOk = (file.type && file.type.startsWith('image/')) || PHOTO_RULES.extensions.test(file.name);
    if (!typeOk) return `“${file.name}” isn’t a photo. Please choose a JPG, PNG, HEIC or WEBP image.`;
    if (file.size > PHOTO_RULES.maxFileMB * 1024 * 1024) return `“${file.name}” is larger than ${PHOTO_RULES.maxFileMB} MB.`;
    return '';
  }

  /** Resize large phone photos before upload (keeps uploads fast on mobile data). */
  async function compressPhoto(file) {
    if (!/^image\/(jpeg|png|webp)$/.test(file.type) || typeof createImageBitmap !== 'function') return file;
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
      const scale = Math.min(1, PHOTO_RULES.maxEdge / Math.max(bitmap.width, bitmap.height));
      if (scale === 1 && file.size < 1.5 * 1024 * 1024) {
        bitmap.close();
        return file;
      }
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', PHOTO_RULES.quality));
      if (!blob || blob.size >= file.size) return file;
      return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg', lastModified: Date.now() });
    } catch (err) {
      return file; // HEIC or an unreadable image: send the original
    }
  }

  function makePhoto(file) {
    const photo = { id: uid(), name: file.name, file, upload: file, url: URL.createObjectURL(file) };
    photo.ready = compressPhoto(file).then((result) => {
      photo.upload = result;
      return result;
    });
    return photo;
  }

  function dropPhoto(photo) {
    if (photo && photo.url) URL.revokeObjectURL(photo.url);
  }

  /* ===================================================================
     8. ESTIMATOR
     =================================================================== */

  function initEstimator(root) {
    const C = ESTIMATOR_CONFIG;
    const form = $('[data-est-form]', root);
    const stepsHost = $('[data-est-steps]', root);
    const nextBtn = $('[data-est-next]', root);
    const nextLabel = $('[data-est-next-label]', root);
    const nextIcon = $('[data-est-next-icon]', root);
    const backBtn = $('[data-est-back]', root);
    const hint = $('.est-actions__hint', root);
    const phasesEl = $('[data-est-phases]', root);
    const stepLabel = $('[data-est-steplabel]');
    const progressBar = $('[data-est-progress]');
    const sheetRowsEls = $$('[data-sheet-rows]');
    const sheetDrawing = $('[data-sheet-drawing]');
    const sheetNo = $('[data-sheet-sheetno]');
    const miniCount = $('[data-est-mini-count]');
    const draftBanner = $('[data-draft-banner]', root);
    const hp = $('[data-hp]', root);
    if (!form || !stepsHost) return;

    const KEY = SITE_CONFIG.draftStorageKey;
    const MAX_AGE = SITE_CONFIG.draftMaxAgeDays * 24 * 60 * 60 * 1000;

    /* ---------- State ---------- */

    function createState() {
      return {
        step: 'contact',
        slot: 0,
        returnTo: null,
        contact: { firstName: '', lastName: '', email: '', phone: '' },
        address: { street: '', line2: '', city: '', region: '', postalCode: '' },
        projectType: '',
        windows: { count: '', style: '', color: '', grid: '' },
        slots: [], // per-window notes, parallel to photos.windows: { side, room }
        bath: { areas: [], looks: [] },
        notes: '',
        startedAt: new Date().toISOString(),
      };
    }

    let state = createState();
    const photos = { windows: [], bath: [] }; // in memory only — never persisted
    let touched = false;
    let busy = false;
    let submitted = false;
    let lastSheet = {};

    const hasWindows = () => state.projectType === 'windows' || state.projectType === 'both';
    const hasBath = () => state.projectType === 'bath' || state.projectType === 'both';
    const count = () => {
      const n = parseInt(state.windows.count, 10);
      return Number.isInteger(n) && n > 0 ? Math.min(n, W.maxCount) : 0;
    };
    const windowPhotoCount = () => photos.windows.slice(0, count()).filter(Boolean).length;

    const FLOW = [
      { id: 'contact', phase: 'you' },
      { id: 'project', phase: 'project', choice: { path: 'projectType', message: 'Please choose a project to continue.' } },
      { id: 'w-count', phase: 'windows', when: hasWindows },
      { id: 'w-photos', phase: 'windows', when: hasWindows },
      { id: 'w-style', phase: 'windows', when: hasWindows, choice: { path: 'windows.style', message: 'Please choose one option to continue.' } },
      { id: 'w-color', phase: 'windows', when: hasWindows, choice: { path: 'windows.color', message: 'Please choose a color to continue.' } },
      { id: 'w-grid', phase: 'windows', when: hasWindows, choice: { path: 'windows.grid', message: 'Please choose a grid option to continue.' } },
      { id: 'w-note', phase: 'windows', when: hasWindows },
      { id: 'b-areas', phase: 'bath', when: hasBath, choice: { path: 'bath.areas', message: 'Please choose at least one area to continue.' } },
      { id: 'b-photos', phase: 'bath', when: hasBath },
      { id: 'b-looks', phase: 'bath', when: hasBath },
      { id: 'finish', phase: 'finish' },
    ];
    const PHASE_LABELS = { you: 'You', project: 'Project', windows: 'Windows', bath: 'Bath', finish: 'Finish' };
    const activeSteps = () => FLOW.filter((s) => !s.when || s.when());
    const stepDef = (id) => FLOW.find((s) => s.id === id);

    /* ---------- Drafts (answers only — photos are never stored) ---------- */

    function saveDraft(force = false) {
      if (!touched && !force) return;
      if (submitted) return;
      try {
        const data = {
          v: 2,
          savedAt: Date.now(),
          state: { ...state, returnTo: null },
          hadPhotos: photos.windows.some(Boolean) || photos.bath.length > 0,
        };
        localStorage.setItem(KEY, JSON.stringify(data));
      } catch (err) {
        /* storage full or blocked — drafts are a convenience only */
      }
    }
    const saveDraftSoon = debounce(saveDraft, 350);

    function loadDraft() {
      try {
        const raw = localStorage.getItem(KEY);
        if (!raw) return null;
        const data = JSON.parse(raw);
        if (!data || data.v !== 2 || Date.now() - data.savedAt > MAX_AGE) {
          localStorage.removeItem(KEY);
          return null;
        }
        return data;
      } catch (err) {
        return null;
      }
    }

    function clearDraft() {
      try {
        localStorage.removeItem(KEY);
      } catch (err) {
        /* ignore */
      }
    }

    /* ---------- Templates ---------- */

    function head(id, before = '') {
      const s = C.copy.steps[id] || {};
      const long = (s.title || '').length > 80 ? ' est-step__title--long' : '';
      return (
        `<header class="est-step__head">` +
        `<p class="label est-step__kicker"><span class="label__num" data-step-num></span><span>${esc(s.kicker || '')}</span></p>` +
        before +
        `<h2 class="est-step__title${long}" id="st-${id}" tabindex="-1">${esc(s.title || '')}</h2>` +
        (s.desc ? `<p class="est-step__desc">${esc(s.desc)}</p>` : '') +
        `</header>`
      );
    }

    function field({ id, label, bind, type = 'text', validate = '', autocomplete = '', optional = false, inputmode = '', extra = '' }) {
      return (
        `<div class="field">` +
        `<label class="field__label" for="${id}">${esc(label)}${optional ? ' <span class="field__optional">Optional</span>' : ''}</label>` +
        `<input class="field__input" id="${id}" type="${type}" data-bind="${bind}"` +
        (validate ? ` data-validate="${validate}"` : '') +
        (autocomplete ? ` autocomplete="${autocomplete}"` : '') +
        (inputmode ? ` inputmode="${inputmode}"` : '') +
        ` aria-describedby="${id}-err" ${extra}>` +
        `<p class="field__error" id="${id}-err"></p>` +
        `</div>`
      );
    }

    const check = `<span class="choice__check" aria-hidden="true">${icon('check')}</span>`;
    const stepError = '<p class="step-error" data-step-error role="alert"></p>';

    const TEMPLATES = {
      contact: () =>
        head('contact') +
        `<div class="est-step__body">` +
        `<fieldset class="est-fieldset"><legend class="label"><span class="label__num">A</span> You</legend>` +
        `<div class="field-row">` +
        field({ id: 'e-first', label: 'First name', bind: 'contact.firstName', validate: 'required', autocomplete: 'given-name', extra: 'autocapitalize="words"' }) +
        field({ id: 'e-last', label: 'Last name', bind: 'contact.lastName', validate: 'required', autocomplete: 'family-name', extra: 'autocapitalize="words"' }) +
        `</div><div class="field-row">` +
        field({ id: 'e-phone', label: 'Phone', bind: 'contact.phone', type: 'tel', validate: 'required phone', autocomplete: 'tel', inputmode: 'tel' }) +
        field({ id: 'e-email', label: 'Email', bind: 'contact.email', type: 'email', validate: 'required email', autocomplete: 'email', inputmode: 'email', extra: 'autocapitalize="off" spellcheck="false"' }) +
        `</div></fieldset>` +
        `<fieldset class="est-fieldset"><legend class="label"><span class="label__num">B</span> Project address</legend>` +
        field({ id: 'e-street', label: 'Street address', bind: 'address.street', validate: 'required', autocomplete: 'address-line1' }) +
        field({ id: 'e-line2', label: 'Apartment, unit, etc.', bind: 'address.line2', autocomplete: 'address-line2', optional: true }) +
        `<div class="field-row field-row--3">` +
        field({ id: 'e-city', label: 'City', bind: 'address.city', validate: 'required', autocomplete: 'address-level2' }) +
        field({ id: 'e-region', label: 'State', bind: 'address.region', validate: 'required', autocomplete: 'address-level1' }) +
        field({ id: 'e-postal', label: 'ZIP code', bind: 'address.postalCode', validate: 'required postal', autocomplete: 'postal-code', inputmode: 'numeric' }) +
        `</div></fieldset>` +
        `<p class="est-alt">Prefer to meet in person? <a class="link-line" href="contact.html?type=in-person">Request an in-person quote ${icon('arrow-ur')}</a></p>` +
        `</div>`,

      project: () => {
        const P = C.products;
        const media = (key) =>
          key === 'both'
            ? `<span class="choice__media choice__media--split">${P.both.images.map((b) => imgTag(b, { sizes: '(min-width: 768px) 130px, 50vw' })).join('')}</span>`
            : `<span class="choice__media">${imgTag(P[key].image, { size: P[key].size, sizes: '(min-width: 768px) 260px, 100vw' })}</span>`;
        return (
          head('project') +
          `<fieldset class="est-step__body"><legend class="visually-hidden">Project type</legend>` +
          `<div class="choice-grid choice-grid--3">` +
          ['windows', 'bath', 'both']
            .map(
              (key, i) =>
                `<label class="choice choice--media"><input class="choice__input" type="radio" name="projectType" value="${key}" data-bind="projectType">` +
                media(key) +
                `<span class="choice__body"><span class="choice__num">Nº ${pad2(i + 1)}</span><span class="choice__title">${esc(P[key].label)}</span><span class="choice__text">${esc(P[key].text)}</span></span>${check}</label>`
            )
            .join('') +
          `</div></fieldset>${stepError}`
        );
      },

      'w-count': () =>
        head(
          'w-count',
          `<aside class="est-callout">${icon('sun')}<div><p class="est-callout__title">${esc(W.intro.title)}</p><p>${esc(W.intro.text)}</p></div></aside>`
        ) +
        `<div class="est-step__body">` +
        `<div class="counter">` +
        `<button class="counter__btn" type="button" data-count-step="-1" aria-label="One fewer window">${icon('minus')}</button>` +
        `<div class="counter__value"><label class="visually-hidden" for="e-count">Number of windows</label>` +
        `<input class="counter__input" id="e-count" type="number" inputmode="numeric" min="1" max="${W.maxCount}" step="1" data-bind="windows.count" data-validate="count" aria-describedby="e-count-err" placeholder="0">` +
        `<span class="counter__unit label" data-count-unit>windows</span></div>` +
        `<button class="counter__btn" type="button" data-count-step="1" aria-label="One more window">${icon('plus')}</button>` +
        `</div>` +
        `<p class="field__error field__error--center" id="e-count-err"></p>` +
        `<div class="quick-picks" role="group" aria-label="Quick picks">${W.quickPicks.map((n) => `<button class="quick-pick" type="button" data-count-set="${n}">${n}</button>`).join('')}</div>` +
        `<p class="est-hint">A best guess is fine.</p>` +
        `</div>`,

      'w-photos': () =>
        head('w-photos') +
        `<div class="est-step__body">` +
        `<p class="est-tip">${icon('camera')}<span>${esc(W.photoTip)}</span></p>` +
        `<input class="visually-hidden" id="slot-file" type="file" accept="image/*,.heic,.heif" multiple data-slot-file tabindex="-1">` +
        `<div data-slots></div>` +
        `<p class="visually-hidden" aria-live="polite" data-slot-live></p>` +
        `<p class="uploader__error" data-slot-error role="alert" hidden></p>` +
        `</div>`,

      'w-style': () =>
        head('w-style') +
        `<fieldset class="est-step__body"><legend class="visually-hidden">Window style</legend><div class="choice-grid choice-grid--2">` +
        W.styles
          .map((s) => {
            const art =
              s.id === 'same'
                ? `<span class="art-pair">${windowSVG({ grid: 'colonial' })}<span class="art-pair__eq">=</span>${windowSVG({ grid: 'colonial' })}</span>`
                : `<span class="art-single">${windowSVG({ grid: 'none' })}<span class="art-single__badge">${icon('sparkle')}</span></span>`;
            return (
              `<label class="choice choice--art"><input class="choice__input" type="radio" name="windowStyle" value="${s.id}" data-bind="windows.style">` +
              `<span class="choice__art">${art}</span>` +
              `<span class="choice__body"><span class="choice__title choice__title--display">${esc(s.label)}</span><span class="choice__text">${esc(s.text)}</span></span>${check}</label>`
            );
          })
          .join('') +
        `</div></fieldset>${stepError}`,

      'w-color': () =>
        head('w-color') +
        `<div class="elev-pair" data-inline-elev aria-hidden="true">` +
        `<figure><div data-elev="interior">${windowSVG()}</div><figcaption class="label">Interior</figcaption></figure>` +
        `<figure><div data-elev="exterior">${windowSVG()}</div><figcaption class="label">Exterior</figcaption></figure>` +
        `</div>` +
        `<fieldset class="est-step__body"><legend class="visually-hidden">Window color, interior / exterior</legend><div class="choice-grid choice-grid--colors">` +
        W.colors
          .map(
            (c) =>
              `<label class="choice choice--swatch"><input class="choice__input" type="radio" name="windowColor" value="${c.id}" data-bind="windows.color">` +
              `<span class="choice__swatch" style="--int:${c.interior.hex};--ext:${c.exterior.hex}">` +
              `<span class="choice__side${isDark(c.interior.hex) ? ' is-dark' : ''}">Int.</span><span class="choice__side${isDark(c.exterior.hex) ? ' is-dark' : ''}">Ext.</span></span>` +
              `<span class="choice__body"><span class="choice__title">${esc(c.label)}</span><span class="choice__text">${esc(c.interior.name)} inside · ${esc(c.exterior.name)} outside</span></span>${check}</label>`
          )
          .join('') +
        `</div></fieldset>${stepError}`,

      'w-grid': () =>
        head('w-grid') +
        `<fieldset class="est-step__body"><legend class="visually-hidden">Window grids</legend><div class="choice-grid choice-grid--grids">` +
        W.grids
          .map(
            (g) =>
              `<label class="choice choice--grid"><input class="choice__input" type="radio" name="windowGrid" value="${g.id}" data-bind="windows.grid">` +
              `<span class="choice__art" data-grid-art>${windowSVG({ grid: g.id })}</span>` +
              `<span class="choice__body"><span class="choice__title">${esc(g.label)}</span><span class="choice__text">${esc(g.text)}</span></span>${check}</label>`
          )
          .join('') +
        `</div></fieldset>${stepError}`,

      'w-note': () =>
        head('w-note') +
        `<div class="est-step__body">` +
        `<blockquote class="est-note"><p>${esc(W.note)}</p></blockquote>` +
        `<ul class="note-facts" role="list">${W.noteFacts.map((f) => `<li>${icon(f.icon)}<span><strong>${esc(f.title)}</strong>${esc(f.text)}</span></li>`).join('')}</ul>` +
        `</div>`,

      'b-areas': () =>
        head('b-areas') +
        `<fieldset class="est-step__body"><legend class="visually-hidden">Bathroom areas to update</legend>` +
        (B.provisional ? `<p class="dev-note">${icon('info')}<span><strong>Provisional bath flow.</strong> Replace with the client’s steps and item photos from her video (CLAUDE.md §5).</span></p>` : '') +
        `<div class="choice-grid choice-grid--rows">` +
        B.areas
          .map(
            (a) =>
              `<label class="choice choice--row"><input class="choice__input" type="checkbox" name="bathAreas" value="${a.id}" data-bind-multi="bath.areas">` +
              `<span class="choice__icon">${icon(a.icon)}</span><span class="choice__title">${esc(a.label)}</span>${check}</label>`
          )
          .join('') +
        `</div></fieldset>${stepError}`,

      'b-photos': () =>
        head('b-photos') +
        `<div class="est-step__body">` +
        `<ul class="photo-tips" role="list">${B.photoTips.map((t) => `<li>${icon('check')}<span>${esc(t)}</span></li>`).join('')}</ul>` +
        `<div class="uploader">` +
        `<input class="visually-hidden" id="bath-file" type="file" accept="image/*,.heic,.heif" multiple tabindex="-1" data-bath-file>` +
        `<button class="uploader__zone" type="button" data-bath-drop><span class="slot__icon">${icon('camera')}</span>` +
        `<span class="slot__title">Add bathroom photos</span><span class="slot__meta"><span class="only-coarse">Tap to take photos or choose from your library</span><span class="only-fine">Click to choose, or drag photos here</span> · up to ${B.maxPhotos}</span></button>` +
        `<p class="uploader__error" data-bath-error role="alert" hidden></p>` +
        `<ul class="upload-grid" role="list" data-bath-list></ul>` +
        `<p class="visually-hidden" aria-live="polite" data-bath-live></p>` +
        `</div>` +
        `<p class="est-hint" data-bath-skip>No photos handy? You can continue and send them later.</p>` +
        `</div>`,

      'b-looks': () =>
        head('b-looks') +
        `<fieldset class="est-step__body"><legend class="visually-hidden">Bathroom styles you like</legend>` +
        (B.provisional ? `<p class="dev-note">${icon('info')}<span>Representative inspiration photos. Swap for the client’s bath item photos when they arrive.</span></p>` : '') +
        `<div class="choice-grid choice-grid--looks">` +
        B.looks
          .map(
            (l) =>
              `<label class="choice choice--media choice--look"><input class="choice__input" type="checkbox" name="bathLooks" value="${l.id}" data-bind-multi="bath.looks">` +
              `<span class="choice__media">${imgTag(l.image, { size: l.size, sizes: '(min-width: 768px) 240px, 50vw' })}</span>` +
              `<span class="choice__body"><span class="choice__title">${esc(l.label)}</span></span>${check}</label>`
          )
          .join('') +
        `</div></fieldset>`,

      finish: () =>
        head('finish') +
        `<div class="est-step__body">` +
        `<div class="field"><label class="field__label" for="e-notes">Additional information <span class="field__optional">Optional</span></label>` +
        `<textarea class="field__input field__textarea" id="e-notes" rows="5" maxlength="2000" data-bind="notes" aria-describedby="e-notes-count" placeholder="Timing, access, anything our team should know…"></textarea>` +
        `<p class="field__hint" id="e-notes-count" data-notes-count>0 / 2000</p></div>` +
        `<div class="review" data-review></div>` +
        `<p class="fine-print">${icon('lock')}<span>By hitting complete, you agree that we may contact you about this project using the details above. See our <a href="privacy.html">Privacy Policy</a>.</span></p>` +
        `<div class="submit-error" data-submit-error role="alert" hidden></div>` +
        `</div>`,
    };

    stepsHost.innerHTML = FLOW.map(
      (s) => `<section class="est-step" data-step="${s.id}" aria-labelledby="st-${s.id}" hidden>${TEMPLATES[s.id]()}</section>`
    ).join('');

    const stepEls = $$('.est-step', stepsHost);
    const stepEl = (id) => stepEls.find((el) => el.dataset.step === id);

    /* ---------- Binding ---------- */

    function syncInputs() {
      $$('[data-bind]', form).forEach((input) => {
        const value = getPath(state, input.dataset.bind);
        if (input.type === 'radio') input.checked = input.value === value;
        else input.value = value ?? '';
      });
      $$('[data-bind-multi]', form).forEach((input) => {
        const list = getPath(state, input.dataset.bindMulti) || [];
        input.checked = list.includes(input.value);
      });
    }

    function onBindChange(event) {
      const input = event.target;
      if (input.matches('[data-bind]')) {
        if (input.type === 'radio' && !input.checked) return;
        setPath(state, input.dataset.bind, input.value);
      } else if (input.matches('[data-bind-multi]')) {
        const path = input.dataset.bindMulti;
        const list = new Set(getPath(state, path) || []);
        if (input.checked) list.add(input.value);
        else list.delete(input.value);
        setPath(state, path, Array.from(list));
      } else {
        return;
      }
      touched = true;
      clearStepError(input.closest('.est-step'));
      afterChange(input);
    }

    on(form, 'input', (event) => {
      if (event.target.type !== 'radio' && event.target.type !== 'checkbox') onBindChange(event);
    });
    on(form, 'change', (event) => {
      if (event.target.type === 'radio' || event.target.type === 'checkbox') onBindChange(event);
    });

    function afterChange(input) {
      const bind = input.dataset.bind || input.dataset.bindMulti;
      if (bind === 'projectType') renderPhases();
      if (bind === 'windows.count') renderCountUnit();
      if (bind === 'windows.color' || bind === 'windows.grid') renderPreviews();
      if (bind === 'notes') renderNotesCount();
      renderSheet();
      updateChrome();
      saveDraftSoon();
    }

    wireLiveValidation(form);

    /* ---------- Validation ---------- */

    function showStepError(id, message) {
      const el = $('[data-step-error]', stepEl(id));
      if (el) el.textContent = message;
    }

    function clearStepError(section) {
      const el = section && $('[data-step-error]', section);
      if (el) el.textContent = '';
    }

    function isStepComplete(id) {
      const def = stepDef(id);
      if (id === 'contact') {
        return $$('[data-validate]', stepEl('contact')).every((f) => {
          const rules = f.dataset.validate.split(/\s+/);
          return rules.every((r) => !VALIDATORS[r] || !VALIDATORS[r](getPath(state, f.dataset.bind) ?? ''));
        });
      }
      if (id === 'w-count') return count() > 0;
      if (def && def.choice) {
        const value = getPath(state, def.choice.path);
        return Array.isArray(value) ? value.length > 0 : Boolean(value);
      }
      return true;
    }

    function validateStep(id) {
      const section = stepEl(id);
      const fields = $$('[data-validate]', section);
      const invalid = fields.filter((f) => !validateField(f));
      if (invalid.length) {
        invalid[0].focus();
        return false;
      }
      const def = stepDef(id);
      if (def && def.choice && !isStepComplete(id)) {
        showStepError(id, def.choice.message);
        const first = $('.choice__input', section);
        if (first) first.focus();
        return false;
      }
      return true;
    }

    function firstIncompleteStep() {
      const steps = activeSteps();
      const bad = steps.find((s) => s.id !== 'finish' && !isStepComplete(s.id));
      return bad ? bad.id : null;
    }

    /* ---------- Chrome: phases, header label, progress, buttons ---------- */

    function renderPhases() {
      const steps = activeSteps();
      const phases = [];
      steps.forEach((s) => {
        if (!phases.includes(s.phase)) phases.push(s.phase);
      });
      const current = stepDef(state.step).phase;
      const currentIndex = phases.indexOf(current);
      phasesEl.innerHTML = phases
        .map((p, i) => {
          const status = i < currentIndex ? 'is-done' : i === currentIndex ? 'is-current' : '';
          return `<li class="est-phase ${status}"${i === currentIndex ? ' aria-current="step"' : ''}><span class="est-phase__dot">${i < currentIndex ? icon('check') : ''}</span><span>${PHASE_LABELS[p]}</span></li>`;
        })
        .join('');
    }

    function updateChrome() {
      const steps = activeSteps();
      const index = steps.findIndex((s) => s.id === state.step);
      const total = steps.length;
      const known = Boolean(state.projectType);
      const n = count();

      // Progress — typical flow length is used until the project is chosen
      const denominator = known ? total - 1 : 8;
      let fraction = index / Math.max(denominator, 1);
      if (state.step === 'w-photos' && n) fraction += state.slot / n / denominator;
      if (progressBar) progressBar.style.transform = `scaleX(${clamp(Math.max(fraction, 0.035), 0, 1)})`;

      const kicker = (C.copy.steps[state.step] || {}).kicker || '';
      const stepNum = `${pad2(index + 1)}${known ? ` / ${pad2(total)}` : ''}`;
      if (stepLabel) stepLabel.innerHTML = `<span class="label__num">Step ${stepNum}</span><span>${esc(kicker)}</span>`;
      const num = $('[data-step-num]', stepEl(state.step));
      if (num) num.textContent = pad2(index + 1);
      if (sheetNo) sheetNo.textContent = `Sheet ${stepNum}`;

      backBtn.hidden = index === 0;

      let label = 'Next';
      let iconName = 'arrow';
      if (state.step === 'contact' || state.step === 'project') label = 'Continue';
      if (state.step === 'w-photos') label = state.slot < n - 1 ? 'Next window' : 'Next';
      if (state.step === 'finish') {
        label = C.copy.completeLabel;
        iconName = 'check';
      } else if (state.returnTo) {
        label = 'Save & return to summary';
      }
      nextLabel.textContent = label;
      if (nextIcon) nextIcon.innerHTML = `<use href="#i-${iconName}"/>`;
      nextBtn.classList.toggle('est-actions__next--complete', state.step === 'finish');
      if (hint) hint.hidden = state.step === 'finish';
    }

    /* ---------- Live spec sheet ---------- */

    function sheetRows() {
      const rows = [];
      const name = [state.contact.firstName, state.contact.lastName].filter(Boolean).join(' ');
      const site = [state.address.street, state.address.city, state.address.region].filter(Boolean).join(', ');
      rows.push(['Client', name]);
      rows.push(['Site', site]);
      rows.push(['Scope', state.projectType ? C.products[state.projectType].short : '']);
      if (hasWindows()) {
        const n = count();
        const color = colorById(state.windows.color);
        const grid = gridById(state.windows.grid);
        const style = styleById(state.windows.style);
        rows.push(['Windows', n ? `${n} to replace` : '']);
        rows.push(['Photos', n ? `${windowPhotoCount()} of ${n}` : '']);
        rows.push(['Style', style ? style.label : '']);
        rows.push(['Frame', color ? `${color.interior.name} int. / ${color.exterior.name} ext.` : '']);
        rows.push(['Grids', grid ? grid.short : '']);
      }
      if (hasBath()) {
        const areas = state.bath.areas.map((id) => (B.areas.find((a) => a.id === id) || {}).label).filter(Boolean);
        rows.push(['Bath', areas.join(', ')]);
        rows.push(['Bath photos', photos.bath.length ? String(photos.bath.length) : '']);
        const looks = state.bath.looks.map((id) => (B.looks.find((l) => l.id === id) || {}).label).filter(Boolean);
        rows.push(['Looks', looks.join(', ')]);
      }
      return rows;
    }

    function renderSheet() {
      const rows = sheetRows();
      const html = rows
        .map(([k, v]) => {
          const changed = v && lastSheet[k] !== undefined && lastSheet[k] !== v;
          return `<div class="title-block__row${v ? '' : ' is-empty'}${changed ? ' is-new' : ''}"><dt>${esc(k)}</dt><dd>${v ? esc(v) : '—'}</dd></div>`;
        })
        .join('');
      sheetRowsEls.forEach((el) => {
        el.innerHTML = html;
      });
      lastSheet = Object.fromEntries(rows);
      if (miniCount) {
        const filled = rows.filter(([, v]) => v).length;
        miniCount.textContent = `${filled} of ${rows.length}`;
      }
      renderSheetDrawing();
    }

    function renderSheetDrawing() {
      if (!sheetDrawing) return;
      const mode = state.projectType === 'bath' ? 'bath' : 'windows';
      if (sheetDrawing.dataset.mode !== mode) {
        sheetDrawing.dataset.mode = mode;
        sheetDrawing.innerHTML =
          mode === 'windows'
            ? `<figure class="sheet__elev"><div data-elev="interior">${windowSVG({ cls: 'win--on-ink' })}</div><figcaption class="label label--on-ink">Int. elevation</figcaption></figure>` +
              `<figure class="sheet__elev"><div data-elev="exterior">${windowSVG({ cls: 'win--on-ink' })}</div><figcaption class="label label--on-ink">Ext. elevation</figcaption></figure>`
            : `<figure class="sheet__photo">${imgTag('assets/images/bath/bath-stone-tub', { sizes: '30vw' })}<figcaption class="label label--on-ink">Fig. — Bath remodel</figcaption></figure>`;
      }
      if (mode === 'windows') paintElevations(sheetDrawing);
    }

    function paintElevations(host) {
      const color = colorById(state.windows.color) || W.colors[0];
      const grid = state.windows.grid || 'none';
      updateWindowSVG($('[data-elev="interior"] svg', host), { frame: color.interior.hex, grid });
      updateWindowSVG($('[data-elev="exterior"] svg', host), { frame: color.exterior.hex, grid });
    }

    function renderPreviews() {
      const inline = $('[data-inline-elev]', form);
      if (inline) paintElevations(inline);
      const color = colorById(state.windows.color) || W.colors[0];
      $$('[data-grid-art] svg', form).forEach((svg) => updateWindowSVG(svg, { frame: color.interior.hex }));
    }

    function renderCountUnit() {
      const unit = $('[data-count-unit]', form);
      if (unit) unit.textContent = count() === 1 ? 'window' : 'windows';
    }

    function renderNotesCount() {
      const out = $('[data-notes-count]', form);
      if (out) out.textContent = `${state.notes.length} / 2000`;
    }

    /* ---------- Window count stepper ---------- */

    function setCount(n) {
      const input = $('#e-count', form);
      const value = clamp(n, 1, W.maxCount);
      input.value = String(value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      clearFieldError(input);
    }

    on(stepEl('w-count'), 'click', (event) => {
      const stepBtn = event.target.closest('[data-count-step]');
      const setBtn = event.target.closest('[data-count-set]');
      if (stepBtn) setCount((count() || 0) + Number(stepBtn.dataset.countStep));
      if (setBtn) setCount(Number(setBtn.dataset.countSet));
    });

    /* ---------- Per-window photo slots ("Window 3 of 8" → NEXT) ---------- */

    const slotHost = $('[data-slots]', form);
    const slotFile = $('[data-slot-file]', form);
    const slotLive = $('[data-slot-live]', form);
    const slotError = $('[data-slot-error]', form);
    let replacing = false;

    function slotMeta(i) {
      if (!state.slots[i]) state.slots[i] = { side: '', room: '' };
      return state.slots[i];
    }

    function renderSlots() {
      const n = count();
      if (!n) {
        slotHost.innerHTML = '';
        return;
      }
      state.slot = clamp(state.slot, 0, n - 1);
      const i = state.slot;
      const photo = photos.windows[i];
      const meta = slotMeta(i);
      const drop = photo
        ? `<figure class="slot__photo"><img src="${photo.url}" alt="Your photo of window ${i + 1}">` +
          `<figcaption class="slot__tools"><button class="btn btn--light btn--sm" type="button" data-slot-replace><span>${icon('refresh')}Replace</span></button>` +
          `<button class="btn btn--light btn--sm" type="button" data-slot-remove><span>${icon('trash')}Remove</span></button></figcaption></figure>`
        : `<button class="slot__drop" type="button" data-slot-drop><span class="slot__icon">${icon('camera')}</span>` +
          `<span class="slot__title">Add a photo of window ${i + 1}</span>` +
          `<span class="slot__meta"><span class="only-coarse">Tap to take a photo or choose one</span><span class="only-fine">Click to choose, or drag a photo here</span> · you can select several at once</span></button>`;

      slotHost.innerHTML =
        `<div class="slot" data-slot="${i}">` +
        `<div class="slot__bar"><p class="slot__count"><span class="label">Window</span><span class="slot__num">${pad2(i + 1)}</span><span class="slot__of">/ ${pad2(n)}</span></p>` +
        `<p class="slot__state${photo ? ' is-done' : ''}">${photo ? `${icon('check')}Photo added` : 'No photo yet'}</p></div>` +
        drop +
        `<fieldset class="slot__where"><legend class="field__label">Where is this window? <span class="field__optional">Optional</span></legend>` +
        `<div class="chips">${W.locations.map((loc) => `<label class="chip"><input type="radio" name="slot-side" value="${esc(loc)}"${meta.side === loc ? ' checked' : ''} data-slot-side><span>${esc(loc)}</span></label>`).join('')}</div>` +
        `<label class="visually-hidden" for="slot-room">Room (optional)</label>` +
        `<input class="field__input field__input--sm" id="slot-room" type="text" maxlength="60" placeholder="Room, e.g. kitchen" value="${esc(meta.room)}" data-slot-room></fieldset>` +
        `</div>` +
        `<div class="slot-strip" role="group" aria-label="Jump to a window">` +
        Array.from({ length: n }, (_, k) => {
          const p = photos.windows[k];
          return `<button class="slot-strip__item${k === i ? ' is-current' : ''}${p ? ' has-photo' : ''}" type="button" data-slot-go="${k}" aria-label="Window ${k + 1}${p ? ', photo added' : ''}"${k === i ? ' aria-current="step"' : ''}>${p ? `<img src="${p.url}" alt="">` : `<span>${k + 1}</span>`}</button>`;
        }).join('') +
        `</div>` +
        `<div class="slot-foot"><p><strong>${windowPhotoCount()}</strong> of ${n} photos added</p><button class="text-btn" type="button" data-slot-skip>Skip photos for now ${icon('arrow')}</button></div>`;
    }

    function goSlot(i, dir = 1) {
      state.slot = clamp(i, 0, count() - 1);
      renderSlots();
      animateIn($('.slot', slotHost), dir, true);
      updateChrome();
      saveDraftSoon();
    }

    function addWindowPhotos(fileList) {
      const files = Array.from(fileList || []);
      if (!files.length) return;
      const errors = [];
      const valid = files.filter((f) => {
        const e = checkPhoto(f);
        if (e) errors.push(e);
        return !e;
      });
      const n = count();
      let placed = 0;
      let firstSlot = state.slot;
      if (valid.length) {
        // First photo goes to the current window; the rest fill the next empty windows.
        const targets = [state.slot];
        if (!replacing) {
          for (let k = state.slot + 1; k < n && targets.length < valid.length; k += 1) {
            if (!photos.windows[k]) targets.push(k);
          }
        }
        valid.slice(0, targets.length).forEach((file, idx) => {
          const k = targets[idx];
          dropPhoto(photos.windows[k]);
          photos.windows[k] = makePhoto(file);
          placed += 1;
        });
        if (valid.length > targets.length) errors.push(`${valid.length - targets.length} extra photo${valid.length - targets.length === 1 ? '' : 's'} weren’t added — increase the number of windows to add more.`);
      }
      replacing = false;
      slotError.hidden = !errors.length;
      slotError.textContent = errors.join(' ');
      if (placed) {
        touched = true;
        slotLive.textContent = placed === 1 ? `Photo added to window ${firstSlot + 1}.` : `${placed} photos added, starting at window ${firstSlot + 1}.`;
      }
      renderSlots();
      renderSheet();
      saveDraftSoon();
    }

    on(slotFile, 'change', () => {
      addWindowPhotos(slotFile.files);
      slotFile.value = '';
    });

    on(slotHost, 'click', (event) => {
      const go = event.target.closest('[data-slot-go]');
      if (go) {
        const k = Number(go.dataset.slotGo);
        goSlot(k, k >= state.slot ? 1 : -1);
        return;
      }
      if (event.target.closest('[data-slot-drop]')) {
        replacing = false;
        slotFile.click();
        return;
      }
      if (event.target.closest('[data-slot-replace]')) {
        replacing = true;
        slotFile.click();
        return;
      }
      if (event.target.closest('[data-slot-remove]')) {
        dropPhoto(photos.windows[state.slot]);
        photos.windows[state.slot] = undefined;
        slotLive.textContent = `Photo removed from window ${state.slot + 1}.`;
        renderSlots();
        renderSheet();
        $('[data-slot-drop]', slotHost)?.focus();
        return;
      }
      if (event.target.closest('[data-slot-skip]')) {
        goTo(nextStepId('w-photos'));
      }
    });

    on(slotHost, 'change', (event) => {
      if (event.target.matches('[data-slot-side]')) {
        slotMeta(state.slot).side = event.target.value;
        touched = true;
        saveDraftSoon();
      }
    });

    on(slotHost, 'input', (event) => {
      if (event.target.matches('[data-slot-room]')) {
        slotMeta(state.slot).room = event.target.value;
        touched = true;
        saveDraftSoon();
      }
    });

    wireDropZone(slotHost, '[data-slot-drop]', (files) => addWindowPhotos(files));

    function wireDropZone(host, selector, onFiles) {
      let depth = 0;
      on(host, 'dragenter', (event) => {
        const zone = event.target.closest(selector);
        if (!zone || !hasFiles(event)) return;
        event.preventDefault();
        depth += 1;
        zone.classList.add('is-over');
      });
      on(host, 'dragover', (event) => {
        if (event.target.closest(selector) && hasFiles(event)) event.preventDefault();
      });
      on(host, 'dragleave', (event) => {
        const zone = event.target.closest(selector);
        if (!zone) return;
        depth = Math.max(0, depth - 1);
        if (!depth) zone.classList.remove('is-over');
      });
      on(host, 'drop', (event) => {
        const zone = event.target.closest(selector);
        if (!zone) return;
        event.preventDefault();
        depth = 0;
        zone.classList.remove('is-over');
        onFiles(event.dataTransfer.files);
      });
    }

    function hasFiles(event) {
      return Array.from(event.dataTransfer?.types || []).includes('Files');
    }

    /* ---------- Bath photos ---------- */

    const bathFile = $('[data-bath-file]', form);
    const bathList = $('[data-bath-list]', form);
    const bathError = $('[data-bath-error]', form);
    const bathLive = $('[data-bath-live]', form);

    function renderBathPhotos() {
      bathList.innerHTML = photos.bath
        .map(
          (p, i) =>
            `<li class="upload-tile"><img src="${p.url}" alt="Bathroom photo ${i + 1}">` +
            `<button class="upload-tile__remove" type="button" data-bath-remove="${p.id}" aria-label="Remove bathroom photo ${i + 1}">${icon('close')}</button></li>`
        )
        .join('');
      $('[data-bath-skip]', form).hidden = photos.bath.length > 0;
    }

    function addBathPhotos(fileList) {
      const files = Array.from(fileList || []);
      const errors = [];
      let added = 0;
      files.forEach((file) => {
        const e = checkPhoto(file);
        if (e) {
          errors.push(e);
          return;
        }
        if (photos.bath.length >= B.maxPhotos) return;
        if (photos.bath.some((p) => p.name === file.name && p.file.size === file.size)) return;
        photos.bath.push(makePhoto(file));
        added += 1;
      });
      if (files.length - errors.length > added && photos.bath.length >= B.maxPhotos) errors.push(`You can add up to ${B.maxPhotos} photos.`);
      bathError.hidden = !errors.length;
      bathError.textContent = errors.join(' ');
      if (added) {
        touched = true;
        bathLive.textContent = `${added} photo${added === 1 ? '' : 's'} added.`;
      }
      renderBathPhotos();
      renderSheet();
    }

    on(bathFile, 'change', () => {
      addBathPhotos(bathFile.files);
      bathFile.value = '';
    });
    on($('[data-bath-drop]', form), 'click', () => bathFile.click());
    on(bathList, 'click', (event) => {
      const btn = event.target.closest('[data-bath-remove]');
      if (!btn) return;
      const idx = photos.bath.findIndex((p) => p.id === btn.dataset.bathRemove);
      if (idx > -1) {
        dropPhoto(photos.bath[idx]);
        photos.bath.splice(idx, 1);
        bathLive.textContent = 'Photo removed.';
        renderBathPhotos();
        renderSheet();
      }
    });
    wireDropZone(stepEl('b-photos'), '[data-bath-drop]', (files) => addBathPhotos(files));

    /* ---------- Review (finish step) ---------- */

    function renderReview() {
      const host = $('[data-review]', form);
      const groups = [];
      const name = [state.contact.firstName, state.contact.lastName].filter(Boolean).join(' ');
      const addr = [state.address.street, state.address.line2, state.address.city, [state.address.region, state.address.postalCode].filter(Boolean).join(' ')]
        .filter(Boolean)
        .join(', ');
      groups.push({ title: 'You', rows: [['Name', name, 'contact'], ['Phone', state.contact.phone, 'contact'], ['Email', state.contact.email, 'contact'], ['Address', addr, 'contact']] });
      groups.push({ title: 'Project', rows: [['Project', state.projectType ? C.products[state.projectType].label : '', 'project']] });
      if (hasWindows()) {
        const n = count();
        const color = colorById(state.windows.color);
        groups.push({
          title: 'Windows',
          rows: [
            ['How many', n ? String(n) : '', 'w-count'],
            ['Photos', n ? `${windowPhotoCount()} of ${n}` : '', 'w-photos'],
            ['Style', (styleById(state.windows.style) || {}).label, 'w-style'],
            ['Color', color ? `${color.label} — ${color.interior.name} inside, ${color.exterior.name} outside` : '', 'w-color'],
            ['Grids', (gridById(state.windows.grid) || {}).label, 'w-grid'],
          ],
          thumbs: photos.windows.slice(0, n).filter(Boolean),
        });
      }
      if (hasBath()) {
        groups.push({
          title: 'Bath',
          rows: [
            ['Update', state.bath.areas.map((id) => (B.areas.find((a) => a.id === id) || {}).label).join(', '), 'b-areas'],
            ['Photos', String(photos.bath.length), 'b-photos'],
            ['Style', state.bath.looks.map((id) => (B.looks.find((l) => l.id === id) || {}).label).join(', ') || 'None chosen', 'b-looks'],
          ],
          thumbs: photos.bath,
        });
      }
      host.innerHTML =
        `<p class="label review__label"><span class="label__num">Summary</span> Check your details</p>` +
        groups
          .map(
            (g, gi) =>
              `<section class="review__group"><h3 class="review__title"><span class="review__num">${pad2(gi + 1)}</span>${esc(g.title)}</h3>` +
              `<dl class="review__rows">${g.rows
                .map(
                  ([k, v, edit]) =>
                    `<div class="review__row"><dt>${esc(k)}</dt><dd>${v ? esc(v) : '<span class="review__missing">Not added</span>'}</dd>` +
                    `<button class="text-btn review__edit" type="button" data-edit="${edit}" aria-label="Change ${esc(k.toLowerCase())}">Change</button></div>`
                )
                .join('')}</dl>` +
              (g.thumbs && g.thumbs.length ? `<ul class="review__thumbs" role="list">${g.thumbs.map((p) => `<li><img src="${p.url}" alt=""></li>`).join('')}</ul>` : '') +
              `</section>`
          )
          .join('');
    }

    on(form, 'click', (event) => {
      const edit = event.target.closest('[data-edit]');
      if (!edit) return;
      state.returnTo = 'finish';
      goTo(edit.dataset.edit, { dir: -1 });
    });

    /* ---------- Navigation ---------- */

    function nextStepId(id) {
      const steps = activeSteps();
      const i = steps.findIndex((s) => s.id === id);
      return steps[Math.min(i + 1, steps.length - 1)].id;
    }

    function prevStepId(id) {
      const steps = activeSteps();
      const i = steps.findIndex((s) => s.id === id);
      return i > 0 ? steps[i - 1].id : null;
    }

    function animateIn(el, dir = 1, subtle = false) {
      if (!el || prefersReducedMotion()) return;
      el.classList.remove('is-entering');
      el.style.setProperty('--dir', String(dir));
      void el.offsetWidth;
      el.classList.add(subtle ? 'is-entering-subtle' : 'is-entering');
      window.setTimeout(() => el.classList.remove('is-entering', 'is-entering-subtle'), 320);
    }

    function goTo(id, { dir = 1, push = true, focus = true } = {}) {
      const steps = activeSteps();
      if (!steps.some((s) => s.id === id)) id = steps[0].id;
      const from = state.step;
      state.step = id;
      if (id === 'w-photos' && from !== 'w-photos') state.slot = dir < 0 && !state.returnTo ? Math.max(0, count() - 1) : 0;
      render({ dir, focus });
      if (push) history.pushState({ est: id }, '');
    }

    function render({ dir = 1, focus = false } = {}) {
      const id = state.step;
      stepEls.forEach((el) => {
        const show = el.dataset.step === id;
        if (show && el.hidden) {
          el.hidden = false;
          animateIn(el, dir);
        } else if (!show) {
          el.hidden = true;
        }
      });
      if (id === 'w-photos') renderSlots();
      if (id === 'w-color' || id === 'w-grid') renderPreviews();
      if (id === 'b-photos') renderBathPhotos();
      if (id === 'finish') {
        renderReview();
        renderNotesCount();
      }
      renderPhases();
      updateChrome();
      renderSheet();
      if (focus) {
        const title = $(`#st-${id}`, form);
        if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: 'auto' });
        if (title) title.focus({ preventScroll: true });
      }
      saveDraftSoon();
    }

    on(form, 'submit', async (event) => {
      event.preventDefault();
      if (busy) return;
      const id = state.step;
      if (!validateStep(id)) return;
      if (id === 'w-photos' && state.slot < count() - 1 && !state.returnTo) {
        goSlot(state.slot + 1, 1);
        return;
      }
      if (id === 'finish') {
        await submit();
        return;
      }
      if (state.returnTo) {
        const missing = firstIncompleteStep();
        if (!missing) {
          state.returnTo = null;
          goTo('finish');
          return;
        }
        goTo(missing);
        return;
      }
      goTo(nextStepId(id));
    });

    on(backBtn, 'click', () => {
      if (state.step === 'w-photos' && state.slot > 0) {
        goSlot(state.slot - 1, -1);
        return;
      }
      const prev = prevStepId(state.step);
      if (prev) goTo(prev, { dir: -1 });
    });

    on(window, 'popstate', (event) => {
      const id = event.state && event.state.est;
      if (!id) return;
      const steps = activeSteps();
      const dir = steps.findIndex((s) => s.id === id) < steps.findIndex((s) => s.id === state.step) ? -1 : 1;
      goTo(id, { dir, push: false });
    });

    /* ---------- Submission ---------- */

    function buildPayload() {
      const n = count();
      const color = colorById(state.windows.color);
      const grid = gridById(state.windows.grid);
      const style = styleById(state.windows.style);
      return {
        contact: { ...state.contact },
        address: { ...state.address },
        projectType: state.projectType,
        project: state.projectType ? C.products[state.projectType].label : '',
        windows: hasWindows()
          ? {
              count: n,
              style: style ? { id: style.id, label: style.label } : null,
              color: color ? { id: color.id, label: color.label, interior: color.interior.name, exterior: color.exterior.name } : null,
              grids: grid ? { id: grid.id, label: grid.label } : null,
              photosAdded: windowPhotoCount(),
              windows: Array.from({ length: n }, (_, i) => ({
                window: i + 1,
                location: (state.slots[i] || {}).side || '',
                room: (state.slots[i] || {}).room || '',
                photo: photos.windows[i] ? windowFileName(i) : null,
              })),
            }
          : null,
        bath: hasBath()
          ? {
              areas: state.bath.areas.map((id) => ({ id, label: (B.areas.find((a) => a.id === id) || {}).label })),
              looks: state.bath.looks.map((id) => ({ id, label: (B.looks.find((l) => l.id === id) || {}).label })),
              photosAdded: photos.bath.length,
              provisionalFlow: Boolean(B.provisional),
            }
          : null,
        additionalInformation: state.notes.trim(),
        meta: { form: 'online-estimate', version: 2, startedAt: state.startedAt, submittedAt: new Date().toISOString(), page: window.location.pathname },
      };
    }

    function windowFileName(i) {
      const side = slug((state.slots[i] || {}).side);
      return `window-${pad2(i + 1)}${side ? `-${side}` : ''}.jpg`;
    }

    async function collectFiles() {
      const n = count();
      const out = [];
      if (hasWindows()) {
        for (let i = 0; i < n; i += 1) {
          const p = photos.windows[i];
          if (!p) continue;
          const file = await p.ready;
          out.push({ field: 'window_photos[]', name: windowFileName(i), file });
        }
      }
      if (hasBath()) {
        for (let i = 0; i < photos.bath.length; i += 1) {
          const file = await photos.bath[i].ready;
          out.push({ field: 'bath_photos[]', name: `bath-${pad2(i + 1)}.jpg`, file });
        }
      }
      return out;
    }

    function setBusy(value) {
      busy = value;
      nextBtn.classList.toggle('is-loading', value);
      nextBtn.disabled = value;
      nextLabel.textContent = value ? 'Sending…' : C.copy.completeLabel;
    }

    async function submit() {
      const missing = firstIncompleteStep();
      if (missing) {
        state.returnTo = 'finish';
        goTo(missing);
        const def = stepDef(missing);
        if (def && def.choice) showStepError(missing, def.choice.message);
        else validateStep(missing);
        return;
      }
      const errorBox = $('[data-submit-error]', form);
      errorBox.hidden = true;

      if (hp && hp.value) {
        showCongrats({ dev: false }); // bot — never sent
        return;
      }

      const payload = buildPayload();
      setBusy(true);
      try {
        const files = await collectFiles();
        if (!SUBMISSION_ENDPOINT) {
          console.info('[Clearwell estimate] Development mode — nothing was sent.', payload, files);
          showCongrats({ dev: true, payload, files });
          return;
        }
        const body = new FormData();
        body.append('payload', JSON.stringify(payload));
        files.forEach((f) => body.append(f.field, f.file, f.name));
        const res = await fetch(SUBMISSION_ENDPOINT, { method: 'POST', body, headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        submitted = true;
        clearDraft();
        showCongrats({ dev: false });
      } catch (err) {
        errorBox.hidden = false;
        errorBox.innerHTML = `${icon('info')}<p><strong>We couldn’t send your estimate.</strong> Please check your connection and hit complete again — your answers and photos are still here.</p>`;
      } finally {
        setBusy(false);
      }
    }

    /* ---------- CONGRATS pop-up ---------- */

    const congrats = $('[data-congrats]');

    function showCongrats({ dev, payload, files }) {
      if (!congrats || typeof congrats.showModal !== 'function') {
        window.alert(`${C.copy.congrats.title} ${C.copy.congrats.text}`);
        return;
      }
      $('[data-congrats-title]', congrats).textContent = C.copy.congrats.title;
      $('[data-congrats-text]', congrats).textContent = C.copy.congrats.text;
      const devBox = $('[data-congrats-dev]', congrats);
      if (devBox) {
        devBox.hidden = !dev;
        if (dev) {
          const summary = { ...payload, files: (files || []).map((f) => ({ field: f.field, name: f.name, size: f.file.size, type: f.file.type })) };
          $('[data-congrats-payload]', congrats).textContent = JSON.stringify(summary, null, 2);
        }
      }
      congrats.showModal();
      burst($('[data-confetti]', congrats));
    }

    function burst(host) {
      if (!host || prefersReducedMotion() || typeof host.animate !== 'function') return;
      host.innerHTML = '';
      const palette = ['#3874CC', '#5B95E3', '#8CBAF3', '#CADDF8', '#FFFFFF', '#10264A'];
      const pieces = 34;
      for (let k = 0; k < pieces; k += 1) {
        const pane = document.createElement('span');
        const size = 6 + Math.random() * 8;
        pane.className = 'confetti';
        pane.style.width = `${size}px`;
        pane.style.height = `${size * (0.7 + Math.random() * 0.6)}px`;
        pane.style.background = palette[k % palette.length];
        host.appendChild(pane);
        const angle = (Math.PI * 2 * k) / pieces + Math.random() * 0.35;
        const dist = 130 + Math.random() * 170;
        const x = Math.cos(angle) * dist;
        const y = Math.sin(angle) * dist * 0.75 - 30;
        const spin = Math.random() * 540 - 270;
        pane.animate(
          [
            { transform: 'translate(-50%, -50%) scale(0.6) rotate(0deg)', opacity: 1 },
            { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(1) rotate(${spin}deg)`, opacity: 1, offset: 0.65 },
            { transform: `translate(calc(-50% + ${x * 1.08}px), calc(-50% + ${y + 90}px)) scale(0.9) rotate(${spin * 1.6}deg)`, opacity: 0 },
          ],
          { duration: 1400 + Math.random() * 600, delay: 380 + Math.random() * 120, easing: 'cubic-bezier(0.23, 1, 0.32, 1)', fill: 'both' }
        );
      }
    }

    on($('[data-congrats-new]'), 'click', () => {
      congrats.close();
      resetAll();
    });

    /* ---------- Start over / Save & exit ---------- */

    function resetAll() {
      photos.windows.forEach(dropPhoto);
      photos.bath.forEach(dropPhoto);
      photos.windows = [];
      photos.bath = [];
      clearDraft();
      state = createState();
      touched = false;
      submitted = false;
      lastSheet = {};
      if (draftBanner) draftBanner.hidden = true;
      syncInputs();
      $$('[aria-invalid]', form).forEach(clearFieldError);
      $$('[data-step-error]', form).forEach((el) => {
        el.textContent = '';
      });
      goTo('contact', { dir: -1 });
    }

    function confirmDialog(name, onConfirm) {
      const dialog = $(`[data-dialog="${name}"]`);
      if (!dialog || typeof dialog.showModal !== 'function') {
        if (window.confirm(name === 'restart' ? 'Start over? This clears your answers.' : 'Save and exit?')) onConfirm();
        return;
      }
      dialog.returnValue = '';
      dialog.showModal();
      dialog.addEventListener('close', () => {
        if (dialog.returnValue === 'confirm') onConfirm();
      }, { once: true });
    }

    $$('[data-est-restart]').forEach((btn) => on(btn, 'click', () => confirmDialog('restart', resetAll)));
    let leaving = false;
    on($('[data-est-exit]'), 'click', () =>
      confirmDialog('exit', () => {
        saveDraft(true);
        leaving = true;
        window.location.href = 'index.html';
      })
    );

    on(window, 'beforeunload', (event) => {
      const hasPhotos = photos.windows.some(Boolean) || photos.bath.length > 0;
      if (touched && hasPhotos && !submitted && !leaving) {
        saveDraft();
        event.preventDefault();
        event.returnValue = '';
      }
    });

    /* ---------- Boot ---------- */

    const draft = loadDraft();
    if (draft && draft.state) {
      state = deepMerge(createState(), draft.state);
      state.returnTo = null;
      touched = true;
      if (draftBanner) {
        draftBanner.hidden = false;
        const note = $('[data-draft-photos]', draftBanner);
        if (note) note.hidden = !draft.hadPhotos;
      }
    }

    const params = new URLSearchParams(window.location.search);
    const project = params.get('project');
    if (project && C.products[project] && !state.projectType) state.projectType = project;
    if (params.get('color') && colorById(params.get('color'))) state.windows.color = params.get('color');
    if (params.get('grid') && gridById(params.get('grid'))) state.windows.grid = params.get('grid');

    const today = new Date();
    const dateEl = $('[data-sheet-date]');
    if (dateEl) dateEl.textContent = today.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

    syncInputs();
    renderCountUnit();
    history.replaceState({ est: state.step }, '');
    render({ focus: false });

    // Read-only helper for QA in the browser console
    window.ClearwellEstimate = Object.freeze({
      get state() {
        return JSON.parse(JSON.stringify(state));
      },
      payload: () => buildPayload(),
      photos: () => ({ windows: photos.windows.map((p) => (p ? p.name : null)), bath: photos.bath.map((p) => p.name) }),
    });
  }

  /* ===================================================================
     9. INIT
     =================================================================== */

  function init() {
    initPlaceholderSections();
    initDiagrams();

    const header = $('[data-site-header]');
    if (header) initHeader(header);
    initMobileNav();

    $$('[data-story]').forEach(initStory);
    $$('[data-studio]').forEach(initStudio);
    $$('[data-compare]').forEach(initCompare);
    $$('[data-tabs]').forEach(initTabs);
    $$('[data-accordion]').forEach(initAccordion);
    $$('[data-quotes]').forEach(initQuotes);
    $$('[data-gallery]').forEach(initGallery);
    $$('[data-contact-form]').forEach(initContactForm);
    $$('[data-estimator]').forEach(initEstimator);

    initConfigItems();
    initYear();
    initReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
