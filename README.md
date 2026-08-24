# AlMaster System (HR + CRM + Project Management + Finances)

Next.js 16 / React 19 / TypeScript app with Prisma + PostgreSQL, covering four
dashboard modules: Human Resources, Client Relations Management, Project
Management, and Finances.

**See `FIXES_APPLIED.md` for the full list of security fixes applied in this
version** — read it before deploying, especially the note about the exposed
password that was found in `seed-admin.js`.

## 1. Setup

```bash
cp .env.example .env
```

Edit `.env` and fill in:
- `DATABASE_URL` / `DIRECT_URL` — your PostgreSQL connection strings
- `JWT_SECRET` — generate one with `openssl rand -base64 48`. The app will
  refuse to sign or verify any login token without this set — there is no
  insecure default anymore (see `FIXES_APPLIED.md`, item 4.3).

```bash
npm install
npx prisma migrate dev --name init   # creates the tables, applies schema.prisma
```

## 2. Create your first admin login

There is no public "become admin" button (on purpose — see item 4.4 in
`FIXES_APPLIED.md`, self-registration always creates the lowest-privilege
account). To create the account you'll actually log in with as an
administrator, run the seed script directly with the credentials you want:

```bash
SEED_ADMIN_EMAIL="you@almaster.tech" \
SEED_ADMIN_PASSWORD="choose-a-strong-password-8+chars" \
SEED_ADMIN_NAME="Your Name" \
node seed-admin.js
```

This creates (or updates, if the email already exists) a `User` row with
`role: "Super Admin"`. Run it again any time to reset that account's
password (e.g. if you're rotating the old exposed one — see the note at the
top of `FIXES_APPLIED.md`).

> Note: today `role` is a label stored on the user — a full permissions
> system that actually restricts what each role can see/do inside each
> module isn't built yet (this is called out as a "not yet implemented" item
> in `FIXES_APPLIED.md`, tied to the Roles & Permissions module in Human
> Resources still being UI-only). Any signed-in user can currently reach any
> module. Treat every account you create as trusted until that's built.

## 3. Run it

```bash
npm run build
npm start
# or, for local development:
npm run dev
```

Go to `/login` and sign in with the admin account you just created. You'll
land on the module selector, from which you can enter Human Resources,
Client Relations Management, Project Management, or Finances.

## 4. What's actually wired up vs. still UI-only

See the feature-status table in the earlier audit report
(`ALMaster_HR_System_Analysis_Report.docx`, section 3) and the "لم يُنفَّذ"
section of `FIXES_APPLIED.md` — in short: Employees, Departments, and
Auth are real and backed by the database; Roles, Vacation Balance,
Documents, Live Tracking, and Messages inside the HR module are still
frontend-only and need their own backend work before they persist data.

---

*(Original create-next-app boilerplate below, kept for reference.)*

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
