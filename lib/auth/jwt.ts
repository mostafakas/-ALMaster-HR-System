import jwt from "jsonwebtoken";

/**
 * SECURITY FIX (was: hardcoded fallback "almaster-super-secret-key-2026"
 * committed to the repo — anyone with the source could forge valid tokens).
 *
 * JWT_SECRET must now come from the environment. We read it lazily (inside
 * the functions, not at module load) so that `next build` doesn't crash in
 * environments that don't need to sign/verify tokens at build time — but any
 * actual login/register/verify attempt without a configured secret fails
 * loudly instead of silently using an insecure default.
 *
 * Set JWT_SECRET in your .env (see .env.example) — generate one with:
 *   openssl rand -base64 48
 */
function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim().length === 0) {
    throw new Error(
      "JWT_SECRET is not set. Add it to your environment (.env) before signing or verifying tokens. See .env.example."
    );
  }
  return secret;
}

export function signToken(payload: object, expiresIn: any = "7d") {
  return jwt.sign(payload, getSecret(), { expiresIn });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, getSecret());
  } catch (error) {
    return null;
  }
}
