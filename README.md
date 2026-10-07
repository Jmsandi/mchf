# MCHF institutional platform

A React / TypeScript website with Next.js for Vercel deployment and a separate Vinext / Cloudflare preview. The staff dashboard at `/admin` supports Supabase Auth, PostgreSQL and private Supabase Storage. The existing D1/R2 implementation remains available for the Cloudflare preview.

## Deploy on Vercel

Import this repository with its root as the project root. The checked-in `vercel.json` selects **Next.js**, builds with `npm run build`, and uses the `.next` output directory. Node.js is pinned to the supported `24.x` major version. A successful build creates `.next/routes-manifest.json`, which Vercel needs to deploy the application.

Set the Supabase variables below in the Vercel project's **Environment Variables**, then redeploy. Without a Supabase connection, public pages show the repository's baseline content, while staff publishing and persistent analytics remain unavailable. The local preview's mock identity cannot sign into the Vercel dashboard.

Set `SITE_URL` to the final public domain if needed. Otherwise the site's metadata, sitemap and robots file use Vercel's production domain automatically. For a local production check, run `npm run build` followed by `npm start`.

Official documentation: [Vercel builds](https://vercel.com/docs/builds), [Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions), and [system environment variables](https://vercel.com/docs/environment-variables/system-environment-variables).

## Dashboard

- **Website pages:** edit page introductions, featured images and additional content; manage each destination and the five programme pages.
- **Content library:** draft, review, approve, schedule, publish and archive news, projects, research, events, stories, vacancies, documents, board profiles and verified results.
- **Daily Insights:** publish educational updates at `/insights`, with optional home-page placement and a future publication time.
- **Media:** upload JPG, PNG, WebP, PDF, DOCX or PPTX files, attach them to content, and supply image descriptions. Uploads have a 10 MB limit and MIME/file-signature validation. Unpublished uploads require staff access.
- **Inquiries:** review and resolve website submissions. The inbox stores submissions; it does not send notification emails.
- **Audience:** view 7, 30 or 90 days of daily visitors, page views, popular pages, referral domains, devices, countries and visible-page engagement.
- **Team and activity:** assign publishing roles and review audit entries. Only super administrators can change team access.

Published records appear on the matching public pages. Programme-linked projects, evidence and verified results also appear in the programme's related sections. Scheduled records stay private until their publication time. Times use UTC, matching Sierra Leone time.

## Connect Supabase

1. Select the intended Supabase project. This repository does not contain project credentials.
2. Apply [`supabase/migrations/202610010001_mchf_platform.sql`](supabase/migrations/202610010001_mchf_platform.sql) once, using the Supabase SQL Editor or migration tooling. It creates the `mchf_*` tables, access policies, reporting functions and private `mchf-media` storage bucket.
3. Set the following **server runtime** variables. For native Next.js development, copy `.env.example` to the ignored `.env.local` file and run `npm run dev:next`. For the Cloudflare preview, use `.dev.vars` and `npm run dev`. For Vercel, set them in the project's Environment Variables; for Cloudflare hosting, use the worker's runtime environment and secret settings.

```dotenv
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
SUPABASE_SECRET_KEY=YOUR_SERVER_SECRET_KEY
ADMIN_EMAILS=info@mchf.org
ANALYTICS_SECRET=YOUR_RANDOM_SECRET
```

The server secret must never be put in a browser variable, committed to Git or pasted into public content. The application uses the verified signed-in user and database policies for staff requests. Server access handles the initial import, visitor ingestion and private file delivery.

4. Create an email/password user for **info@mchf.org** in Supabase Authentication, with a password chosen by the administrator. An administrator must create staff authentication accounts; the website does not offer public sign-up.
5. Open `/admin` and sign in. The configured administrator email receives the first super-administrator role after verified authentication. The dashboard imports the existing website records without overwriting records already in Supabase.
6. Create other staff accounts in Supabase Authentication, then assign their roles under **Team access**. Authors submit drafts; editors work within their portfolios; reviewers approve; administrators publish and archive.

Official documentation: [Supabase server-side authentication](https://supabase.com/docs/guides/auth/server-side), [row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security), and [storage access control](https://supabase.com/docs/guides/storage/security/access-control).

## Local development

```sh
npm install
npm run dev
```

Without Supabase variables, the Cloudflare development preview uses D1/R2 and the starter's mock staff identity. This preview identity is enabled only in Cloudflare development. Saved preview content and analytics do not transfer into Supabase automatically. The first real administrator sign-in imports the repository's baseline content. Native Next.js always requires Supabase for staff access.

When using local D1 for the first time, build and apply the checked-in SQLite migrations to the local database:

```sh
npm run build:cloudflare
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 migrations apply DB --local --config dist/server/wrangler.json --persist-to .wrangler/state
```

## Analytics definitions

Daily visitors are estimates from a server-keyed hash of IP address and browser agent. The identifier changes each UTC day. Raw IP addresses, names, emails, cookies and URL query strings are not stored by this tracker. Returning visitors on different days count again, so the period visitor total is a sum of daily visitors, not a count of distinct people across the whole period. Shared networks and similar browsers can affect estimates.

The tracker excludes `/admin`, API and authentication routes, ignores common bots, and respects Do Not Track and Global Privacy Control. Country comes from the hosting request's country code; it is unknown when that information is unavailable. Engagement counts time while the page is visible, capped at two hours per view. Active visitors are those seen within the last five minutes. Events are retained for 90 days and older rows are pruned on subsequent visits. This is website traffic reporting, not registered-user tracking.

## Source content

The supplied Strategic Plan and Articles inform the baseline programme content. The presentation summarizes 125 activity statements while stating 129 mapped priority activities; the original stated total is preserved without inventing additional activities. No interpretation of the inconsistent board term clause is asserted. Board portraits and biographies come from the supplied board document.

Missing operational news, research, projects, results and vacancies remain empty until staff publish them. Educational material and contextual photography are identified separately from verified MCHF results. Publishing a result requires its evidence source, definition, methodology and date.

The October 2026 website review supplies the updated programme imagery, corrects the chairperson to Mariama Haja Turay and the treasurer to Johnnet Sesay, and adds the five board portfolio descriptions. Existing profile URLs redirect to the corrected names. The original record IDs are retained so imported profiles are not duplicated. Superseded baseline fields in saved records receive the review corrections while custom staff edits and publication status remain intact.

Original source DOCX/PPTX files remain local and ignored by Git, following the code-only publication scope. Public document links require their corresponding approved assets in the hosting environment.

## Verification

```sh
npx tsc --noEmit
npm test
npm run build
```

The tests apply the actual Supabase migration to an isolated PostgreSQL-compatible test database. They verify public/draft access, role restrictions, audit protection, publication evidence, media privacy, analytics access and rate limits. Hosting tests cover visitor headers and same-origin submission checks. They do not connect to a production Supabase project.
