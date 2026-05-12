import { headers } from "next/headers";

const hitBuckets = new Map<string, number[]>();

export function getClientIp(): string {
  const h = headers();
  const xf = h.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() ?? "unknown";
  return h.get("x-real-ip") ?? "unknown";
}

export function checkRateLimit(
  bucketKey: string,
  options: { windowMs: number; max: number },
): boolean {
  const { windowMs, max } = options;
  const now = Date.now();
  const bucket = (hitBuckets.get(bucketKey) ?? []).filter(
    (t) => t > now - windowMs,
  );
  if (bucket.length >= max) return false;
  bucket.push(now);
  hitBuckets.set(bucketKey, bucket);
  return true;
}
