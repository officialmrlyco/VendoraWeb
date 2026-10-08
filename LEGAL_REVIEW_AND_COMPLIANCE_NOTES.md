# Vendora legal pages: source notes and owner checklist

**Draft updated:** 8 October 2026  
**Scope:** Public VendoraWeb terms and privacy notice. This is an operational drafting aid, not a Kenyan legal opinion or a representation of compliance certification.

## What the public pages now say

- Vendora is described as operated under LYCO SERVICES, with parent LYCO TECHNOLOGIES. No company type, incorporation status, registration number, postal address, ODPC registration number, or registration exemption is claimed because those details have not been confirmed.
- The product explanation separates on-device SMS/USSD activity and local histories, selected Firebase account/service data, platform subscription payments, and merchant customer orders. It describes up to five merchant profile slots and warns that local histories are not a guaranteed cloud backup. Unit backups are a separate, acknowledged, account-bound balance transfer with fixed redemption expiry and paused remaining Time; normal logout/handover retains the original Time deadline.
- Website checkout and fulfillment are conditional on the actual merchant site and connected provider being ready. The eTop production adapter is identified as disabled; a saved credential is not described as a live integration.
- Merchant Daraja credentials are described as server-only records. Vendora does not request or need an M-PESA PIN.
- The privacy notice describes controller/processor roles according to who determines the purpose, lists data categories and purposes, names known service providers, avoids a claim that data stays in Kenya, and explains rights and complaint routes.
- The public website's current code has no Vendora analytics, cookie storage, advertising tracker, or Turnstile. It requests GitHub release metadata; its separate email-action route uses Firebase Authentication for one-time account links. This section must be updated if the website adds tracking, a challenge, or new SDKs.
- Liability, account restrictions, acceptance, and payment clauses are contractual drafting choices. They cannot remove consumer or data-protection rights created by law, and their enforceability depends on the facts and applicable law.

## Primary Kenyan sources reviewed

