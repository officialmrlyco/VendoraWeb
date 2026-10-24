# Vendora 1.0.2 (build 2)

Refreshed APK: 24 October 2026. Download and reinstall even if your app already shows 1.0.2. Install over your existing Vendora installation to keep your merchant data. Version 1.0.2, build code 2, package and permanent signing certificate are retained.

## What's new

- Scratch cards have separate Till, PayBill and Number selling/bought rates and allowed-mode switches. Tick whichever receiving modes you want; Home shows when scratch-card delivery is active and displays its rates.
- Quick Dial has separate Airtime and Scratch cards forms. For scratch cards, choose the recipient and one available denomination. It sends exactly one matching card, without asking for an airtime amount or inventing a payment.
- Scratch stock failures show a useful retry message. Failed delivery retries retain the reserved card; alternative card bundles never replace the selected denomination.
- Till-to-Till M-PESA payments now record and queue locally with mobile data and Wi-Fi off, even when Online Website receiving is enabled. Normal Automation, access and execution-number requirements still apply.
- Previously held Till receipts recover locally without waiting for internet. Duplicate receipt protection and Automation Off holds are retained.
- A store-only Till receipt uses its saved client mobile when available. A new store without a mobile appears as **No Execution Number** for recovery in Transaction details; the seven-digit store number is never dialed.
- Transaction details show execution counts and identify retried runs. Counts migrated from older records are marked as estimates when exact dispatch history was unavailable.
- Quick Dial opens directly from Home. Manual airtime keeps its own saved rate; scratch delivery shows the Number scratch-card price as a reference.
- Paste up to 100 scratch card codes, one per line, and review them before saving.
- Copy client names, numbers and transaction details; reveal full transaction evidence when needed.

<!-- / note: Automated evidence belongs to this exact source; it does not imply physical carrier acceptance. -->
All 340 Flutter tests and 203 native tests passed, and source analysis found no issues. The signed APK passed package/version, permanent certificate, non-debuggable, archive integrity, 16 KiB alignment, AndroidX startup constructor and private App Check debug-resource checks. Live handset SMS receipt and carrier execution were not tested for this build. Mobile-wallet and PayBill receipts that may belong to website orders retain their existing online ownership checks.
