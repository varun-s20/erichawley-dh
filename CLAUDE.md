# CLAUDE.md — install-D Online Estimate (Windows & Bath Remodel)

Digital Heroes project for **Erin** (Fiverr: `erinhawleycont`), owner of **install-D** — https://install-D.com — a window replacement and bathroom remodeling company (phone on their site is a 910 area code, North Carolina; verify before use).

We are building a **static HTML/CSS/vanilla-JS prototype** of the site and the online estimate tool. It is sent to the client as the design direction, then converted to **WordPress** (the contracted platform). Everything we build must survive that conversion.

Source of truth for requirements: `client-chat/erinhawleycont.pdf` (Fiverr inbox, 10–26 Sept 2026).

> **Security:** the PDF's "Requirements" page contains the client's GoDaddy hosting login. **Never copy credentials into any file, commit, comment, log, or message.** Use them only in the hosting UI when deploying.

---

## 1. Engagement snapshot

| | |
| --- | --- |
| Offer accepted | 23–24 Sept 2026 ("The Tool", initial version; licensing later) |
| Work started | 26 Sept 2026 |
| Delivery | 20 days from start |
| Support | 1 month post-launch |
| Platform | WordPress on the client's existing GoDaddy hosting |
| Handover | Walkthrough video (how to edit products/options/text and how emails arrive), everything in the client's name |
| Future | White-label **licensing** to other companies once Erin shows business partners. Not in the current scope, but the build must make it easy. |

## 2. How the requirements evolved (read before changing anything)

Later messages supersede earlier ones.

| Date | Change | Status |
| --- | --- | --- |
| 10 Sept | Paint-company estimator: Interior / Exterior / Both, 21 rooms, 4 exterior sides, paintable items per room | **Superseded** |
| 10 Sept | "Online Estimate site should be yellow and red" | **Superseded** |
| 10 Sept | Contact form first; per-area measurements, photos and checkboxes; "Additional information" box; **COMPLETE** button; CONGRATS pop-up; organized email; generic/editable | **Still applies** (structure carries over to the new products) |
| 24 Sept | "Instead of interior/exterior as the main choices…" The products are now **WINDOWS** and **BATH REMODEL** | **Current** |
| 24 Sept | "I'd like the colors to be **blue and white**" | **Current** (our palette) |
| 24 Sept | Exact Windows flow and copy (§4) | **Current** |
| 24 Sept | Bath flow is shown in a video (Google Photos link); bath **item photos to follow** | **Pending**, not received |
| 24 Sept | Previous vendor's tool: "I didn't like the design and never used it" | Design quality is the reason this project exists |
| 25 Sept | "The website is install-D.com" | The estimate site is reached from install-D.com |

## 3. What the client needs (authoritative)

1. **Entry point:** install-D.com gets an **ONLINE ESTIMATE** button that leads to our estimate site. The client already has a **Request in-person quote** button, so we show both paths like Paintzen does: the online estimate as the primary action, in-person as the secondary.
2. **Step 1 is contact details:** name, address, phone, email (all required).
3. **Choose the project:** Windows, Bath Remodel, or both.
4. **Product flow** (Windows in §4, Bath in §5). When both are chosen, the Windows steps run first, then Bath.
5. **Finish:** an **Additional information** text box and a **COMPLETE** button.
6. **On COMPLETE,** show a **pop-up** (modal) with this exact text:
   **"CONGRATS! Your estimate has been submitted. You will receive your proposal soon."**
7. **Delivery:** the full submission is emailed to the client, **organized by product/area**, with photos attached. Every submission is also **saved** so nothing is lost if an email fails.
8. **Mobile-first.** Most customers use a phone, including for the photo uploads. The camera must be one tap away.
9. **Clear progress indicator.** Friendly, simple, no confusion.
10. **Spam protection** on the form.
11. **Photo handling:** compression, storage, and reliable uploads.
12. **Generic / reusable:** products, options and wording are editable by the client without a developer. Styling is not hard-coded to one company, so it can be rebranded for licensing.
13. **Client can edit it herself** in WordPress, "fairly easily" in her words.

