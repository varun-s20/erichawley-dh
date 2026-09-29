# Clearwell Home Remodeling — Static Front-End

Production-quality static website for a home-remodeling company whose launch services are **Replacement Windows** and **Bath Remodel**. It includes a multi-step online **estimate request application**.

Built with **HTML5, CSS3 and vanilla JavaScript only**: no frameworks, no build step, no runtime dependencies.

> **"Clearwell" is a placeholder brand name.** Replace it (logo mark, wordmark, `SITE_CONFIG.brandName`, page titles, footer) once the client's final name and logo are supplied. Search the project for `Clearwell`.

---

## 1. Quick start

Any static file server works. From the project root:

```bash
npx serve .                 # or
python -m http.server 8080  # then open http://localhost:8080
```

The pages also open directly from disk (`file://`) without console errors. Use a local server anyway for realistic testing of history navigation and caching.

## 2. File structure

```
/
├── index.html            Home (follows the reference layout order)
├── windows.html          Replacement Windows product page (styles, color visualizer, grids)
├── bath-remodel.html     Bath Remodel page (config-driven selections + fallback)
├── our-work.html         Filterable project gallery + lightbox + before/after
├── about.html            Company / approach
├── contact.html          Contact form (submission adapter, dev mode)
├── estimate.html         The estimate application
├── privacy.html          Privacy policy TEMPLATE (needs legal review)
├── 404.html              Not-found page
├── assets/
│   ├── css/styles.css    The only stylesheet (sections 01–20)
│   ├── js/main.js        The only script (sections 1–16)
│   ├── fonts/            Self-hosted Plus Jakarta Sans (variable, normal + italic)
│   ├── icons/            favicon.svg, favicon-32.png, apple-touch-icon.png
│   └── images/
│       ├── home/ windows/ bath/ projects/   Responsive WebP sets (-640/-1024/-1600[/-2400])
│       └── ui/og-image.jpg                  1200×630 social image
└── README.md
```

Every page loads only `assets/css/styles.css` and `assets/js/main.js`. There is no inline CSS and there are no inline scripts. Page-specific styling is scoped with `body[data-page="…"]`, and every JS feature initialises only when its markup exists.

## 3. Configuration (`assets/js/main.js` → section 1)

| Setting | Purpose |
| --- | --- |
| `SITE_CONFIG.phone`, `SITE_CONFIG.email` | Empty by default. When set, they appear automatically in the footer, contact page and estimator help card. Never fill them with made-up values. |
| `SITE_CONFIG.showDevNotes` | `true` shows the amber development notes that mark placeholder content. **Set to `false` before launch.** |
| `SITE_CONFIG.hidePlaceholderSections` | `true` removes every section marked `data-placeholder-section` (currently the sample testimonials). |
| `SITE_CONFIG.submissionEndpoint` → `SUBMISSION_ENDPOINT` | Where estimates are POSTed. Empty means development mode. |
| `SITE_CONFIG.contactEndpoint` → `CONTACT_ENDPOINT` | Where contact messages are POSTed. Empty means development mode. |
| `SITE_CONFIG.draftMaxAgeDays` | How long a saved estimate draft stays on the device (default 7). |
| `WINDOW_COLORS`, `WINDOW_GRIDS` | Client-supplied option lists. The Windows page and the estimator both render from these arrays. |
| `bathOptions` | Bathroom product catalogue, **currently empty** by design (see §6). |

A CMS can override any of this without editing the file by printing the following before `main.js`:

```html
<script>
  window.SITE_CONFIG_OVERRIDES = { submissionEndpoint: '/wp-json/clearwell/v1/estimate', phone: '(555) 555-0123' };
  window.SITE_BATH_OPTIONS = [ /* see §6 */ ];
</script>
```

## 4. The estimate application

### Flow

The steps shown depend on the project type:

| Project | Steps |
| --- | --- |
| Windows | Project → Contact → Location → Quantity → Photos → Style approach → Frame color → Grids → Notes (framing / tempered-glass note) → Review |
| Bath | Project → Contact → Location → Photos → *Selections (only when `bathOptions` has data)* → Description & notes → Review |
| Both | Windows steps followed by Bath steps, then Review |

The flow is defined once in `ESTIMATE_STEPS`. Each step has a `when()` predicate and an optional list of required choice groups.

### Behaviour

- **One decision per step.** The progress bar, phase indicator and "Step X of Y" update live.
- **Photo steps are optional.** The button reads "Skip for Now" until a photo is added.
- **Validation** runs on Continue and on blur, stays tolerant of international names, phones and postal codes, uses `aria-invalid` with linked error text, and focuses the first problem field.
- **Review screen** groups everything into cards, each with an **Edit** button. Editing a group walks through only that group's steps and then returns straight to Review. Nothing else is lost, including photos.
- **Browser back/forward** moves between steps. `?project=windows|bath|both` preselects the project; all service CTAs use this.
- **Drafts** are saved to `localStorage` after the homeowner interacts, via `saveEstimateDraft()`, `loadEstimateDraft()` and `clearEstimateDraft()`.
  - Only answers are stored. File objects are never persisted, and the homeowner is told photos must be re-added.
  - Drafts expire after 7 days and are cleared on "Start over" (with a confirmation dialog) or after a server-confirmed submission.
