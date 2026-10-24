# Vendora 1.0.2 (build 2)

Refreshed APK: 24 October 2026. Download and reinstall even if your app already shows 1.0.2. Install over your existing Vendora installation to keep your merchant data. Version 1.0.2, build code 2, package and permanent signing certificate are retained.

## What's new

- Till-to-Till M-PESA payments now record and queue locally with mobile data and Wi-Fi off, even when Online Website receiving is enabled. Normal Automation, access and execution-number requirements still apply.
- Previously held Till receipts recover locally without waiting for internet. Duplicate receipt protection and Automation Off holds are retained.
- A store-only Till receipt uses its saved client mobile when available. A new store without a mobile appears as **No Execution Number** for recovery in Transaction details; the seven-digit store number is never dialed.
- Transaction details show execution counts and identify retried runs. Counts migrated from older records are marked as estimates when exact dispatch history was unavailable.
- Quick Dial opens directly from the home screen and requires its own saved rate before the first manual run.
- Paste up to 100 scratch card codes, one per line, and review them before saving.
- Copy client names, numbers and transaction details; reveal full transaction evidence when needed.

All 196 native tests passed, with the final 27 database checks repeated after the last account-switch assertion. The signed APK passed package/version, permanent certificate, non-debuggable, archive integrity, 16 KiB alignment, AndroidX startup constructor and private App Check debug-resource checks. The offline repair code was also verified in the APK's DEX. Live handset SMS receipt and carrier execution were not tested for this build. Mobile-wallet and PayBill receipts that may belong to website orders retain their existing online ownership checks.
