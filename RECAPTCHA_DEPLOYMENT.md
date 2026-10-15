# reCAPTCHA v3 implementation and Plesk deployment

## Scope and existing architecture

Home (`Contactus.jsx`) and Contact (`Contactpage.jsx`) share `useContactEnquiryForm` and submit multipart requests to `POST /api/contact-enquiries`. The old canvas CAPTCHA was entirely client-side; no backend CAPTCHA existed to remove. Its UI, state, validation and handlers have been removed. Other fields, styles and animations are preserved.

Admin Sign In calls `POST /api/contact-enquiries/access`, then keeps Basic authorization in React state for enquiry management. The current backend compares environment credentials using timing-safe SHA-256 digests. This is not a password-storage hash or a server session. There is no existing login rate limiter, brute-force middleware, session expiration or email outbox/retry worker in this checkout. These have not been invented or replaced as part of this change. Existing logout and authentication behavior remain intact. In particular, other protected enquiry routes still use Basic authentication directly: reCAPTCHA on Sign In does not turn them into session-protected routes or prevent credential attempts against those routes. Unrelated content-management APIs are outside this change.

Enquiry creation still validates the payload, starts the existing PostgreSQL transaction, stores file bytes, sends the admin SMTP email, marks it sent, commits, then sends the customer acknowledgement. The existing rollback/error behavior is preserved. No schema or SMTP configuration changes were made.

## Verification behavior

- One official Google script per document, loaded on first valid submission. Its normal badge remains visible; no badge-hiding CSS was added.
- `grecaptcha.ready()` precedes `execute()`. Every submission/retry generates a new token with `enquiry_submit` or `admin_login`; tokens are never cached.
- Script readiness and execution each have a 10-second timeout. After a script-load failure, reload the page before retrying. Existing loading/error UI and synchronous submission locks prevent duplicate submissions.
- Tokens travel in `X-Recaptcha-Token`. Existing CORS middleware reflects requested preflight headers for allowed origins.
- Backend verification runs before Multer for enquiry creation and before credential authentication for Sign In. Only Google's `success === true`, numeric score at/above the configured threshold (and at most 1), exact action, allowlisted hostname, and valid timestamp aged 0–120 seconds pass. Error codes, including `timeout-or-duplicate`, fail closed.
- Google is the authority for single use across processes; each request calls siteverify, including repeated tokens. No successful verification is cached locally.
- Google HTTP, JSON, network and five-second timeout failures deny submission. Missing configuration also denies submission. Tokens and secrets are never logged by the verifier. Rejected requests cannot reach upload handling, the enquiry controller, database writes or email sending.

