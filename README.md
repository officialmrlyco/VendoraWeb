# Vendora public website

Static GitHub Pages site for `myvendora.co.ke`. Publish from `main` at `/`; `CNAME` owns the custom domain. Cloudflare DNS apex records point to GitHub's four documented Pages IPv4 addresses and `www` is a DNS-only CNAME to `officialmrlyco.github.io`.

The app, backend, admin console and merchant secrets remain in the private Vendora repository. This repository contains only public website assets. Run `npm test` for catalog decoding and official release URL boundaries.

The download section reads stable releases from this repository. Publish only a signed Vendora APK after the owner requests a release, without changing the version unless requested. There is currently no APK release. No debug APK is published.

Public package prices are read from `vendora-lyco/vendora_prices`. Failed reads display unavailable messages; website purchase availability follows `online_subs.active`. The website service remains in preparation until provider integration and testing are completed.

Support uses `support@myvendora.co.ke` and the owner's approved WhatsApp number. Listing an email address does not create its mailbox; configure a mailbox or verified forwarding separately if needed.
