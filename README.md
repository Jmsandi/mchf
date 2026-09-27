# MCHF institutional platform

React / TypeScript, Vite + Vinext, Cloudflare D1 and R2. This retains the Sites hosting integration and uses platform staff sign-in. The hosting manifest declares DB and BUCKET; migrations are applied by Sites before publishing.

## Staff access
Set ADMIN_EMAILS to the confirmed comma-separated staff email allowlist in the Sites runtime environment. No production administrator is created without this allowlist. Sign in at /admin; super administrators can assign roles. Local preview uses the starter's mock account only while import.meta.env.DEV is true.

## Content
The supplied Strategic Plan and Articles are authoritative. Programme/intervention/activity source records are loaded from lib/content.ts and lib/programmes.json, then merged with durable database edits. Staff can draft, review, approve, publish and archive records. Archive original programme records with care. Published changes appear in public collections and detail pages. Missing projects, research, results, news, leaders and partners remain unpublished rather than fabricated.

The presentation summarizes 125 activity statements while stating 129 mapped priority activities; the original stated total is preserved without manufacturing the additional activities. Source material has an inconsistent board term clause ('three (5) years'); no term length is asserted on the website.

## Inquiries and media
Inquiry forms save into D1 for authorized staff review; no email delivery integration is claimed. Uploads are limited to 10 MB, checked by MIME and file signature, stored in R2 with metadata in D1. Publishing metrics requires source, methodology, definition and date. Admin mutations require trusted staff identity, role authorization and same-origin requests. Audit events accompany content and role writes.

## Original documents and photography
Original PPTX and DOCX are downloadable in their supplied formats. HTML strategy and governance pages provide online reading. Photo source, credit, license and context are listed at /image-credits. Contextual photographs do not claim to show MCHF beneficiaries.

## Commands
npm run dev
npm run db:generate
npm run build

## Launch considerations
Confirm official staff emails and contact information, organization registration status, public content approvals and retention policy before opening the private preview to a wider public audience. Online donations have not been added. Independent WCAG and security audits, external database backup operations and email delivery are not claimed by this build.
