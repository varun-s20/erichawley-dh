# Install guide: custom site → WordPress

This puts the site on any WordPress so it looks and works **exactly like the custom site**. It takes about 15 minutes.

**What you need:** the two files in `wordpress/dist/`:
- `dh-remodel.zip`: the theme (the whole design)
- `dh-estimate.zip`: the plugin (estimate tool, saved estimates and messages, Builder, settings)

**Proven:** a brand-new WordPress (PHP 8.2, WordPress 7.1, Yoast SEO active) built from only these two zips matched the custom site **pixel for pixel**. That's 33 of 36 page × screen-size comparisons; the other 3 differed only because a photo or animation hadn't finished loading when the screenshot was taken. Estimates with photos and contact messages save correctly.

---

## Step 0 — Before you start

| Check | Where | Needed |
| --- | --- | --- |
| WordPress is installed | your temporary domain `/wp-admin` | Any recent version (6.3+) |
| PHP version | Tools → Site Health → Info → Server | **7.4 or newer** (8.1–8.3 ideal) |
| You can upload files | Media → Add New works | Yes |
| Upload size limit | Media → Add New shows "Maximum upload file size" | **16 MB or more** for the theme zip (13 MB). If it's lower, see Step 2b |

Use a **fresh** WordPress if possible. If the site already has pages, a theme or plugins, read "Existing sites" at the bottom first.

## Step 1 — Upload the theme first

The theme has to go first: the plugin copies the Privacy Policy text out of it.

1. **Appearance → Themes → Add New Theme → Upload Theme**.
2. Choose `dh-remodel.zip` → **Install Now** → **Activate**.

### Step 2b — Only if the upload fails ("exceeds upload_max_filesize")

Pick one:
- In the host's control panel (cPanel → *Select PHP Version → Options*, or the host's PHP settings), set `upload_max_filesize` and `post_max_size` to **64M**, then retry Step 1.
- Or unzip `dh-remodel.zip` on your computer and upload the `dh-remodel` folder into `wp-content/themes/` with the host's **File Manager** or SFTP. Then go to Appearance → Themes and **Activate** "DH Remodel".

## Step 2 — Upload the plugin

1. **Plugins → Add New Plugin → Upload Plugin**.
2. Choose `dh-estimate.zip` → **Install Now** → **Activate**.

Activating it automatically:
- creates the pages **Home, Windows, Bath Remodel, Our Work, About, Contact, Privacy Policy, Free Estimate**;
- sets **Home** as the front page;
- switches links to pretty URLs (`/windows/`).

You'll see a new **Estimate** menu on the left.

## Step 3 — Settings

1. **Settings → Permalinks** → make sure **Post name** is selected → click **Save Changes** (even if nothing changed; this refreshes the page addresses).
2. **Settings → General** → Site Title: `install-D Home Remodeling`. Timezone: **New York**. Save.
3. **Settings → Reading**:
   - "Your homepage displays" should already be **A static page → Home**.
   - On the **test site**, tick **Discourage search engines from indexing this site**.
4. **Estimate → Settings**: check the business name, short name and phone. Leave **"Send new estimates and messages to" empty** on the test site (estimates are saved in wp-admin only).

## Step 4 — Install Yoast SEO (free)

**Plugins → Add New Plugin** → search **Yoast SEO** → **Install Now** → **Activate**. Skip its setup wizard or click through it with defaults.

You don't have to type any titles. Every page already uses the custom site's title and description, and anything typed into a page's Yoast box later overrides them.

## Step 5 — Tidy up

- **Posts → All Posts:** trash "Hello world!".
- **Pages → All Pages:** trash "Sample Page". Keep the 8 pages from Step 2.
- **Appearance → Themes:** you can delete the unused default themes (keep one, e.g. Twenty Twenty-Five, as a fallback).

## Step 6 — Check it looks exactly the same

