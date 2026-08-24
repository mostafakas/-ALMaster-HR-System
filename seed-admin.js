/**
 * SECURITY FIX: this script used to contain a real person's real password
 * ("Kastello@99" for mostafa@almaster.com) hardcoded in plaintext, committed
 * to source control. That is a live credential leak — anyone with read
 * access to this repository (or its git history, even after this fix, until
 * the history itself is scrubbed) can read it and log in as that user.
 *
 * ACTION REQUIRED, regardless of this code fix:
 *   1. That password must be changed immediately (it must be treated as
 *      compromised — it was sitting in plaintext in the codebase).
 *   2. If this file was ever pushed to GitHub, the password is in the git
 *      history even after this fix, and it must be scrubbed there too
 *      (git filter-repo / BFG) or — simpler and safer — just treat it as
 *      burned and rotate it.
 *
 * From now on this script takes the email/password/name from environment
 * variables (never committed) instead of literals in the file.
 *
 * Usage:
 *   SEED_ADMIN_EMAIL="someone@almaster.com" \
 *   SEED_ADMIN_PASSWORD="a-new-strong-password" \
 *   SEED_ADMIN_NAME="Full Name" \
 *   node seed-admin.js
 */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  const fullName = process.env.SEED_ADMIN_NAME || 'Admin';

  if (!email || !password) {
    console.error(
      'Missing SEED_ADMIN_EMAIL and/or SEED_ADMIN_PASSWORD environment variables. Aborting — see the comment at the top of this file for usage.'
    );
    process.exit(1);
  }
  if (password.length < 8) {
    console.error('SEED_ADMIN_PASSWORD must be at least 8 characters. Aborting.');
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      fullName,
      role: 'Super Admin',
    },
    create: {
      email,
      password: hashedPassword,
      fullName,
      role: 'Super Admin',
    },
  });
  console.log('User created/updated:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