### Out of scope (stated in the offer)
Automatic price calculation (Erin prepares proposals herself), online payments, ongoing marketing, and recurring costs (hosting, domain, premium plugin licences are billed to the client).

## 4. Windows flow — the client's exact spec (24 Sept, 19:27–19:44)

Keep the client's wording. Polish punctuation only, never meaning.

1. **Intro copy** (show at the start of the Windows flow):
   > "Looks like you're wanting to replace your windows — Great idea! Energy efficient windows pay for themselves! You can save up to 60% on your energy bills just by replacing your windows."
   - ⚠️ "Up to 60%" is the **client's claim**. Show it as written, but list it as an open question (§8): energy-savings claims need substantiation.
2. **"How many windows would you like to replace?"** A number.
3. **"Please upload a photo of each window you'd like to replace"** with the tip *"Pro Tip: take photos of each side of your home."*
   - **One photo per window, then NEXT.** In the client's words: "After each photo is uploaded the customer hits NEXT". Build a per-window slot flow ("Window 3 of 8"), not a single bulk dropzone. Selecting several photos at once fills the next empty slots.
4. **"Would you like to replace your windows with the same style you currently have or would you like us to replace your windows with the best option?"** Exactly **two** options: **Same style** and **You decide!**
5. **"Choose a color for your windows"**. The client's header reads **Interior/Exterior**:
   white/white · black/black · white/black · white/oak · dark brown/dark brown · tan/tan · white/green · white/almond
   - Our data stores `interior` first, then `exterior`, per the client's header. Confirm the orientation of the mixed pairs (§8).
6. **"Would you like grids in your windows?"** No · Same style as my current windows · Colonial grids · Diamond grids · Queen Anne grids. Then **Next**.
7. **Information note** (exact text):
   > "All of our window replacements come complete with new framing. Any windows that are on 2nd floor landings, in bathrooms, or are 16" or less from the floor, will be tempered."
8. There is an attachment `65E535A1-43C3-46CA-BBA5-EA8598EF1500.png` ("AFTER THEY CHOOSE WINDOWS"). **We don't have it.** Ask for it.

## 5. Bath Remodel flow — from the client's video (`assets/video/C59A4167-….mp4`)

The video is a 4-minute phone screen recording (no narration) of the **previous vendor's tool at hometech-remodeling.com** (a different company). Erin walked through it as the reference for the bath flow. It shows the **questions and options she wants**, not a design to copy; she disliked that design. Item photos in it belong to that site, so we need her own (or licensed) images for every option.

**Flow order in the video:** contact form (step 1 of 10) → service type (multi-select: Bathroom, Window, Siding, Doors, Roofing, Others) → Bathroom → Windows (when both are chosen) → "You are almost done!" → submit → thank-you message.

### Bathroom questions (wording as shown; keep it, polish punctuation only)
1. **Intro:** "Great! You're looking to renovate your bathroom." Quote: "Water is the most damaging thing to a home. Replacing your old plumbing and eliminating mold & mildew is a smart decision!"
2. **Photos:** "All we need are a few photos. Please upload 4-5 photos of your bathroom. We love photos, so send as many as you want!" (Photo Library / Take Photo / Choose Files)
3. **"Would you like to design your bathroom yourself or would you like us to Design it for you?"** Let me design it · You do it for me
4. **"Choose which items you would like to focus on?"** (multi) Bathtub or Shower · Vanity · Flooring · Toilet. Only the chosen sections appear below.
5. **Bathtub or Shower design process**
   - "What would you like to do to the wet spaces in your bathroom?" Replace your tub with a new tub · Replace your tub with a new walk-in shower · Replace your tub and shower with one big walk-in shower · Replace your shower with a new shower · Replace your tub with a walk-in shower and remove your current shower · Replace your tub with a new tub and replace your shower with a new shower
   - **Walk-in shower questions**
     - "Choose the height of your shower pan": Low Profile – 1" With Ramp · Standard – 4" · Double Threshold – 8"
     - "Glass doors or curtain rod?" (photo cards): Glass Doors · Curtain Rod
     - "What color for your fixtures?" (photo cards): Chrome · Brushed nickel · Matte black · Gold · Oil rubbed bronze
     - "Your shower will come with a standard shower head and valve, 2 corner shelves and 1 – 18" grab bar. Need anything else in your shower? (choose all that apply)" (photo cards, multi): 2 More Corner Shelves · Soapdish · A Niche Shelf · A Teak Seat · A Bench Seat · A Corner Seat · A Foot Pedestal · A 12" Grab Bar · A 24" Grab Bar · A Grab Bar Around The Valve · A Rain Shower Head Plus A Standard Shower Head
     - "Choose a wall design for walk-in shower": Basic colors · Marbles · Tile Designs. Each reveals its own gallery:
       - Marbles (photo cards): Napoli Marble · Tuscany · Horizon Beige · Sandalwood · White Travertine · Canyon Rock · Glacier Ice · Carbon Ash · Metapeake · Versailles · Artic Ice · Evo (+ more)
       - Tile Designs (photo cards): Chevron · Cobblestone · Panorama · Subway · Roman Block · Flagstone; then "Black or grey laser etched grout?" Black · Grey; then "If you would like to add a marble color to your tile design, enter the name here" (text)
       - Basic colors: options not shown in the video. **Ask Erin.**
