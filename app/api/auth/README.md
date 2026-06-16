# /api/auth — BetterAuth route handler (Path C)

This catch-all route (`[...all]/route.ts`) is handled by **BetterAuth** using the
**Drizzle adapter** pointed at the Supabase Postgres database.

## Architecture (Path C)

BetterAuth handles all authentication (email/password + social OAuth) while Supabase
Postgres remains as the database via the Drizzle adapter.

- `lib/auth/instance.ts` — Server auth config with Drizzle adapter
- `lib/auth/instance-edge.ts` — Edge-compatible auth for Next.js middleware (JWE cookie, no DB)
- `lib/auth/client.ts` — React client (`authClient`) + client-side auth helpers
- `lib/auth/server.ts` — Server-side auth helpers (`getCurrentUser`, `requireAuth`, etc.)
- `lib/auth/client.ts` — Client-side auth helpers (`signIn`, `signUp`, `signOut`, etc.)
- `lib/auth/context.tsx` — React context using `authClient.useSession()`
- `lib/auth/types.ts` — App-level `User`, `Session`, `UserMetadata` types

## Database tables

BetterAuth manages four tables in the Supabase Postgres database (via Drizzle):

| Table          | Purpose                              |
|----------------|--------------------------------------|
| `user`         | User accounts                        |
| `session`      | Active sessions (token + expiry)     |
| `account`      | OAuth provider accounts per user     |
| `verification` | Email verification tokens            |

Schema definitions are in `lib/db/drizzle-schema.ts` under the `betterAuth*` exports.

## Session strategy

Sessions use **JWE cookies** (encrypted, stateless in the middleware). The Edge
middleware (`proxy.ts`) reads the JWE cookie with `auth-edge.ts` — no DB roundtrip
needed for route protection. Full session data (including DB lookup) is available via
`lib/auth/server.ts` in Server Components and API routes.

## OAuth provider callback URIs

Register the following callback URI pattern in each provider's console:

```
https://<your-domain>/api/auth/callback/<provider>
# e.g. https://<your-domain>/api/auth/callback/google
```

## Environment variables required

```
BETTER_AUTH_SECRET=<min 32 chars random string>
BETTER_AUTH_BASE_URL=https://<your-domain>   # or set VERCEL_URL
ALLOWED_ORIGINS=https://<your-domain>        # required in production

# Social providers (all optional — only enable ones you configure)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
LINKEDIN_CLIENT_ID=...
LINKEDIN_CLIENT_SECRET=...
MICROSOFT_CLIENT_ID=...
MICROSOFT_CLIENT_SECRET=...
DISCORD_CLIENT_ID=...
DISCORD_CLIENT_SECRET=...
FACEBOOK_CLIENT_ID=...
FACEBOOK_CLIENT_SECRET=...
```
