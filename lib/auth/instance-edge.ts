import { betterAuth } from "better-auth";

function requireSecret(): string {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) throw new Error("BETTER_AUTH_SECRET is required");
  return secret;
}

// Minimal auth instance for Edge middleware — no database adapter.
// Sessions are validated from the JWE cookie using the shared secret,
// so no DB roundtrip is needed for middleware auth checks.
export const auth = betterAuth({
  basePath: "/api/auth",
  baseURL: process.env.BETTER_AUTH_BASE_URL
    ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3700"),
  secret: requireSecret(),
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 7 * 24 * 60 * 60,
      strategy: "jwe",
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    cookieSameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    defaultCookieAttributes: {
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      path: "/",
    },
  },
});