6. **Vanity design process**
   - "Would you like us to supply the vanity or would you like to buy your own vanity and have us install it?" I want you to supply the vanity · I will supply the vanity myself but I will need you to install it
   - If they supply it: "Are you going from a single bowl vanity to a double bowl vanity?" Yes · No, I'm keeping the same amount of bowls
   - If we supply it: "Would you like a single vanity or a double?" Single · Double. Then "Choose a design you like" (Vanity 1–20, photo cards). Then "Don't worry, we will match your vanity size to your current vanity. Is that okay, or would you like to change the size of your vanity?" That's great! · I want a bigger vanity than the one I have now · I want a smaller vanity than the one I have now
   - "We will match your vanity faucets with the color of your shower faucets. Choose a faucet style:" Faucet 1–12 (photo cards)
7. **Flooring design process:** "We offer luxury vinyl plank and luxury vinyl tile. This is the best product for any bathroom space due to its durability, softness to the feet, and waterproofing capabilities." Then "Choose a design for flooring": Style 1–22 (photo cards)
8. **Toilet design process**
   - "Would you like us to supply the toilet or will you be supplying the toilet and need us to install it?" You supply the toilet · I will supply the toilet but I'll need you to install it
   - If we supply it: "Choose a color for your toilet": White · Black · Almond (swatches). "Choose a style": Standard · Comfort Height – a bit taller, helps your knees… · A fancy toilet and bidet combo. Very modern. Very mindful. Very demure.
9. **"You did it! Is there anything else you would like to add to your estimate?"** (multi) Remove tile wainscotting around the walls · Remove the vanity mirror · Add a ceiling light with exhaust · Replace vanity lights. Then **More Details** (text)

### Windows (as shown in the same video, for comparison with §4)
"It looks like you're also wanting to replace your windows. Great idea!" + the 60% quote; "Please upload a photo of each window you are wanting to replace. An inside photo is best."; same style / you decide; colors (the old site: White · Tan · Black · Burgundy · Grey · Green · Dark brown); grids (No · same as current · diamond · colonial); "All of our window installs come with re-framing, new sills and casing. Any windows on 2nd floor landings, in bathrooms, and/or are less than 16" from the floor will be tempered. Any bathroom windows will be tempered and obscure." **Erin's 24 Sept text (§4) is newer and wins**, but note two extras here: "An inside photo is best" and "bathroom windows will be tempered **and obscure**". Ask whether she wants both added.

### Finish (video)
"You are almost done! Within 24 hours, you will receive your estimate. We will also send you information about our company, about each product you want an estimate for, and steps on how to move forward with your renovation project. We will also tell you about our financing options…" → Submit → "Thank you for your message. We will get in touch with you shortly." Erin's own ask (§3.6, the CONGRATS pop-up) replaces this ending. The **"within 24 hours"** and **financing** promises are the old company's; only use them if Erin confirms.

