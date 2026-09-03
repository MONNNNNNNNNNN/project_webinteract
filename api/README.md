# api/

Vercel serverless functions. **The directory name is fixed by the platform** —
Vercel finds functions by looking for `api/` at the repository root, so this
cannot be renamed to `backend/`.

Every file directly under `api/` is a public HTTP endpoint. Shared server code
goes in `api/_lib/`; the leading underscore is what tells Vercel it holds
helpers rather than endpoints.

These functions hold every secret in the project. The browser never reaches
Supabase directly — it only ever calls `/api/*`.
