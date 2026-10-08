# WordPress conversion plan

Status: **agreed** (6 Oct 2026). Open questions 1, 3, 4 and 5 answered; only the temporary domain (2) is pending. Correct anything here before code is written; everything below is cheap to change now and expensive later.

## 1. Decisions (from intake)

| Decision | Answer |
| --- | --- |
| Where it runs | Our **temporary domain** first. Migrated to the client's domain later with **All-in-One WP Migration Pro** (we own a licence). |
| Brand | **Not final** ("install-D" is a working name). Brand name, logo, phone and email must be settings, not hardcoded. |
| Route | **Standalone classic theme** (no parent, no page builder) + **our own plugin**. |
| Estimate editing | **Our own built-in editor** inside the plugin. No ACF. |
| Paid software | Only Elementor Pro and All-in-One WP Migration Pro, which we own. **Everything else must be free.** Elementor isn't used by this build. |
| Local testing | `wp-env` (Docker + Node, both installed) with `WP_DEBUG` on. |

## 2. What gets built

```
wordpress/
├── theme/dh-remodel/          the design: templates, CSS, JS, fonts, images
├── plugins/dh-estimate/       estimate tool, editor, submissions, contact form, site settings
│   └── dh-estimate.zip
├── tests/check.py             static checks
├── README-WORDPRESS.md        install + architecture (for us)
├── OWNER-HANDOFF.md           wp-admin guide for the owner, task by task
├── GO-LIVE.md                 launch + migration checklist
├── FORMS.md                   submissions, email, spam
└── TROUBLESHOOTING.md         grown as issues are hit
```

Slugs are brand-neutral (`dh-` = Digital Heroes) so a rename doesn't mean renaming folders.

**Why content lives in the plugin, not the theme:** if the theme is ever switched, the estimate questions, submissions and settings survive.

## 3. Pages

| Prototype | WordPress page | Slug | Template |
| --- | --- | --- | --- |
| index.html | Home (static front page) | `/` | `front-page.php` |
| windows.html | Windows | `/windows/` | `page-windows.php` |
| bath-remodel.html | Bath Remodel | `/bath-remodel/` | `page-bath-remodel.php` |
| our-work.html | Our Work | `/our-work/` | `page-our-work.php` |
| about.html | About | `/about/` | `page-about.php` |
| contact.html | Contact | `/contact/` | `page-contact.php` |
| privacy.html | Privacy Policy | `/privacy-policy/` | `page-privacy-policy.php` (text from the editor) |
| estimate.html | Free Estimate | `/estimate/` | `page-estimate.php` (own minimal header, as now) |
| 404.html | — | — | `404.php` |

- Header and footer become `header.php` / `footer.php`. The "current page" marker is set from the page being viewed.
- Internal links become pretty URLs (`contact.html` → `/contact/`) through `home_url()`, so nothing breaks on the domain move.
- Pages are created automatically when the plugin is activated, so a fresh install has every page and the front page set.

## 4. What the owner can edit (no developer)

| Area | Where in wp-admin | How |
| --- | --- | --- |
| **Estimate tool**: products, pages, questions, options, option photos, intro text, submit-page text | **Estimate → Builder** | Our editor: nested lists (product → page → question → option), media-library photo picker, drag to reorder, show/hide rules picked from dropdowns |
| **Submissions** | **Estimate → Submissions** | List of every estimate with contact details, answers grouped by product, photos. Stored even if email fails |
| **Contact messages** | **Estimate → Messages** | Same, for the contact form |
| **Site settings**: brand name, logo, phone, email that receives submissions | **Estimate → Settings** | One settings screen |
| **Privacy Policy** text | Pages → Privacy Policy | Normal WordPress editor |

**Not editable (decided 6 Oct):** marketing copy and photos on Home, Windows, Bath Remodel, Our Work and About stay in the theme templates, exactly as in the prototype. We edit them on request.

## 5. Estimate submissions

- The estimate page posts to the plugin's REST endpoint, `/wp-json/dh-estimate/v1/estimate`, as multipart (answers JSON + photos per product). That's the contract `main.js` already uses (`submissionEndpoint`).
- The plugin:
  1. checks the spam guards (below);
  2. resizes photos to max 2000px, saves them to the Media Library, and attaches them to the submission;
  3. saves a private **Submission** entry first, so nothing is lost;
  4. emails a branded summary (only when an email address is set in Settings — off on the test site), grouped by product → section, with photo links (and attachments up to a size cap), Reply-To = the customer;
  5. returns success, then the front end shows the confirmation.
- The contact form gets the same treatment at `/wp-json/dh-estimate/v1/contact`.
- **Spam (all free):** honeypot field, time trap (under 3 s = bot), per-IP rate limit, and optional Cloudflare Turnstile (free) as a settings switch.
- **Email delivery:** **WP Mail SMTP (free)** with a real sender address. Without it, mail from shared hosting is silently dropped by Gmail and Outlook.
- Client-side photo compression before upload (offer requirement; currently missing). Big phone photos are shrunk in the browser so uploads are fast on mobile.

## 6. Assets

- `styles.css` → `theme/assets/css/site.css`, `main.js` → `theme/assets/js/site.js`, both enqueued with `filemtime()` cache-busting.
- Fonts (self-hosted General Sans) stay in the theme.
- Design images (heroes, before/after, gallery) stay in the theme folder. Estimate option photos are imported to the **Media Library** so the owner can swap them in the Builder.
- The estimate's current settings list in `main.js` becomes the plugin's **default data**, used on first install and as the fallback if the saved data is ever missing.
- Absolute URLs only where required (canonical, OG image) and generated from `home_url()`, so the migration's search-replace isn't needed for them.

## 7. Free plugins to install

| Plugin | Why |
| --- | --- |
| WP Mail SMTP (free) | Reliable email delivery — **at launch on the real domain**, not on the test site |
| Yoast SEO (free) | Titles, meta descriptions, sitemap. The theme provides each page's prototype title/description as Yoast's default |
| All-in-One WP Migration Pro (owned) | Move temp domain → client domain |

Nothing else required. No ACF, no form plugin, no page builder.

## 8. Order of work

1. Local WordPress (wp-env); theme skeleton; header/footer; all 9 pages rendering identical to the prototype (screenshot diff).
2. Plugin: settings, page auto-creation, estimate data storage with defaults, front end reads it.
3. Submissions + contact endpoint, storage, email, spam guards, photo compression.
4. Estimate Builder admin screen.
5. Static checks, browser pass (logged out, mobile), docs, plugin zip.
6. Deploy to the temporary domain.

## 9. Open questions (answer before or during step 1)

1. ~~Marketing pages~~ → **keep in templates.**
2. **Temporary domain:** what is it, and is WordPress already installed there? I need wp-admin access (and SFTP or a file manager if possible) for step 6.
3. ~~SEO~~ → **Yoast SEO free.**
4. ~~Email~~ → **skipped on the test site.** Submissions are stored in wp-admin only. The email code is built and switched on in Settings once a receiving address + SMTP exist (at launch).
5. ~~Thank-you~~ → **keep the current thank-you page** (no CONGRATS pop-up).