### Built (29 Sept 2026)
- `BATH_FLOW` in `main.js` §1 holds every question above as data (overridable with `window.SITE_BATH_FLOW`). Steps: **b-photos** (video intro + "4–5 photos") → **b-plan** (design yourself / we design, focus areas) → **b-shower / b-vanity / b-floor / b-toilet** (each only if chosen) → **b-details** ("You did it!" extras + More details).
- **One step per bathroom area** (team decision, 29 Sept: a one-question-per-step split was tried and rejected): `BATH_PAGES` gives `b-plan`, `b-shower`, `b-vanity`, `b-floor`, `b-toilet`. A step is skipped when its area isn't chosen. Inside a step, questions are numbered blocks split by hairlines, and numbering follows the visible questions (CSS counter). Answers use a compact design (`styles.css` §19q): text answers are wrapping pills (a radio dot or checkbox square on the left), photo answers are small tiles (4 columns on desktop, 3 on phones), and colors are compact chips.
- The engine supports single, multi and text questions, `showIf` follow-ups, and image, swatch or list cards. Required visible questions are validated. Answers are saved in the draft, shown in the review by area, and sent in `payload.bath.areas` grouped by area for the email.
- **Provisional:** shower-door and vanity photos are our stock images. Marble, tile, flooring and fixture colours are CSS swatches. Faucet styles are generic types (the video had "Faucet 1–12" images). All are marked `provisional`; swap in Erin's photos.
- Bath page "areas" cards now describe these four areas.

### Still open from the video
- Erin's own photos for every option (vanities 20, faucets 12, flooring 22, marbles 12+, tiles 6, shower add-ons 11, doors 2, fixtures 5, toilets 3).
- "Basic colors" wall options (not shown in the video).
- Whether "Let me design it" vs "You do it for me" should change which questions appear (the video shows the same questions either way).
- Windows extras seen in the video: "An inside photo is best", "bathroom windows will be tempered and obscure". Not added; ask Erin.
- The old tool's service list (Siding, Doors, Roofing, Others). Still routed to the in-person quote until Erin confirms them as online products.

### Build notes
- Every option list above goes into `bathOptions` config (categories → questions → options with `image`), with conditional `showIf`. The engine needs **multi-select** questions, **conditional sub-questions** and **free-text** fields; today it only has single-choice cards.
- **Images needed from Erin** (we can't reuse hometech's): 2 shower-door, 5 fixture finishes, 11 shower add-ons, marble swatches (12+), 6 tile patterns, vanities (20), faucets (12), flooring (22), 3 toilet colors.
- Not in the video: measurements, per-area "colours picked out?" beyond the above, and "Basic colors" options.
## 6. Open-question list for the client (keep updated)

- [x] Bath flow extracted from the video (§5). Still need: **her own item photos** for every option, the "Basic colors" wall options, and whether the "24 hours / financing" wording applies to install-D
- [ ] The missing screenshot `65E535A1-….png`
- [x] Color pairs follow her **Interior/Exterior** header exactly (white/oak = white inside, oak outside)
- [ ] "Save up to 60%": confirm the client wants it published and can substantiate it
- [ ] Email address that receives submissions
- [x] ~~Logo / brand name~~ — using install-D and the logo from install-D.com (ask for the original vector file)
- [ ] Phone, service area, licence numbers, real reviews, real project photos
- [ ] Where the tool lives: a subdomain (e.g. `estimate.install-D.com`), a page on the existing site, or a standalone domain

## 7. Build rules

### Stack
- Static **HTML5 + CSS + vanilla JS**. No frameworks and no build step. One stylesheet (`assets/css/styles.css`) and one script (`assets/js/main.js`) for every page.
- Behaviour hooks are `data-*` attributes (not generated class names), so WordPress templates can output the same markup and get the same behaviour.
- **Editable content is config** in `main.js` §1: `SITE_CONFIG`, `WINDOW_COLORS`, `WINDOW_GRIDS`, `bathOptions` (see README §3). A CMS overrides them with `window.SITE_CONFIG_OVERRIDES` / `window.SITE_BATH_OPTIONS`. Keep moving estimator wording and options into config, not markup; this is what makes the tool generic and licensable.
- `SITE_CONFIG.submissionEndpoint` empty means **dev mode**: nothing is sent, and the payload is logged and shown inside a "Development preview" frame.
- `_archive/` is reference only. **Never edit it or link to it.**
  - `v1-2026-09-26/` is a snapshot of the approved design before the motion layer.
  - `v2-daylight-blueprint-2026-09-28/` is the rejected v2 exploration (§8). Its estimator JS already implements most of the §8a gaps, so it's a useful source to port from.

