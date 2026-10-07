# SMTP diagnostics and configuration

`config/env.js` loads backend/.env by absolute path once, before the database or
mailer reads settings. Existing process/deployment variables retain precedence.
`smtp:verify` reports sources and conflicting keys, never their values. Resolve
conflicts in the shell/hosting environment intentionally; do not force dotenv overrides.
Restart the backend after changes: the transporter captures configuration when loaded.
Dev mode watches .env; restart the dev command once if its watch settings changed.

Current endpoint: POST /api/contact-enquiries. The Gmail test recipient is retained
in ADMIN_EMAIL; production will later use sales@tariustechnology.com. This diagnostic
change does not change recipients, form, attachments, mail content or API responses.

SMTP uses mail.nlptec.com, port 587, secure=false, requireTLS=true and verified TLS
certificates. SMTP_USER remains exactly as configured. SMTP_APP_PASSWORD is passed
unchanged; never print it, put it in frontend variables or commit .env.
MAIL_FROM is unconfirmed: obtain provider/client authorization for that sender.
Changing From does not resolve authentication rejection before sender validation.

From the project root, stop the existing backend and restart:

```powershell
npm --prefix backend start
```

For the existing combined development workflow, stop it and run `npm run dev`.
Run the diagnostic explicitly (no message is sent):

```powershell
npm --prefix backend run smtp:verify
```

There is no automatic verify call at startup or submission. Startup still validates
configuration. Actual submissions use sendMail and preserve their existing safe
error/rollback behavior. Verification confirms connection/TLS/authentication only,
not sender authorization or mailbox delivery. Diagnostics log only sanitized code,
command, responseCode, response and message; debug/protocol tracing remains disabled.

The latest explicit verification loaded all SMTP settings from backend/.env with
no conflicting process overrides. The server returned:

```
EAUTH / AUTH PLAIN / 535
535 5.7.8 Error: authentication failed: authentication failure
```

Authentication is NOT fixed. Ask the provider to confirm the exact SMTP username,
password and SMTP authentication access/account restrictions. Do not guess a
username, weaken TLS, or send repeated test messages. Keep secrets out of support logs.
After provider correction, restart and run smtp:verify again; manually submit an
enquiry only when ready to send real mail to the configured test recipient.

Checks: `npm --prefix backend test` (mocked SMTP/database; no test emails).
