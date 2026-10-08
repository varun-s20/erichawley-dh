# Troubleshooting

Symptom → cause → fix. Add to this every time something new comes up.

| Symptom | Cause | Fix |
| --- | --- | --- |
| Estimate photos (vanities, marbles…) missing after switching theme | Built-in option photos are theme-relative (`assets/images/estimate/…`) and resolve against the **active** theme | Keep DH Remodel active, or re-pick the photos in Estimate → Builder (they then come from the Media Library) |
| Estimate shows the original questions even after Builder edits | A page cache is serving old HTML (the questions are printed into the page) | Purge the cache after saving in the Builder; exclude `/estimate/` from page caching if it keeps happening |
| Estimate page buttons do nothing, logged out only | An optimiser plugin combined/deferred `main.js` and broke the inline config printed before it | Exclude `dh-site` / `main.js` and inline scripts on `/estimate/` from minify/combine/delay |
| "Submit" shows "We couldn't send your project just now" | REST API blocked (security plugin, host firewall) or PHP error | Open `/wp-json/dh-estimate/v1/estimate` in a browser: it should answer (405/404-style JSON, not an HTML block page). Check the PHP error log |
| Estimates saved but no email | Settings email empty, or mail dropped (no SMTP) | See the "Email:" line on the estimate; set up WP Mail SMTP (`FORMS.md`) |
| Theme upload: "The uploaded file exceeds the upload_max_filesize" | The theme zip is ~12 MB (photos) | Upload the unzipped folder by SFTP/file manager, or raise the limit |
| Plugin upload: "The package could not be installed" | Zip created by hand on Windows (backslash paths) | Re-zip with the skill's `package_plugin.py` |
| Local Playground: `Error mounting path … C:/Program Files/Git/wordpress/…` | Git Bash rewrites `/wordpress/...` arguments into Windows paths | Start Playground from PowerShell |
| Two "Privacy Policy" pages | WordPress ships a draft one | The plugin takes over the draft on activation; delete any extra copy |
