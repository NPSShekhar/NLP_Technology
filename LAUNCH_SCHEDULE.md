# Scheduled launch

Configure these values in `backend/.env` (Vite reads that directory):

```dotenv
# Example only: 3 PM India time on 7 October 2026
VITE_LAUNCH_AT=2026-10-07T15:00:00+05:30
VITE_LAUNCH_COUNTDOWN_MINUTES=10
```

Use the actual launch date and a timezone offset (`+05:30` for India, `+08:00`
for Malaysia, or `Z` for UTC). Leave `VITE_LAUNCH_AT` blank to display
“Launching soon” indefinitely.

With the example above, `/launching` displays “Launching soon” before 2:50 PM,
then a countdown until 3 PM. At 3 PM, Launch Website becomes available.
Clicking it opens Home with confetti. Refreshing or opening another tab does
not restart the countdown. Timing follows the visitor device clock.

Restart the Vite dev server after editing `.env`. For production, rebuild and
redeploy the frontend after changing these values; they are embedded at build time.

Unit checks: `node --test tests/launch-schedule.test.js` from `frontend`.
Browser checks: run `tests/launch-flow.cjs` with Playwright on NODE_PATH and
LAUNCH_TEST_URL pointing to a running Vite dev server.
