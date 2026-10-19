# Vendora 1.0.2 (build 2)

Install the signed APK over your existing Vendora installation to keep your merchant data. This release uses the same package and permanent signing certificate as 1.0.1.

## What's new

- Store-only M-PESA Till messages now appear in Transactions as **No Execution Number** instead of remaining hidden in the online-order pending queue. Enter the customer's mobile number in Transaction details before executing; the seven-digit store number is never used for dialing.
- Transaction details show execution counts and identify retried runs. Counts migrated from older records are marked as estimates when exact dispatch history was unavailable.
- Quick Dial opens directly from the home screen and requires its own saved rate before the first manual run.
- Paste up to 100 scratch card codes, one per line, and review them before saving.
- Copy client names, numbers and transaction details; reveal full transaction evidence when needed.

The signed APK was checked for package/version identity, permanent signing certificate, non-debuggable status, archive integrity, 16 KiB alignment, AndroidX startup constructor and absence of the private App Check debug resource. Automated source tests passed. Live handset SMS receipt and carrier execution were not tested for this build.
