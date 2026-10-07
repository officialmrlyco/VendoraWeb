# Vendora public website

- This repository contains only the public marketing/help/download website. The private app, admin panel, customer records and API credentials belong in officialmrlyco/Vendora and Firebase, never here.
- GitHub Pages serves the main branch root at myvendora.co.ke. CNAME binds the domain; www points to officialmrlyco.github.io. No wildcard DNS. Cloudflare holds DNS; the registrar/customer owns renewal.
- Brand: Vendora medium blue #2563EB, black, clean readable mobile/desktop layouts. Keep public copy honest: merchant website checkout is still being prepared while the eTop provider contract is unavailable.
- Download links come only from public stable GitHub releases in officialmrlyco/VendoraWeb. Do not upload a debug APK, fabricate a latest version or bump app versions from this repository. Publishing an APK requires the user's release direction and the private app's signing/build checks.
- Public prices come from public vendora-lyco/vendora_prices documents. Failure to load prices is a visible unavailable state, never a fabricated price. Subscription active false means unavailable for purchase; limit means maximum held months.
- Release descriptions and remote config are untrusted text: use textContent, allowlist GitHub URLs, and validate APK assets. Keep requests bounded and cache public release metadata briefly; no polling.
- Existing published Lyco contact details are the provisional public contact until the owner supplies replacements: info@lycotechnologies.co.ke and WhatsApp +254748008585. Owner administrative login email is private, not a public support address.
- Add comments for changed code blocks, preserve graceful failures and accessibility, and update these notes with deployment/testing evidence. No credentials, private build configuration or merchant/customer data may be committed.