### Content integrity
- Never invent reviews, ratings, stats, licence numbers, awards, phone numbers or addresses. Mark placeholders clearly (the `data-placeholder` / dev-note pattern) so they can be switched off with `SITE_CONFIG`.
- Stock photos are representative (Unsplash licence, listed in README). They will be replaced with the client's projects.
- No Review/AggregateRating schema without genuine reviews.

### Accessibility and quality bar (WCAG 2.2 AA)
- Real form controls: radios and checkboxes inside cards, `<label>` for every input, `aria-invalid` with linked error text, and a visible focus ring. Selected state uses an icon as well as color.
- One `h1` per page, landmarks, a skip link, and native `<dialog>` for modals.
- `prefers-reduced-motion` removes movement and keeps opacity and color changes.
- Hover effects only inside `@media (hover: hover) and (pointer: fine)`.

## 8. Design — the approved look (v1) + motion layer

**Decision (28 Sept 2026):** the team prefers the **original "Clearwell" design (v1)**. A full redesign ("Daylight & Blueprint", v2: editorial serif, blueprint line work) was built and **rejected**. Only its animations were kept, ported into v1. **Do not restyle toward v2.** Improve v1 within its own language.

### Layout & content rules (team, 28 Sept 2026) — apply to every page
1. **No wasted whitespace.** Columns end together, with no empty half-rows, dead photo bands or oversized section padding (`--section-y` ≈ 56–100px). If one column is taller, rebalance it: resize the media, spread the list across the row, or split the prose into two columns.
2. **Headings use the full available width.** No forced `<br>`, no narrow `max-width` on `h1`/`h2`. A heading only wraps when it genuinely doesn't fit, and it never wraps early while the space beside it sits empty. Headings use `text-wrap: pretty`, never `balance` (balance breaks lines early). `initHeadingWidows()` in `main.js` keeps the last two words of any heading with 4+ words together.
3. **Body text goes below its heading, never beside it.** No heading-left / paragraph-right layouts. Carousel arrows beside a heading are the one allowed exception.
4. **No eyebrow pills** (the small label above a heading). Headings stand on their own.
5. **Few words.** The hero is a short headline, one sentence and two actions. Section intros are one sentence.

