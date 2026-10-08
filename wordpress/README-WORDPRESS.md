# WordPress build — developer notes

For whoever maintains this build. The owner's guide is `OWNER-HANDOFF.md`.

## What's here

| Path | What it is |
| --- | --- |
| `theme/dh-remodel/` | The design. Page templates are **generated** from the static prototype (project root `*.html`). |
| `plugins/dh-estimate/` | Estimate data + Builder, submissions (Estimates, Messages), contact form endpoint, Settings, page creation. |
| `dist/*.zip` | Installable zips (Plugins → Add New → Upload / Appearance → Themes → Add New → Upload). |
| `tools/build_theme.py` | Regenerates the theme templates and copies assets from the prototype. |
| `tools/blueprint.json` | Local WordPress Playground setup (WP_DEBUG on, theme + plugin active). |
| `CONVERSION-PLAN.md` | Decisions and scope. |

## Install (fresh WordPress)

1. Appearance → Themes → Add New → Upload → `dist/dh-remodel.zip` → **Activate**.
2. Plugins → Add New → Upload → `dist/dh-estimate.zip` → **Activate**. Activation creates the 8 pages (Home, Windows, Bath Remodel, Our Work, About, Contact, Privacy Policy, Free Estimate), sets Home as the front page and switches permalinks to `/%postname%/` if they were plain.
3. Install **Yoast SEO** (free). The theme feeds each page's prototype title and description as Yoast's default; anything typed in the Yoast box wins.
4. Estimate → Settings: business name, short name, logo, phone. Leave "Send new estimates…to" empty on the test site (store-only). At launch: fill it and set up WP Mail SMTP — see `FORMS.md`.

Order matters: the theme first, so the plugin can seed the Privacy Policy page with the design's text (`theme/inc/privacy-default.html`).

## How it fits together