- **Save & Exit** confirms, saves the draft and returns to the homepage.

### State

All state lives in one object, `estimateState`:

```js
{
  currentStep: 'project',   // a step id (more robust than an index when the flow changes)
  furthestStep, projectType, contact: {…}, address: {…},
  windows: { quantity, approach, color, grid, details },
  bath: { selections: {}, description },
  notes: '',
  uploads: []               // { id, group, file, url } — in memory only
}
```

### Submission contract

`buildEstimatePayload()` produces:

```json
{
  "contact":  { "firstName": "", "lastName": "", "email": "", "phone": "", "preferredContact": "text" },
  "address":  { "street": "", "line2": "", "city": "", "region": "", "postalCode": "" },
  "projectType": "windows | bath | both",
  "windows":  { "quantity": 12, "approach": { "id": "recommend", "label": "…" },
                "color": { "id": "white-oak", "label": "White / Oak", "exterior": "White", "interior": "Oak" },
                "grid": { "id": "colonial", "label": "Colonial" }, "details": "", "photoCount": 2 },
  "bath":     { "description": "", "selections": [], "photoCount": 1 },
  "notes": "",
  "photos": [ { "group": "windows", "name": "front.jpg", "size": 123456, "type": "image/jpeg" } ],
  "source": { "form": "online-estimate", "page": "/estimate.html" },
  "createdAt": "ISO-8601"
}
```

`windows` and `bath` are `{}` when they don't apply.

`submitEstimate(payload, files)` behaves in one of two modes:

- **Development** (`SUBMISSION_ENDPOINT` empty): nothing is sent.
  - The payload is logged to the console.
  - The confirmation screen is shown inside a clearly marked **"Development preview — nothing was sent"** frame, with the JSON payload and a "Back to review" button.
  - The draft is kept. It **never** pretends a server accepted the request.
- **Production**: sends `POST multipart/form-data` with `payload` (a JSON string) plus `photos_windows[]` / `photos_bath[]` files, and treats any `2xx` as success.
  - The submit button is disabled and shows a spinner, and double submissions are blocked.
  - On network or server errors the homeowner stays on Review with every answer and photo intact and can retry.

**Connecting a real backend should only require changing `submitEstimate()`**, or just setting the endpoint if the backend accepts the contract above. The backend must store the lead, store the photos, and send notifications. A static site cannot do those reliably on its own.

## 5. Window options

- **Colors:** all 8 combinations the client supplied are shown as exterior/interior swatch pairs. The order is recorded as *Exterior / Interior*. **Confirm the orientation of each pair with the client** (for example, whether "White / Black" means a white exterior).
- **Grids:** No Grids, Same as Existing, Colonial, Diamond and Queen Anne. The SVG diagrams come from a single source (`windowSVG()`) and are reused on the Windows page, in the estimator, in the 404 illustration and in decorative previews. The diagrams take on the frame color the homeowner selected.
- **Window styles** on `windows.html` (Double-Hung, Casement, Sliding, Picture, Bay & Bow, Awning) are neutral categories for layout. **Confirm them against the client's actual product lineup.**
- **Framing / tempered-glass note:** the wording in `windows.html` and `estimate.html` is a draft (marked `CLIENT CONTENT`). Replace it with the client's exact text. It is informational only, not a code determination.

## 6. Bath options (content to be supplied)

`bathOptions` in `main.js` is intentionally empty, so no fake catalogue ships. While it is empty:

- the estimator skips the Selections step, and
- `bath-remodel.html#selections` shows a "Curated selections are on the way" panel.

When the client supplies products, add entries like this:

```js
{
  id: 'shower-tub',
  category: 'Shower & Tub',
  label: 'Which setup are you considering?',
  description: 'Optional helper text',
  options: [
    { id: 'walk-in', label: '<client-supplied name>', description: '', image: 'assets/images/bath/….webp' }
  ]
}
```

Both the Bath page showcase and the estimator step (visual cards plus a "Not sure yet" option per category) render automatically. Selections flow into the review screen and `payload.bath.selections`. Do not invent product names, SKUs, brands, prices or warranties.

## 7. Content to replace before launch