1. [Data Protection Act, 2019 (No. 24 of 2019), Kenya Law](https://new.kenyalaw.org/akn/ke/act/2019/24/eng%402022-12-31/source) — sections 25–30 (principles, rights, collection, notice and lawful processing), 32 (consent), 33–38 (children, restriction, automated decisions, objection, direct marketing and portability), 39–43 (retention, rectification/erasure, security and breach notification), and 48–49 (transfers outside Kenya and sensitive data transfers).
2. [Data Protection (General) Regulations, 2021 (Legal Notice 263 of 2021), Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2021/263/eng%402022-12-31/source) — rights-request procedure and erasure exceptions (including regulation 12), direct marketing consent/opt-out (regulations 15–18), and retention schedules (regulation 19).
3. [Data Protection (Registration of Data Controllers and Data Processors) Regulations, 2021, Kenya Law](https://new.kenyalaw.org/akn/ke/act/ln/2021/265/eng%402022-12-31/source) — registration duties and applicable exemptions must be checked against the operator's actual activities and current regulation.
4. [Consumer Protection Act, 2012 (No. 46 of 2012), Kenya Law](https://new.kenyalaw.org/akn/ke/act/2012/46/eng%402022-12-31/publication) — section 31 requires prescribed disclosure before an internet agreement and an express opportunity to accept or decline and correct errors immediately before entry; other consumer rights and remedies remain relevant.
5. [Kenya Information and Communications Act (Cap. 411A), Kenya Law](https://new.kenyalaw.org/akn/ke/act/1998/2/eng%402018-05-30/source) — section 83J recognizes offer and acceptance expressed by electronic messages, subject to other laws requiring a different method. Electronic form does not remove consumer disclosure requirements.
6. [ODPC: Rights of a Data Subject](https://www.odpc.go.ke/rights-of-a-data-subject/) and [ODPC: File a Complaint](https://www.odpc.go.ke/file-a-complaint/) — public guidance and complaint access.

The links above are the sources reviewed for this draft. Confirm the current official consolidated text and commencement/amendment status before relying on a section-specific statement in production legal advice.

## Legal duties to operationalize

These are statutory or potentially statutory responsibilities, not optional service terms. The exact application depends on the operator, data, activity and any exemption.

- Identify the actual controller and processor for each flow and provide required notices before or at collection. Keep the purpose, lawful ground, minimum data, recipients, retention, rights and contact details accurate.
- Confirm whether the operator and relevant merchants must register with the ODPC or qualify for a specific exemption. Do not claim registration or exemption until verified.
- Use an available lawful ground for each purpose. Where consent is relied on, record valid consent and make withdrawal workable. Direct marketing using personal data needs the required prior consent and a simple opt-out; service messages should not be used to disguise marketing.
- Maintain processor contracts/instructions and check provider roles, security and onward transfers. Assess international transfers and required safeguards using actual project/provider configuration; do not promise Kenyan data residency without evidence.
- Adopt and implement a personal-data retention schedule with review points. Maintain a practical process for access, correction, objection, erasure, restriction, portability where applicable, withdrawal and automated-decision rights, including lawful exceptions and identity checks proportionate to risk.
- Maintain reasonable technical and organizational security, access controls, incident records and a breach-response path. Under section 43, a controller notifies the ODPC without delay and within 72 hours where the statutory risk threshold applies, and communicates to affected data subjects within a reasonably practical period, subject to the statutory exceptions. A processor has a separate duty to notify its controller without delay and, where reasonably practicable under the Act, within 48 hours of awareness.
- For online consumer agreements, confirm the transaction flow presents all prescribed information before acceptance, provides an express accept/decline choice and a chance to correct errors immediately before entry, and gives any required confirmation/record. A general terms page does not by itself prove each purchase flow complies.
- Handle children's data only with the safeguards and parent/guardian involvement required by law. Merchants remain responsible for the lawful basis and notices for customer data they control; Vendora's processing instructions and merchant terms should reflect any processor role.

## Owner and counsel checks before publishing this draft

1. Confirm the contracting operator's formal legal name/status and physical/postal service address. The owner identifies the service as operated under LYCO SERVICES, with parent LYCO TECHNOLOGIES, and has confirmed that VENDORA registration is planned but not complete. Do not present Vendora as registered or claim LYCO SERVICES/LYCO TECHNOLOGIES is an incorporated entity unless verified. Keep the missing address as a private owner action until one is confirmed.
2. Determine and document ODPC registration or exemption status, including whether the operator's business activities, scale or processing make registration mandatory. Add only a verified registration detail.
3. Confirm all current account/profile limits, backup behavior, local/cloud record paths, timestamp presentation, SMS permissions and server data categories against the release being offered to the public.
4. Identify Firebase/Google, GitHub, Cloudflare, Safaricom/Daraja and any other actual data recipients, regions, subprocessors, transfer safeguards and contracts. Verify Cloudflare proxying versus DNS-only use for each domain.
5. Approve a real retention schedule for local records, Firebase collections, audit/payment records, support messages, backups and provider copies; implement request routing, deletion/correction behavior and any required customer-facing response periods. The policy deliberately gives no unverified deletion guarantee.
6. Confirm the merchant-facing data-processing terms, allocation of controller/processor duties, instructions, support escalation, breach notification and deletion/return on termination. A public privacy notice is not a substitute for the merchant contract.
7. Test what transaction disclosures and consumer controls are actually shown before platform subscription/payment acceptance and before any future merchant checkout: fees, recipient/payer roles, cancellation/refund route, correctable details, confirmation, and how uncertain or failed payments are reconciled. Update the terms only from that verified flow.
8. Have a Kenyan advocate review the limitation clause, suspension grounds, renewal/domain clauses, electronic acceptance, refund language, consumer-law fit, governing law and the privacy grounds/rights summary before treating the pages as final legal terms.
9. Ensure support@myvendora.co.ke is monitored for privacy requests, rights requests, ODPC correspondence and breach escalation. Keep the ODPC complaint path accessible and do not require users to contact support before complaining externally.
10. Update the policy and this checklist whenever cookies, Turnstile, analytics, marketing, SDKs, payment providers, eTop, hosting regions, or other material data flows change.
11. The current Android/server registration contract uses the fixed acceptance identifier `2026-10-07` and the canonical policy URLs. This publication does not manufacture reacceptance by existing users or change that identifier in an old APK. For a future material contract revision, introduce versioned document snapshots and an app/backend compatibility plan before changing the required identifier; the current app rejects unfamiliar server versions. Do not deploy a new required version ahead of compatible app support.

## Decisions that are terms, not statutory findings

- The 12-month paid-feature cap and KES 5,000 cap for uncharged features are proposed contract limits, with carve-outs for non-excludable duties and liability. Counsel must assess whether these are proportionate and enforceable for each user/transaction type.
- The ability to restrict service for defined security, legal, fraud, provider or payment reasons is a proposed contract term. Apply it fairly, give reasons/review where practicable, and preserve statutory remedies.
- Kenya governing law is a proposed choice-of-law clause; it does not exclude a competent regulator, mandatory law or court jurisdiction.
- No general refund, service-level, fixed retention, or universal deletion promise is made. Applicable statutory rights and a specific purchase's disclosed terms still govern.
