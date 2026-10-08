# Forms: estimates and contact messages

## Endpoints

| Form | Route | Body |
| --- | --- | --- |
| Online estimate | `POST /wp-json/dh-estimate/v1/estimate` | multipart: `payload` (JSON from `buildEstimatePayload()`), `hp`, `elapsed`, `photos_<product>[]` |
| Contact | `POST /wp-json/dh-estimate/v1/contact` | JSON: `firstName`, `lastName`, `email`, `phone`, `topic`, `topicLabel`, `message`, `hp`, `elapsed` |

`main.js` gets both URLs from `SITE_CONFIG_OVERRIDES` (`submissionEndpoint`, `contactEndpoint`). If they're empty (static prototype), it runs in development mode and sends nothing.

## What happens on submit

1. **Spam guards:** a filled honeypot (`company_website`), or a submission under 3 seconds after page load, gets a fake `{"ok":true}` and is stored nowhere. Over 8 submissions per hour from one IP gets a 429.
2. **Validation:** an estimate needs first name, valid email, phone and at least one project; a message needs name, valid email and message. Everything else is sanitised into the known payload shape.
3. **Saved first**, as a private `dh_estimate` / `dh_message` post (wp-admin → Estimate → Estimates / Messages).
4. **Photos** (estimate): real images only (`getimagesize` + type check, jpg/png/webp, ≤15 MB, ≤60 per estimate). They're saved to the Media Library as attachments of the estimate and shrunk to 2000 px. The browser already compresses them to ≤2000 px JPEG before upload.
5. **Email**, only if Estimate → Settings → *Send new estimates and messages to* is filled in: HTML summary grouped by project → section, with photo thumbnails linking to full size, and **Reply-To = customer** (never From). The result is recorded on the entry ("Email: sent / failed / not sent").

## Test site (now)

Email is **off** (decided 6 Oct): leave the address empty. Submissions are stored only.

## At launch: email delivery

PHP `mail()` from shared hosting is silently dropped by Gmail and Outlook. Do this before turning email on:

1. Install **WP Mail SMTP** (free). Mailer: the domain's provider (Google Workspace / Microsoft 365), or **Brevo** free (300/day).
2. From Email = an address **at the site's own domain**, with *Force From Email* on. From Name = the business name, forced.
3. DNS (whoever controls the domain): one SPF record including the mailer, the mailer's DKIM record, and DMARC `p=none` with a reporting address.
4. Fill in Estimate → Settings → *Send new estimates and messages to*.
5. Submit a real estimate (logged out) to a Gmail **and** an Outlook address. Open *Show original* and confirm SPF / DKIM / DMARC = pass. Reply to it and confirm the reply reaches the customer address.

## Optional: Cloudflare Turnstile

Not added. The honeypot + time trap + rate limit stop most small-site spam. If spam gets through, add Turnstile (free) to both forms and verify the token in `dh_est_spam_check()`.

## Privacy

The Privacy Policy page explains photo uploads and the drafts stored on the device. Entries can be deleted from wp-admin; deleting an estimate permanently also deletes its photos.