- [ ] Brand name and logo ("Clearwell" is a placeholder)
- [ ] `SITE_CONFIG.showDevNotes = false`
- [ ] **Testimonials:** the cards on the homepage are clearly marked samples. Replace them with verified reviews, or set `hidePlaceholderSections: true`. Never publish invented names, quotes or ratings, and don't add Review schema without genuine reviews.
- [ ] **Photography:** all images are representative stock photos (Unsplash License, listed in §10). Replace the before/after pairs, the Our Work gallery and the bath inspiration with the client's real projects. Keep `data-category="windows|bath"` on gallery items.
- [ ] Window style lineup, color orientation and the tempered-glass note wording (§5)
- [ ] `bathOptions` product data (§6)
- [ ] About page story, team, service area and licensing (the placeholder copy is flagged)
- [ ] Privacy policy: **must be reviewed and completed by legal counsel**
- [ ] Phone and email in `SITE_CONFIG`, only if supplied
- [ ] Replace `https://www.example.com` in canonical and Open Graph tags with the production domain
- [ ] Add `HomeAndConstructionBusiness` JSON-LD only after the business name, address, phone and service area are verified (a comment in each `<head>` marks where)
- [ ] Set `SUBMISSION_ENDPOINT` / `CONTACT_ENDPOINT` and test a real submission end to end

## 8. CMS / WordPress migration notes

- **Header and footer** are identical on every marketing page and wrapped in `<!-- BEGIN/END: site-header -->` and `site-footer` comments. They map directly to `header.php` / `footer.php` or block-theme template parts. The active menu item uses `aria-current="page"`; WordPress menus can output the same.
- **Behaviour hooks are data attributes**, not generated markup: `data-accordion`, `data-tabs`, `data-compare`, `data-reviews`, `data-gallery`, `data-color-viz`, `data-estimator`, `data-uploader`, `data-render="window-colors|window-grids"`, `data-diagram`, `data-config-item`, `data-placeholder-section`. Any template that outputs the same markup gets the same behaviour.
- **Suggested content models:**
  - Testimonials: custom post type (CPT) with name, project, quote, rating and source.
  - Projects / gallery: CPT with category (windows or bath), before/after pairs and alt text.
  - FAQs: CPT or repeater, grouped by service.
  - Bath options: CPT or ACF repeater printed as `window.SITE_BATH_OPTIONS`.
  - Window colors and grids: options page.