- **One stylesheet, one script**, as in the prototype: `assets/css/styles.css` and `assets/js/main.js`, enqueued with `filemtime()` cache-busting. WordPress's block/global styles are dequeued on the front end so nothing paints over the design.
- Before `main.js` the theme prints `window.SITE_ASSET_BASE` (theme URL), `window.SITE_URLS` (page permalinks), `window.SITE_CONFIG_OVERRIDES` (brand, phone, endpoints) and `window.SITE_ESTIMATE_PRODUCTS` (the Builder's data). Without the plugin, `main.js` falls back to its built-in defaults, so the theme alone still renders a working (store-nothing) estimate.
- Theme ↔ plugin contract (filters): `dh_setting( $default, $key )`, `dh_site_config( $config )`, `dh_estimate_products( null )`.
- Brand, logo and links in templates go through `dh_brand_e()`, `dh_brand_short_e()`, `dh_logo_url()`, `dh_url()` (`theme/inc/helpers.php`). Never hardcode the brand — it isn't final.
- Marketing copy (Home, Windows, Bath Remodel, Our Work, About) is **template content** by decision (6 Oct). Edit the prototype `.html`, then re-run the generator.

## Changing the design

1. Edit the prototype (`index.html`, `assets/css/styles.css`, `assets/js/main.js` …) and check it as a static site.
2. `python wordpress/tools/build_theme.py` — rewrites templates and copies assets; prints any leftover `.html` links, literal brand names or bare asset paths (must be "none").
3. Bump `Version:` in `theme/dh-remodel/style.css` (and `DH_THEME_VER`), re-zip with the packaging script, upload.

Hand-written theme files the generator never touches: `functions.php`, `inc/helpers.php`, `inc/setup.php`, `index.php`, `page.php`, `style.css`.

## Estimate data

- Stored in the option `dh_estimate_products` (JSON). Empty = `plugins/dh-estimate/data/default-products.json` (exported from the prototype, 2 products / 14 pages / 49 questions / 225 options).
- Image paths are Media Library URLs or theme-relative `assets/…` (resolved against the active theme on output — switching themes breaks the built-in option photos; re-pick them in the Builder or keep the theme).
- Everything saved passes `dh_est_sanitize_products()`: known keys only, texts sanitised, swatches whitelisted (no `url()`), show-if rules normalised to arrays.
- The Builder can Export/Import the setup as JSON (backup, or copying to a licensed site).

## Submissions

See `FORMS.md`. Public REST routes, no nonce (cache-safe); honeypot + 3-second time trap + 8/hour/IP rate limit. Saved first as private `dh_estimate` / `dh_message` posts; photos become Media Library attachments of the estimate (deleted with it).

## Local development

```powershell
cd wordpress
npx @wp-playground/cli@latest server --port=9400 --php=8.2 --login --blueprint=tools/blueprint.json `
  --mount-dir "./theme/dh-remodel" "/wordpress/wp-content/themes/dh-remodel" `
  --mount-dir "./plugins/dh-estimate" "/wordpress/wp-content/plugins/dh-estimate"
```

Run it from **PowerShell**, not Git Bash (Git Bash rewrites `/wordpress/...` into a Windows path). Login `admin` / `password`. Data is in memory and resets on restart.

## Verified (6 Oct 2026, Playground, PHP 8.2, WP 7.1.2, WP_DEBUG on)

- All 9 pages render with no PHP notices, no missing assets, no horizontal overflow; 15/18 page×width screenshots pixel-identical to the prototype at 1440 and 390 (the 3 others differ only because lazy photos hadn't loaded in the prototype capture).
- Estimate with photos (Bathroom + Something else) → saved, photos attached, thank-you page shown; contact message saved; spam request (honeypot + instant) dropped silently.
- Builder: loads all 6 products; saving the untouched setup round-trips with no data loss; an edit appears on the live estimate.

## Changelog

- **Theme 1.0.4 + plugin 1.0.3** (8 Oct 2026). The window count is now a stepper (− / number / +) with quick-pick chips instead of a plain field. Number questions take `unit` ("windows") and `picks` (chip numbers); both are kept by the sanitizer and editable in the Builder.

- **Theme 1.0.3 + plugin 1.0.2** (8 Oct 2026), Erin's 7 Oct requests. *Estimate:* only Bathroom and Windows (Siding, Doors, Roofing, Something else removed); Windows starts with "How many windows are we replacing?" (new `number` question type, also in the Builder's Type menu and the sanitizer); photo options enlarge on hover (mouse) or via a magnifier (touch). *Site copy:* home "2 projects" stat, services item "In-Person Quote", About. **A site whose Builder setup was saved keeps its old products:** Estimate → Builder → "Reset to the original setup" picks up the new defaults (this discards Builder edits).

- **Theme 1.0.2 + plugin 1.0.1** (7 Oct 2026) — *Plugin:* estimate option photos (tubs, fixtures, marbles, tiles, add-ons, vanities, faucets, flooring, colours) were sent to the page as relative `assets/…` paths and 404'd under `/estimate/` (220 broken on the Hostinger test site). Cause: `foreach ( $q['options'] ?? array() as &$opt )` references a temporary copy, so the resolved URLs were discarded; now loops by key. *Theme:* `main.js` also resolves any leftover `assets/…` image against the theme as a safety net; footer credit "Created with love by Digital Heroes" (→ digitalheroesco.com) on every page, including the estimate footer.
- **Theme 1.0.1** (6 Oct 2026) — responsive + performance pass, verified on 17 devices (phones 320–430, landscape phone, iPads portrait/landscape, Windows laptops 1280/1366/1536, MacBooks 1440/1512, monitors 1920/2560): no horizontal scroll anywhere; 44px touch targets on touch screens; min 12px text; WCAG contrast fixes (footer, header links, estimate progress); landscape-phone heroes fit the screen; wider page + larger base type on monitors ≥1800px (CSS `zoom` rejected — it breaks pointer maths); estimate layout shift 0.64 → 0.003; 800w/320w image sizes added, 5 heavy photos recompressed, portrait-aware `sizes` for full-bleed heroes/banners; CSS/JS minified in the theme build (gzip 42→30 KB and 46→30 KB). Lighthouse (local, slow server): accessibility, best practices, SEO 100; performance 96–98 desktop, 82–87 mobile.

- **1.0.0** (6 Oct 2026) — first WordPress build: theme generated from the prototype; plugin with Settings, page creation, Builder, Estimates, Messages, spam guards, optional email.