References: [Google v3 integration](https://developers.google.com/recaptcha/docs/v3), [server verification and single-use tokens](https://developers.google.com/recaptcha/docs/verify).

## Environment setup

Existing `.env` files were not changed. `.gitignore` already excludes `.env` and `.env.*` except `.env.example`. No actual keys were supplied in the prompt; the current backend `.env` does not contain the three reCAPTCHA variables, and no frontend `.env` was found. Configure the already-generated keys privately before release.

Append/merge into `frontend/.env` (or use build environment variables):

```dotenv
VITE_RECAPTCHA_SITE_KEY=YOUR_SITE_KEY
```

Append/merge into `backend/.env`, or configure Plesk's Node.js environment variables:

```dotenv
RECAPTCHA_SECRET_KEY=YOUR_SECRET_KEY
RECAPTCHA_ALLOWED_HOSTNAMES=localhost,YOUR_PRODUCTION_HOSTNAME
RECAPTCHA_MIN_SCORE=0.5
```

Use actual hostname values only, without schemes, ports, paths or wildcards. Include every frontend hostname used, including `www` if applicable. Remove localhost from production when it is unnecessary. Register the same domains for the v3 key in Google's reCAPTCHA administration console. Keep the secret exclusively on the backend, never under a `VITE_` prefix. Plesk process variables take precedence over the backend `.env`. Preserve existing API URL, database and SMTP settings.

## Plesk release procedure — approval required before deployment

1. Back up the deployed frontend `dist`, backend code and private environment configuration. Record the current release revision. No database migration is required for this change.
2. Configure domain registration and environment variables above. Ensure the backend can reach `https://www.google.com/recaptcha/api/siteverify`, and browsers can load Google's reCAPTCHA resources. Keep the standard badge visible. Ensure the proxy passes `X-Recaptcha-Token` and any existing CSP permits the Google script/frame resources.
3. Use a supported Node.js runtime with global fetch (Node 22 or later). From the project root, install the locked dependencies if needed and run `npm run build`. Vite embeds the public site key at build time; changing it requires another build. Never publish the current unconfigured build as a configured release.
4. Deploy the frontend build and changed backend code together in a maintenance window to avoid old clients lacking the token header. Keep existing Plesk document root, startup file (`backend/server.js` in this project), and application settings. Restart the Node.js application through Plesk.
5. Test Home and Contact with and without an attachment, privacy validation, admin login/logout, and rejected requests lacking a token. Confirm successful enquiry storage and both email paths. Confirm rejected requests create no row or email. Exercise mobile/tablet/desktop, observe the real Google badge, inspect action scores in the Google console, and confirm the allowlisted hostname is the frontend hostname.
6. Check application logs and user-facing failures without logging tokens or secrets. Real scores may differ from mocked tests. Use approved monitoring evidence before adjusting the threshold.

Rollback: restore the backed-up frontend and backend together, restore the previous private environment configuration if needed, and restart Node.js in Plesk. No schema rollback is necessary. Rolling back also removes server-side reCAPTCHA protection, so use maintenance mode if abuse is in progress. No deployment has been performed.

## Test report

| Check | Result |
| --- | --- |
| Backend `npm test --prefix backend` | PASS — 15 tests |
| Frontend `node --test frontend/tests/*.test.js` | PASS — 5 tests |
| Root `npm run build` | PASS — existing large-chunk warning remains |
| Browser `node frontend/tests/recaptcha-flow.cjs` with Playwright on NODE_PATH | PASS — Edge, mocked Google and API |
| Home and Contact submission, privacy gate, multipart attachment | PASS — browser mocks; route test also parses a real multipart upload |
| Mobile 375px, tablet 768px, desktop 1440px | PASS — form bounds and old CAPTCHA absence; not a full visual audit |
| Admin Sign In/action/header | PASS — browser and backend route tests |
| Valid/missing/invalid/low score/wrong action/wrong host/expired/future timestamp/duplicate-error/Google timeout | PASS — mocked Google responses |
| Existing database commit/rollback and SMTP flows | PASS — existing controller tests use mocked DB/SMTP |
| `git diff --check` | PASS |
| Full frontend lint | FAIL — 23 existing errors and 1 warning in unrelated/pre-existing code; no unrelated cleanup performed |
| Live Google, PostgreSQL and SMTP end-to-end test | NOT RUN — requires configured keys and deployment/service verification |
| Existing rate limiting/session expiration/outbox integration | NOT APPLICABLE — absent from this checkout |

The backend HTTP tests initially hit sandbox localhost restrictions; rerunning with local network permission passed. Browser tests use a temporary Vite server and public test key in its process environment, and never write real keys or send real emails.

## Modified/added files

- `backend/.env.example`
- `backend/middleware/verifyRecaptcha.js` (new)
- `backend/routes/contactRoutes.js`
- `backend/tests/enquiriesAdmin.test.js` (isolates existing authentication tests from the separately tested reCAPTCHA gate)
- `backend/tests/recaptcha.test.js` (new)
- `frontend/.env.example` (new)
- `frontend/src/Adminpages/AdminLogin.jsx`
- `frontend/src/components/ContactFormFields.jsx`
- `frontend/src/components/sections/Contactus.jsx`
- `frontend/src/lib/contactForm.js`
- `frontend/src/lib/recaptcha.js` (new)
- `frontend/src/pages/Contactpage.jsx`
- `frontend/tests/recaptcha.test.js` (new)
- `frontend/tests/recaptcha-flow.cjs` (new)
- `RECAPTCHA_DEPLOYMENT.md` (new)

The pre-existing user edit to `frontend/src/lib/launch.js` was left untouched.
