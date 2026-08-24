/**
 * Minimal in-memory rate limiter for the login/register endpoints.
 *
 * LIMITATION: this state lives in the Node process memory, so on a
 * multi-instance/serverless deployment (e.g. multiple Vercel lambdas) each
 * instance has its own counters and the effective limit is
 * (limit x number-of-warm-instances), not a hard global limit. That's still
 * far better than no limiting at all, and is a reasonable default for a
 * single-instance/self-hosted deployment. For a serverless production
 * deployment, replace this with a shared store (Upstash Redis, etc.) behind
 * the same `checkRateLimit()` signature.
 */

interface Bucket {
  count: number;
  firstAttemptAt: number;
}

const buckets = new Map<string, Bucket>();

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 8;

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

/**
 * Returns { limited: false } if the request may proceed, or
 * { limited: true, retryAfterSeconds } if the caller should be rejected.
 * `key` should combine something stable per-caller, e.g. `${ip}:${email}`.
 */
export function checkRateLimit(key: string): { limited: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.firstAttemptAt > WINDOW_MS) {
    buckets.set(key, { count: 1, firstAttemptAt: now });
    return { limited: false };
  }

  if (bucket.count >= MAX_ATTEMPTS) {
    const retryAfterSeconds = Math.ceil((bucket.firstAttemptAt + WINDOW_MS - now) / 1000);
    return { limited: true, retryAfterSeconds };
  }

  bucket.count += 1;
  return { limited: false };
}

/** Call on a successful login so a legitimate user isn't penalized afterwards. */
export function resetRateLimit(key: string) {
  buckets.delete(key);
}

// Periodic cleanup so the Map doesn't grow unbounded on a long-lived process.
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets.entries()) {
      if (now - bucket.firstAttemptAt > WINDOW_MS) buckets.delete(key);
    }
  }, WINDOW_MS).unref?.();
}
