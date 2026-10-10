# Vendora public website

Static GitHub Pages site for `myvendora.co.ke`. Publish from `main` at `/`; `CNAME` owns the custom domain. Cloudflare DNS apex records point to GitHub's four documented Pages IPv4 addresses and `www` is a DNS-only CNAME to `officialmrlyco.github.io`.

The app, backend, admin console and merchant secrets remain in the private Vendora repository. This repository contains only public website assets. Run `npm test` for official release URL boundaries and the no-public-price invariant.

The download section reads stable releases from this repository. Publish only a signed Vendora APK after the owner requests a release, without changing the version unless requested. The official signed release is [Vendora 1.0.1](https://myvendora.co.ke/#download), with asset `Vendora-1.0.1.apk` and build code 1. The release is mutable at the owner's request. Its verified local metadata and static download link keep it available when the GitHub API is unavailable. After any replacement, reverify the signature/version/digest and refresh the metadata, checksum and cache revision. No debug APK is published.

The public marketing pages do not display package numbers or prices and do not read Firestore package catalogs. Current purchase information belongs in the Vendora app. The public site reads only official stable GitHub release metadata for its download section.

<!-- / note: Keep crawler-facing descriptions synchronized with the visible public product explanation. -->
The homepage has static, grouped FAQs and generated WebSite, SoftwareApplication and FAQPage JSON-LD. After changing FAQ answers, run `npm run build:discovery` and `npm test`, then commit the generated homepage and root favicon files. The generator derives answers from visible HTML and wraps the approved PNG in an ICO container without changing the artwork. It does not add ratings, price offers or runtime data requests. `robots.txt` and `sitemap.xml` expose the canonical public pages; account-action routes remain `noindex,nofollow` and are absent from the sitemap. Search ranking, favicon display and inclusion in AI answers are controlled by the relevant search service and are not guaranteed by this markup.

The homepage follows a centered dark hero with six quick-link cards and a separate illustrative workflow. The legal pages are available at `/terms/` and `/policy/`; the old `/privacy.html` page redirects to `/policy/`. They describe known product data flows, unit backups, device transfers and payment/domain responsibilities. Drafting was researched against Kenya Law and ODPC primary materials; it is not legal advice or compliance certification. `LEGAL_REVIEW_AND_COMPLIANCE_NOTES.md` records sources and the remaining operator, address, registration, provider and advocate checks. The eTop production adapter is currently disabled pending provider integration.

<!-- / note: Required app acceptance versions must change only with a compatible app/server rollout. -->
The current registration acceptance identifier remains `2026-10-07`. Publishing these pages does not record acceptance by existing users. A future material version change needs versioned documents and compatible app/server support before changing the required identifier.

Support uses `support@myvendora.co.ke` and the owner's approved WhatsApp number. Listing an email address does not create its mailbox; configure a mailbox or verified forwarding separately if needed.
