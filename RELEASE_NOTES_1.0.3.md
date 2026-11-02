# Vendora 1.0.3 (build 3)

Vendora 1.0.3 adds transaction response history and improves website order delivery updates and rejected-result recovery. Install the signed update over your existing Vendora installation; do not clear app data. This is version 1.0.3, build code 3, package `com.vendora.lyco.airtime`. The APK is 99,415,531 bytes with SHA-256 `fa97752e018097eba0ca54c6d3477efd3fedae339178ef3bc2c9632251392d32` and the established permanent signing certificate.

## What's new

- Transaction details can show saved carrier prompts and per-run results across retries. History is stored locally, remains separate from the current status preview, and loads in bounded pages when opened.
- Website orders can receive a faster update after the phone records a terminal delivery result. The browser can wait briefly for a real order status change instead of repeatedly polling at fixed intervals. Pending and partial-delivery states remain distinct; a payment confirmation alone does not claim delivery.
- Rejected result reports remain saved for recovery and use a durable cooldown before another unchanged upload. A changed result or authenticated session can be sent without waiting for the old cooldown. Server acceptance checks remain in force.
- Scratch-card inventory tools include reviewed multi-code imports, safer stock deletion, and clearer Quick Dial selection. Reserved cards stay protected, and a failed delivery retry keeps its selected card.
- Existing scratch-card Till, PayBill and Number settings, the separate Scratch cards Quick Dial form, and offline Till receipt recovery remain available.

## Verification

The source verification recorded for this release passed 230 native tests, 484 backend tests and 128 storefront tests. The signed artifact passed signature and alignment checks, Room and new worker constructor checks, private debug token/resource absence checks, and DEX checks for response history and cooldown behavior. The Dart history label was checked across all three architectures. No physical handset, live payment or carrier delivery acceptance is claimed here.

<!-- / note: Keep APK identity and measured artifact metadata here synchronized with the verified release asset. -->
