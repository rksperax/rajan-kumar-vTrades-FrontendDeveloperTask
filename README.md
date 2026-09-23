# vTrades — Frontend Developer Task

Authentication screens built from the provided Figma design: sign in, sign up with
OTP verification, and a multi-step password reset. Accounts are stored in a JSON
file and reached exclusively through API routes, so the flows behave like a real
application rather than a static mockup.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
React Hook Form + Zod · Auth.js (next-auth v5) · sonner

## Running it

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. The root redirects to the sign-in screen.

`npm run build` produces a production build, `npm start` serves it, and
`npm run lint` runs ESLint.

### Signing in

The sign-in form arrives **pre-filled with the seeded account**, so signing in
takes a single click:

| Email | Password |
| --- | --- |
| `navinash@workhive.com` | `12345678` |

Signing up creates a real account that can then be used to sign in, and the reset
flow genuinely changes the stored password.

### Google sign in

Google works out of the box if a `.env.local` is present. Copy the template and
fill it in:

```bash
cp .env.example .env.local
openssl rand -base64 32          # paste the result into AUTH_SECRET
```

Then add a Google OAuth client from the
[Google Cloud console](https://console.cloud.google.com/apis/credentials) with
`http://localhost:3000/api/auth/callback/google` as an authorised redirect URI,
and put its ID and secret in `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET`.

Without those variables the rest of the app still runs; only the Google button
fails.

## Screens

| Route | What it does |
| --- | --- |
| `/` | Landing page for a signed-in user; redirects to sign in otherwise |
| `/auth/signin` | Email + password, remember me, Google / Microsoft buttons |
| `/auth/signup` | Account details, then OTP verification |
| `/auth/forgotpassword` | Email → confirmation dialog → OTP → new password → success dialog |

Any six-digit code is accepted at the OTP steps — nothing is actually emailed.

## How it fits together

```
component → lib/authApi.ts → fetch → /api/account/* → lib/usersDb.ts → src/data/users.json
                                                    → lib/session.ts → session cookie
```

Components never touch the database. They call the typed helpers in
`lib/authApi.ts`, which issue real HTTP requests to the route handlers; only those
handlers read or write `src/data/users.json`. `usersDb.ts` and `session.ts` are
marked `server-only`, so importing them into a client component is a build error
rather than a runtime surprise.

### API routes

| Route | Purpose |
| --- | --- |
| `POST /api/account/signin` | Verifies credentials, opens a session |
| `POST /api/account/signup` | Checks the address is free |
| `POST /api/account/verify-otp` | Accepts the code and writes the new account |
| `POST /api/account/signout` | Clears the session |
| `POST /api/account/forgot-password` | Starts a reset |
| `POST /api/account/forgot-password/verify` | Checks the reset code |
| `POST /api/account/password-create` | Replaces the password |
| `/api/auth/[...nextauth]` | Auth.js — Google OAuth, session, callbacks |

The application's own endpoints live under `/api/account` rather than
`/api/auth`, which belongs entirely to Auth.js. A route file at
`/api/auth/signout` would take precedence over the Auth.js catch-all and
silently break Google sign-out.

Each returns a JSON `message` and a meaningful status: `400` for a malformed or
incomplete body, `401` for bad credentials, `404` for an unknown account, `409`
for a duplicate address.

### Sessions

Two kinds coexist. Google sign-in produces an Auth.js session; the JSON database
produces an `httpOnly` cookie set by the sign-in route. The home page and the
middleware both accept either, and **Remember me** decides whether that cookie
gets a 30-day expiry or is dropped when the browser closes.

### Validation

Every form uses React Hook Form with a Zod schema through `zodResolver`, so the
rules live in one schema per form and the field types are inferred from it.
Messages render beneath the field they belong to; request failures surface as
toasts.

## Project layout

```
src/
├── app/
│   ├── api/account/       route handlers (the only database access)
│   ├── api/auth/          Auth.js catch-all
│   ├── auth/              signin · signup · forgotpassword, with a shared layout
│   ├── layout.tsx         fonts, toaster
│   └── page.tsx           signed-in landing page
├── assets/                images and icons, grouped by format
├── components/
│   ├── auth/              one folder per flow
│   ├── home/
│   └── ui/                Button, Input, Checkbox, Dialog, OtpInput, …
├── data/users.json        the database
├── hooks/                 useForgotPassword — the reset step machine
├── lib/                   authApi, usersDb, session
└── middleware.ts          keeps signed-in users off the auth screens
```

## Known limitations

These are deliberate, and would need real infrastructure to fix properly.

- **A JSON file is not a database.** It works locally, but a serverless host
  gives each instance a read-only project directory, so writes are redirected to
  a temp file that is lost on redeploy. On the deployed site the seeded account
  always works; accounts created there will not outlive the instance.
- **The session cookie is unsigned JSON** and passwords are unsalted SHA-256.
  Enough to demonstrate the flows; a real system needs a signed token and
  bcrypt or argon2.
- **OTP codes are not checked.** There is no mail delivery, so any six-digit
  code passes.
- **Microsoft sign in is not connected.** The button explains this when clicked.
  Wiring it up means an Azure app registration and the `MicrosoftEntraID`
  provider.
- **The demo password appears in the client bundle**, because the sign-in form is
  pre-filled for convenience.