### Reference: `assets/ref.mp4` (v1.3, 28 Sept 2026) — current design language
The team supplied a reference video (a "CoolFix" AC-repair site). Its language is applied site-wide in `styles.css` §19l and **supersedes the palette, type and header notes further down** where they conflict:
- **Type:** *General Sans* (self-hosted variable, `assets/fonts/general-sans-variable.woff2`). Headings are weight 500, **Title Case** (via `text-transform: capitalize`, marketing headings only; estimator questions stay verbatim) and a single tone. There is no italic accent any more: `.text-accent` inherits.
- **Colors (sampled from the video):**
  | Token | Hex | Use |
  | --- | --- | --- |
  | `--sky` | `#5DA0EB` | Ref accent: indicator bars, dots, accents on dark (7.4:1). Decorative only on white. |
  | `--sky-600` | `#4F93E3` | Large stat numbers (3.2:1, large-text AA) |
  | `--color-primary` | `#2F72D0` | Buttons, links, active step fill (white text 4.7:1). The ref's `#699DDE` fails AA, so it was deepened. |
  | `--color-text` | `#232226` | Ink |
  | `--color-text-muted` | `#6B6A73` | Secondary text (5.3:1) |
  | `--color-surface` | `#F4F5F8` | Light grey panels |
  | `--dark` | `#06070C` | Reviews, FAQ, CTA and footer (ref's near-black) |
- **Header:** menu circle and a "Windows / Bath" split pill on the left, the logo centered, "In-person quote" pill and "Free estimate" on the right. It is transparent over the home hero, and turns dark over `[data-header-theme="dark"]` zones. The full nav lives in the drawer at every width.
- **Home structure:** centered photo hero (pinned; the page slides over it) → big number rows → expanding photo → pinned services list → 5-column steps → before/after → dark zone (review cards, numbered FAQ rows, photo CTA) → black footer with a big wordmark.
- **Ref animations** (`main.js`, one rAF scroll loop via `onScrollFrame()`, all skipped for reduced motion): `initHeroScroll`, `initWordReveal` (heading words go grey → ink), `initStats` (numbers rise from under the hairline and count up), `initExpand` (inset photo clips out to full bleed), `initServices` (pinned ≥1024px, list walks with scroll, image crossfade + blur), `initSteps` (active column widens + fills, auto-advances), `initDragScroll` (review track).
- **Not copied from the ref, on purpose:** the "• OUR SERVICES" section labels (rule 4) and the right-half-only headings (rules 2–3). Stats show real counts from the client's option lists (8 colors, 5 grids, 2 services, 1 photo per window). Never invent years, customer counts or ratings like the ref's.

### Visual language (v1.2 — superseded by the reference above where they differ)
- **Palette (v1.2, `styles.css` §19k):** ui-ux-pro-max's *Home Services* "trust blue", kept **strictly blue & white** per the client, so the skill's orange accent was dropped. Every text pair passes WCAG AA.
  | Token | Hex | Use |
  | --- | --- | --- |
  | `--blue-600` / primary | `#1F5BDB` | Buttons, links, italic accent phrases (white text 5.9:1) |
  | `--blue-700` | `#1848B8` | Hover |
  | `--blue-900` / navy | `#0D2255` | "How it works" section, principle cards (white text 15.3:1) |
  | `--color-primary-bright` | `#8DB5FF` | Accents on navy and hero photos (7.4:1) |
  | `--color-text` | `#0C1C3F` | Headings and body (16.8:1) |
  | `--color-text-muted` | `#4A5A78` | Secondary text (6.9:1) |
  | `--color-surface` | `#EEF4FF` | Alternating section tint |
  | white | `#FFFFFF` | Page background and cards |
- **Type:** *Plus Jakarta Sans* (self-hosted variable, normal + italic). Semibold headings with an italic accent phrase in brand blue (`<em class="text-accent">`), sentence case.
- **Header:** solid white bar. Logo, then the nav right beside it (current page marked by a 3px blue bar on the header edge), then "In-person quote" and "Free online estimate" on the right. The estimate button stays visible on mobile.
- **Components:** pill buttons, filled pill inputs, rounded cards (`--radius-*` 10–32px), soft navy-tinted shadows, full-bleed photographic heroes, service tiles, and the "How it works" step tour with its phone mockup.
- Tokens live in `styles.css` §01 and are overridden in §19k. Device tiers are in §19 (README §9).

### Motion layer (`styles.css` §19j + `main.js`)
| Motion | Where | How |
| --- | --- | --- |
| Masked headline lines | Home hero (markup spans); inner-page `h1[data-split-lines]` | `splitLines()` wraps each rendered line in a mask, plays the rise, then **restores the original markup**. It's skipped if fonts take more than 240ms or reduced motion is on, in which case the CSS rise plays instead. |
| Hero entrance | `.page-hero`, `.not-found` | Staggered `rise`. The hero photo wipes up (`clip-up`) while settling from 1.12× zoom. |
| Photo wipes on scroll | `data-reveal="clip"`, `[data-reveal-clip]` groups (staggered 90ms) | WAAPI clip-path wipe plus zoom settle, so no clip-path is left behind. |
| Softer reveals | all `data-reveal` | 800/1000ms ease-out, 26px travel, 80ms stagger. |
| Header auto-hide | `[data-site-header]` | Hides on scroll down after 480px and returns on any scroll up or focus. Off for reduced motion. |
| "How it works" tour | Home `[data-tour]` | Heading on top, 5 clickable steps and a phone mockup that shows the active step. It auto-advances on a timer bar, pauses on hover, focus or when off-screen, and stays manual for reduced motion. |
| Diagram crossfades | `.win-frame` / `.win-muntin` | 300ms fill/stroke transition when the finish changes. |
| Summary "stamp" | Estimator summary rows | Brief highlight when a row appears or a choice (Project/Style/Color/Grids) changes. Typed fields don't re-stamp. |
| Confirmation | `.confirm` | Ring draws, then the tick, then a burst of pane-shaped confetti (`burstConfetti()`). |

### Motion rules (Emil Kowalski's design-engineering principles)
- Use the easing tokens `--ease-out`, `--ease-in-out` and `--ease-drawer`. Never `ease-in` on UI.
- UI transitions stay under 300ms. Press feedback is `scale(.97)`. Never animate from `scale(0)`.
- Animate only `transform`, `opacity` and `clip-path`. Use transitions for anything interruptible.
- Content already on screen is never hidden. Hover effects stay behind `(hover: hover) and (pointer: fine)`.
- Delight is reserved for rare moments (first load, confirmation). Estimator step changes stay fast (~260ms).

## 7a. Brand & scope (v1.4, 28 Sept 2026)
- **Brand is install-D** (the placeholder "Clearwell" is gone). The logo emblem is cut from the client's own logo on install-D.com and lives in `assets/images/brand/installd-emblem-{128,256,512}.{webp,png}`, with favicons and the OG image regenerated from it. The wordmark is "INSTALL-D" in wide tracking, as in the logo. Brand colors from the logo: navy `#1B1B41` (all dark sections) and sky `#7FD2FE` (accent on dark, hero headline gradient).
- **Phone** `(910) 617-9122` comes from install-D.com's live site and is set in `SITE_CONFIG.phone`. Confirm it before launch.
- **Scope:** install-D is a **home remodeling** company. The previous vendor's tool covered "windows, bathrooms, roofing, etc." (24 Sept). The **online estimate** covers **Windows and Bath Remodel only**, because those are the products Erin listed for the tool. The site presents install-D as a remodeler, and routes "Other Remodeling Projects" to the in-person quote. Never invent other services (roofing, siding and so on) as bookable products until Erin confirms them.
- **Dev notes are off** (`showDevNotes: false`). Placeholder markers still exist in the markup, so set the flag to `true` to review them. The sample reviews were replaced by an "Ideas for your home" card set (inspiration, not testimonials).
- The header is **always visible** (sticky). It never hides on scroll.
- **Brand blue = the logo's sky `#7FD2FE`** (team, 1 Oct 2026; `styles.css` §19r, supersedes the `--color-primary` values in §8). Fills (buttons, active steps, checks, the before/after tab) use it exactly, with logo navy text on top (9.8:1; white would be 1.7:1). Text, icons and selection rings on white use `--color-primary-ink` `#0D71A5` (same hue, 5.35:1). Dark zones use the pure sky. Keep this split when adding components: `background: var(--color-primary)` + `color: var(--color-on-primary)`, and `color: var(--color-primary-ink)` for text on white.
- **Home before/after** uses matched straight-on pairs at 2400px (`windows-before-weathered` / `windows-after-white`, `bath-before-blue-tile` / `bath-after-bright`). They are still stock photos of different homes: free same-room remodel pairs don't exist (only paid Unsplash+/iStock). Replace them with Erin's real before/after shots.
- **"Ideas for your home"** is a pinned horizontal scroll (`initScrollTrack()`): the section sticks, centred under the header, and the cards slide 1:1 with page scroll (eased), then the page moves on. Reduced motion keeps the swipeable row and arrows.

## 8a. Gap list — current estimator vs the client's spec (to do)

The restored v1 estimator predates the 24 Sept spec. Items 1–8 below already exist in the archived v2 estimator JS and can be ported from there.

1. **Order.** Contact details (name, address, phone, email) must come **first**, then project choice. v1 asks project → contact → location.
2. ~~**Windows intro copy**~~ — **done** (29 Sept): verbatim banner on the window-count step, question uses her wording.
3. **Photos.** The client wants **one photo per window with NEXT after each**. v1 has one bulk uploader. Her title and **Pro Tip** are now on the step (29 Sept); the per-window slot flow is still to do.
4. **Style.** Team decision (29 Sept): **keep our three options** as they are.
5. ~~**Colors**~~ — **done** (29 Sept): data, swatches (Int left, Ext right), payload, summary chips and the Windows-page visualizer all follow her "Interior/Exterior" header — first color is interior.
6. **Framing/tempered note.** Use the client's exact text (§4.7). v1 has a softened draft.
7. **Finish.** The client wants an **Additional information** box plus a **COMPLETE** button. v1 has a Review screen with "Submit My Project".
8. **Confirmation** must be a **pop-up** with the exact text "CONGRATS! Your estimate has been submitted. You will receive your proposal soon." v1 shows an inline thank-you page.
9. Client-side **photo compression** and a **spam honeypot** are missing.
10. ~~**Bath flow**~~ — **built** from her video (§5); waiting only on her item photos.
11. The **backend** (email grouped by area, photo attachments, saved submissions) is WordPress-side work (§10).
12. **Offer vs current ask.** The accepted offer (23 Sept) still lists the *painting* scope: 21 rooms, 4 exterior sides, painting items, **"Yellow and red styling"**. Erin's 24 Sept messages replaced that with Windows + Bath and blue & white. **Get written confirmation** that the new scope replaces the offer's list, so delivery isn't judged against the old one.
13. **Per-area measurements.** The original spec had a measurements box (W×H) per room or side. The new windows spec doesn't mention measurements, and the bath flow is unknown. Ask whether measurements are still wanted.
14. **"Do you have colours picked out?"** is in the offer ("Colour selection fields"). It's covered for windows by the color step, but not yet for bath.
15. **Walkthrough video and WordPress handover** haven't been started (offer deliverables).
16. **Items the client still owes:** the bath video contents and bath item photos, attachment `65E535A1-….png`, the submission email address, and where the tool lives. The GoDaddy login in the PDF is plain text in a shared document; recommend Erin change the password after launch.

## 9. QA before anything goes to the client (Digital Heroes default rules)

- [ ] Mobile, tablet and desktop: 320 / 375 / 430 / 768 / 1024 / 1440 / 1920. No horizontal overflow.
- [ ] Chrome, Firefox, Safari (iOS especially: camera upload), Edge.
- [ ] Every link and button works. Every estimator path works (windows / bath / both, edit, back, draft restore).
- [ ] Forms validate. The confirmation shows (the CONGRATS pop-up once §8a is done). The dev-mode payload is correct.
- [ ] Motion: check reduced motion too (DevTools → Rendering → prefers-reduced-motion). Headlines must be visible and nothing left clipped.
- [ ] Images: no broken images, real alt text, width/height set, lazy below the fold.
- [ ] PageSpeed 80+ (self-hosted fonts, WebP `srcset`, no third-party JS).
- [ ] Spelling and grammar pass. The client's quoted copy stays verbatim.
- [ ] Compare against this file: does it match what the client asked for?

Quick screenshots: `npx playwright screenshot --full-page --viewport-size="1440,900" "file:///<abs-path>/index.html" out.png`

## 10. WordPress conversion notes

- Header and footer sit between `BEGIN/END: site-header|site-footer` comments and map to `header.php` / `footer.php` (or template parts).
- Estimator config maps to an **options page** (ACF or Carbon Fields): colors, grids, bath categories and all copy. It is printed as `window.SITE_CONFIG_OVERRIDES` / `window.SITE_BATH_OPTIONS` before `main.js`.
- Backend: a REST route (or Gravity Forms / Fluent Forms API) that accepts the multipart payload. It stores each submission as a CPT entry, stores photos in the media library, emails a grouped summary with photos attached through SMTP (WP Mail SMTP), and adds a honeypot plus Cloudflare Turnstile or reCAPTCHA for spam.
- Testimonials, projects and FAQs become CPTs. See README §8.
