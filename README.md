# Vendora public website

Static GitHub Pages site for `myvendora.co.ke`. Publish from `main` at `/`; `CNAME` owns the custom domain. Cloudflare DNS apex records point to GitHub's four documented Pages IPv4 addresses and `www` is a DNS-only CNAME to `officialmrlyco.github.io`.

The app, backend, admin console and merchant secrets remain in the private Vendora repository. This repository contains only public website assets. Run `npm test` for official release URL boundaries and the no-public-price invariant.

The download section reads stable releases from this repository. Publish only a signed Vendora APK after the owner requests a release, without changing the version unless requested. There is currently no APK release. No debug APK is published.

The public marketing pages do not display package numbers or prices and do not read Firestore package catalogs. Current purchase information belongs in the Vendora app. The public site reads only official stable GitHub release metadata for its download section.

The homepage follows a centered dark hero with six quick-link cards and a separate illustrative workflow. The legal pages are available at `/terms/` and `/policy/`; the old `/privacy.html` page redirects to `/policy`. They describe known product data flows and avoid invented retention periods, deletion deadlines or refund promises. They are product information, not a legal review. The eTop production adapter is currently disabled pending provider integration.

Support uses `support@myvendora.co.ke` and the owner's approved WhatsApp number. Listing an email address does not create its mailbox; configure a mailbox or verified forwarding separately if needed.
