# Go-live checklist

Two moves: our machine → **temporary domain** (now), then temporary domain → **client domain** (later). Do them in order and tick as you go.

## A. Temporary domain (test site)

- [ ] WordPress installed, admin login works, PHP ≥ 7.4 (8.2 tested)
- [ ] Settings → General: Site Title = business name; timezone = America/New_York
- [ ] Upload theme `dist/dh-remodel.zip` → Activate. **If the upload fails** (the zip is ~12 MB and some hosts cap uploads at 2–8 MB): unzip it and upload the `dh-remodel` folder to `wp-content/themes/` by SFTP / the host's file manager, or raise `upload_max_filesize`.
- [ ] Upload plugin `dist/dh-estimate.zip` → Activate (creates the pages and sets the home page)
- [ ] Settings → Permalinks shows "Post name"; click **Save** once anyway (refreshes the rewrite rules)
- [ ] Install Yoast SEO (free). **Settings → Reading → "Discourage search engines"** = ON (test site must not be indexed)
- [ ] Estimate → Settings: name, short name, phone. Email **empty** (store-only on the test site)
- [ ] Delete WordPress's sample post, sample page and default comment
- [ ] Logged-out, private window, on a phone **and** a desktop: every page loads, menu opens/closes, estimate completes with photos, contact form sends
- [ ] wp-admin → Estimate → Estimates shows that test estimate with photos; then trash it
- [ ] Caching/optimisation plugin (if the host adds one): exclude `/estimate/` from JS minify/combine and test the estimate again logged out

## B. Client domain (launch)

- [ ] Client confirms the final brand name, logo file, phone and the email that receives estimates
- [ ] Back up the test site: **All-in-One WP Migration Pro → Export → File**
- [ ] On the client host: fresh WordPress → install All-in-One WP Migration Pro → **Import** the file (replaces URLs automatically)
- [ ] Log in again (the import brings the test site's users)
- [ ] SSL active; Settings → General URLs use `https://`; no mixed-content warnings
- [ ] Settings → Reading → **"Discourage search engines" OFF**
- [ ] Yoast: sitemap at `/sitemap_index.xml`; submit it in Google Search Console
- [ ] Email delivery: WP Mail SMTP + SPF/DKIM/DMARC, then fill Estimate → Settings → email (see `FORMS.md`); test to Gmail and Outlook, check headers
- [ ] Redirects: if the client's old site had URLs with traffic, map them to the new pages (Yoast Premium or the free Redirection plugin)
- [ ] Final pass, logged out, caches purged: all pages, estimate with photos (each product), contact form, 404 page
- [ ] Client gets an admin account in **their** name; we keep a separate account until support ends

## Rollback

Keep the export file from step B2. If launch goes wrong, re-import it on a clean install, or point DNS back to the old site while fixing.