- **Estimator backend:** register a REST route (or use a form plugin's API) that accepts the multipart contract in §4, stores photos in the media library, creates a lead entry and emails the team. Then set `submissionEndpoint` via `SITE_CONFIG_OVERRIDES`.
- Enqueue `styles.css` and `main.js` once, site-wide. `main.js` is wrapped in an IIFE and exposes only `window.ClearwellEstimate` (read-only QA helper) on the estimate page, so it will not collide with jQuery or plugin globals.

## 9. Design system, accessibility and performance

- **Brand language:**
  - Airy blue-whites (`#F6F9FC`, `#EFF4F9`) with a cornflower blue scale (`--blue-50` … `--blue-900`). Ink blue `#10264A` is used for contrast sections.
  - Action blue `#3874CC` is the accessible step of the reference's soft `#5B95E3`, so white button text passes WCAG AA (4.6:1). The softer blues carry surfaces, icons and highlights.
  - Type is Plus Jakarta Sans: semibold headings, sentence case, and a signature **light-italic accent phrase** (`<em class="text-accent">`).
  - Components use filled pill inputs, white-pill segmented tabs, round icon buttons, stat tiles and soft blue-tinted shadows.
- **Full-screen layout:**
  - Photographic heroes and the final CTA run edge to edge.
  - Content sits in a 1440 px container whose gutters grow with the viewport, up to 80 px.
- **Device tiers:** section 19 holds a deliberate layout per tier, and grids are verified gap-free at each one.

  | Tier | Width |
  | --- | --- |
  | Small phones | ≤379 px |
  | Phones | base styles |
  | Large phones | ≥480 px |
  | Phablets | ≥640 px |
  | Tablet portrait | ≥768 px |
  | Tablet landscape / laptop | ≥1024 px (plus a dedicated 1024–1279 band) |
  | Desktop | ≥1280 px |
  | Wide desktop | ≥1536 px |
  | Short landscape phones | height-based query |

- **Tokens:** every color, font size (fluid `clamp()`), space (8 px rhythm), radius, shadow and easing is a CSS custom property in section 01.
- **Motion:**
  - Custom ease-out curves throughout; UI transitions run 140–360 ms.
  - Buttons get `:active` press feedback, and hover effects only apply on devices that support hover (`(hover: hover) and (pointer: fine)`).
  - The before/after slider uses clip-path and transforms, with no animated layout properties.
  - Scroll reveals use IntersectionObserver, and content already on screen is never hidden.
  - Motion layer (`styles.css` §19j):
    - Masked line-by-line headline reveals. Inner pages opt in with `h1[data-split-lines]`, and the original markup is restored after the animation.
    - Clip-path photo wipes (`data-reveal="clip"`, or `data-reveal-clip` on a stagger group) run via the Web Animations API.
    - The header hides on scroll down and returns on scroll up.
    - A sticky "estimate story" phone plays in the home process section (≥1280px).
    - Window diagrams crossfade between finishes.
    - Estimator summary rows highlight as they fill in.
    - The confirmation draws its ring and tick, then bursts pane-shaped confetti.
  - `prefers-reduced-motion` removes movement while keeping opacity and color feedback.
- **Accessibility (targets WCAG 2.2 AA):**
  - Semantic landmarks, one `h1` per page, a skip link and visible focus rings.
  - The mobile menu traps focus, closes on Escape and locks page scroll.
  - Native `<dialog>` is used for the lightbox and confirmations.
  - Accordions use `aria-expanded`/`aria-controls`, and collapsed panels are hidden from assistive tech.
  - Tabs support arrow keys, Home and End.
  - The before/after slider is backed by a real `input[type=range]` (keyboard plus `aria-valuetext`).
  - Selection cards are real radio inputs, so arrow keys work and the checked state is announced.
  - Selected states use a check icon as well as color.
  - All inputs have `<label>`s.
- **Performance:**
  - Responsive WebP `srcset` on every image, with `width`/`height` to prevent layout shift.
  - Hero images are preloaded with `fetchpriority="high"`; everything else is `loading="lazy"`.
  - Fonts are self-hosted (Plus Jakarta Sans variable normal + italic, about 57 KB), and there are no third-party scripts.
  - Before launch, consider re-adding `<link rel="preload" as="font" crossorigin>` for Plus Jakarta Sans on the production host. It was left out because Chrome logs a CORS error for font preloads when pages are opened from `file://`.
  - AVIF variants can be added later with `<picture>` if the host's pipeline supports it.

## 10. QA performed

Automated in Chromium via Playwright against a local server:

- **All 9 pages at 320 / 375 / 430 / 768 / 1024 / 1440 / 1920 px:** 0 console errors or warnings, 0 failed requests, no horizontal overflow, exactly one `h1`, and every image has alt text and dimensions. The same holds over `file://`.
- **Estimator (109 checks):**
  - All three project flows.
  - Validation, including international names, phones and postal codes.
  - Quantity stepper bounds, and upload add, invalid-type rejection, duplicate rejection, replace (old object URL revoked) and remove.
  - Keyboard selection, and edit-from-review (single step and multi-step groups).
  - Browser back/forward, draft save and restore, and Start over.
  - Development-mode submission.
  - Production submission against a mocked endpoint: 500 → error with retry → 200 → confirmation, multipart body verified, draft cleared.
  - Config-driven bath options rendering and validation.
- **Components (46 checks):**
  - Mobile menu: focus trap, Escape, focus return, scroll lock, link close.
  - Header scroll state, accordion (mouse and keyboard), tabs (arrow keys).
  - Before/after slider (keyboard, `aria-valuetext`, pointer drag).
  - Gallery filter and lightbox, color visualizer and grid recoloring.
  - Contact form validation and development mode.
  - Reduced motion, and the placeholder, dev-note and phone config switches.

**Photo sources** (Unsplash License; replace with client photography). Unsplash photo IDs:
1600210492486-724fe5c67fb0, 1568605114967-8130f3a36994, 1600566753086-00f18fb6b3ea, 1505691938895-1758d7feb511, 1616137466211-f939a420be84, 1509644851169-2acc08aa25b5, 1600210491892-03d54c0aaf87, 1560185009-5bf9f2849488, 1584622781564-1d987f7333c1, 1560448204-e02f11c3d0e2, 1595526114035-0d45ed16cfbf, 1576941089067-2de3c901e126, 1570129477492-45c003edd2be, 1598228723793-52759bba239c, 1480074568708-e7b720bb3f09, 1572120360610-d971b9d7767c, 1584622650111-993a426fbf0a, 1620626011761-996317b8d101, 1600566752355-35792bedcfea, 1629079447777-1e605162dc8d, 1564540583246-934409427776, 1604709177225-055f99402ea3, 1600488999585-e4364713b90a, 1595515106969-1ce29566ff1c, 1552321554-5fefe8c9ef14, 1507652313519-d4e9174996dd, 1596916355321-0ba9de8bb6e9, 1676591492880-1b82ec5c330b, 1630840450974-7c7ddad8bdfe, 1613849925594-415a32298f54 (home before/after pairs).

## 11. Known limitations

- `404.html` uses relative asset paths. If the host serves it for nested URLs (for example `/a/b/missing`), switch its asset URLs to root-relative (`/assets/...`) on that host.
- Static hosting cannot store leads or files. Submissions need the backend described in §4.
- On-screen window colors are approximations of the client's finishes.