Open the site in a **private/incognito window** (logged out), and next to it the custom site (https://install-d.netlify.app). Compare:

- [ ] **Home:** full-screen photo hero with the transparent header, the numbers (7 / 4 / 2 / 1), the expanding photo, the services list, the 5 steps, the before/after slider (drag it), "Ideas for your home" sliding sideways as you scroll, FAQ, dark footer with the big INSTALL-D wordmark.
- [ ] **Windows, Bath Remodel, Our Work, About, Contact, Privacy Policy:** same as the custom site. The Bath Remodel header is transparent over its photo.
- [ ] **Free Estimate:** two project cards (Bathroom, Windows). Hover over a photo option (or tap its magnifier on a phone) and it enlarges. Then go through one project to the end and press **Submit**: you should see the thank-you page.
- [ ] **wp-admin → Estimate → Estimates:** your test estimate is there with its photos. Trash it afterwards.
- [ ] **Contact page:** send a test message → it appears under **Estimate → Messages**.
- [ ] A page that doesn't exist (e.g. `/test-404/`) shows the custom 404 page.
- [ ] On your **phone:** the menu opens and closes, and the estimate works, including taking a photo with the camera.

If anything looks different, see "If it doesn't look the same" below.

## Step 7 — Hand-off

- Give the owner their own **Administrator** account (Users → Add New User).
- `OWNER-HANDOFF.md` is the owner's guide to the dashboard. Use it for the walkthrough video.
- Moving to the client's real domain later: follow **GO-LIVE.md → part B** (All-in-One WP Migration Pro export → import), then set up email (FORMS.md).

---

## Updating an installed site to a new version

Upload the new zip over the old one; pages, settings, estimates and Builder edits are kept.

1. **Theme:** Appearance → Themes → Add New Theme → Upload Theme → choose the new `dh-remodel.zip` → Install Now → **Replace active with uploaded**.
2. **Plugin:** Plugins → Add New Plugin → Upload Plugin → choose the new `dh-estimate.zip` → Install Now → **Replace current with uploaded**.
3. If the host has a cache (Hostinger: LiteSpeed Cache / hPanel → Clear cache), **purge it**, then check in a private window.

---

## If it doesn't look the same

Almost always one of these. The design itself is identical in the theme.

| What you see | Cause | Fix |
| --- | --- | --- |
| Fonts, colours or spacing slightly off; buttons a different colour | A **caching/optimisation plugin** (LiteSpeed Cache, WP Rocket, Autoptimize, SG Optimizer, Jetpack Boost…) or the host's own optimiser is combining or minifying CSS/JS | In that plugin, turn off **CSS/JS combine, minify, "delay JavaScript", "remove unused CSS"** (our files are already minified), then **purge the cache** |
| Estimate buttons do nothing, or the Builder edits don't show | Same optimiser delaying or combining `main.js`, or a page cache serving an old copy | Exclude `/estimate/` from caching and JS optimisation; purge cache |
| Site looks like a plain blog / wrong layout | A different theme is active | Appearance → Themes → activate **DH Remodel** |
| Home page shows a list of posts | Front page not set | Settings → Reading → A static page → Home |
| `/windows/` gives "Not found" | Permalinks not refreshed | Settings → Permalinks → Save Changes |
| Two title bars / a second heading | A page builder (e.g. **Elementor**) was used to edit one of our pages | Don't open our pages in Elementor; if it happened, Pages → that page → "Back to WordPress Editor". Our pages render from the theme |
| Submit shows "We couldn't send your project just now" | A security plugin or host firewall blocks the WordPress REST API | Allow `/wp-json/dh-estimate/` in the security plugin (Wordfence, iThemes, etc.) |
| Small dark/white bar at the top when logged in | That's the WordPress admin bar (logged-in users only) | Normal. Visitors don't see it |

## Existing sites (not a fresh WordPress)

- If pages with the same names already exist (e.g. "About"), the plugin **reuses** them instead of creating duplicates. Their old content is ignored, because the theme draws those pages.
- Other plugins can add their own styles. If something looks off, deactivate plugins one at a time to find it.
- **Elementor / Elementor Pro** can stay installed. Just don't edit our 8 pages with it.

## What's inside (for reference)

- **The theme** contains every page's design, generated from the custom site's own files, so they can't drift apart. It also has all the photos and fonts, plus the minified stylesheet and script.
- **The plugin** contains:
  - **Estimate → Builder**, where all estimate questions, options and photos are editable;
  - **Estimates** and **Messages**, the saved submissions with photos and a status;
  - **Settings** for the name, logo, phone and notification email;
  - the spam protection (hidden honeypot field, 3-second time check, limit per IP address).
