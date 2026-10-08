export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export const RATE_LIMIT_RULES: Record<string, RateLimitConfig> = {
  auth_login: { maxRequests: 5, windowMs: 15 * 60 * 1000 },       // 5 per 15 mins
  auth_register: { maxRequests: 3, windowMs: 60 * 60 * 1000 },    // 3 per hour
  chat_message: { maxRequests: 30, windowMs: 60 * 1000 },         // 30 per min
  create_listing: { maxRequests: 10, windowMs: 60 * 60 * 1000 },   // 10 per hour
  submit_offer: { maxRequests: 15, windowMs: 60 * 60 * 1000 },     // 15 per hour
  submit_report: { maxRequests: 5, windowMs: 60 * 60 * 1000 },     // 5 per hour
};

interface WindowRecord {
  timestamps: number[];
}

const memoryStore = new Map<string, WindowRecord>();

export function checkRateLimit(
  key: string,
  action: keyof typeof RATE_LIMIT_RULES
): { allowed: boolean; remaining: number; resetMs: number } {
  const config = RATE_LIMIT_RULES[action];
  if (!config) {
    return { allowed: true, remaining: 999, resetMs: 0 };
  }

  const now = Date.now();
  const storeKey = `${action}:${key}`;
  const record = memoryStore.get(storeKey) || { timestamps: [] };

  // Filter timestamps within current sliding window
  const windowStart = now - config.windowMs;
  const validTimestamps = record.timestamps.filter((ts) => ts > windowStart);

  if (validTimestamps.length >= config.maxRequests) {
    const oldestTimestamp = validTimestamps[0];
    const resetMs = oldestTimestamp + config.windowMs - now;
    return {
      allowed: false,
      remaining: 0,
      resetMs: Math.max(resetMs, 0),
    };
  }

  validTimestamps.push(now);
  memoryStore.set(storeKey, { timestamps: validTimestamps });

  return {
    allowed: true,
    remaining: config.maxRequests - validTimestamps.length,
    resetMs: config.windowMs,
  };
}

export function clearRateLimitStore() {
  memoryStore.clear();
}
