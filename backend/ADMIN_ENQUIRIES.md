# Admin enquiries

The Enquiries tab reads existing website submissions from `contact_enquiries`.
It does not import messages from the admin mailbox. Deleting a record does not
delete an email from that mailbox. Attachments from past submissions were emailed
but not stored in this table; their files remain available in the original email.

Login is now verified by the backend. Configure `ADMIN_USERNAME` and
`ADMIN_PASSWORD` in the backend environment. For existing deployments the backend
also accepts the existing `VITE_ADMIN_USERNAME` / `VITE_ADMIN_PASSWORD` settings.
Move these values to the server-only names and remove the VITE-prefixed versions
before the next production build to keep credentials out of the frontend bundle.
Use HTTPS in production. Authorization is held only in React state, cleared on
logout or refresh, and sent to the protected enquiry endpoints.

Deploy/restart the backend together with the frontend. No database migration is
needed. Public form submissions still use POST `/api/contact-enquiries`.
Authenticated endpoints: POST `/api/contact-enquiries/access`,
GET `/api/contact-enquiries`, DELETE `/api/contact-enquiries/:id`.
