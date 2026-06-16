/**
 * Supabase Client Utilities
 *
 * This file provides Supabase client instances for database access only.
 * Auth is now handled by BetterAuth (see lib/auth/instance.ts and lib/auth/server.ts).
 *
 * - createClient: Browser client for client-side DB queries
 * - createServerComponentClient: Server client with cookies for SSR DB queries
 * - createAdminClient: Service-role client for admin DB operations
 */

import { createBrowserClient, createServerClient } from "@supabase/ssr";

// Get environment variables (will be validated when functions are called)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Helper to validate environment variables at runtime
function validateEnvVars() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Missing Supabase environment variables. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }
}

/**
 * Browser Client
 * Use this in Client Components for database queries (not auth).
 *
 * @example
 * 'use client'
 * import { createClient } from '@/lib/db/supabase-client'
 *
 * export function MyComponent() {
 *   const supabase = createClient()
 *   // ... use supabase for DB queries
 * }
 */
export function createClient() {
  validateEnvVars();
  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
}

/**
 * Server Client (with cookies)
 * Use this in Server Components, Server Actions, and Route Handlers for DB queries.
 *
 * @example
 * import { createServerComponentClient } from '@/lib/db/supabase-client'
 *
 * export async function MyServerComponent() {
 *   const supabase = await createServerComponentClient()
 *   const { data, error } = await supabase.from('chat').select()
 *   // ...
 * }
 */
export async function createServerComponentClient() {
  validateEnvVars();
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(
        cookiesToSet: Array<{ name: string; value: string; options?: any }>
      ) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
}

/**
 * Server Admin Client (with service role key)
 * Use this for admin DB operations that bypass RLS.
 * ⚠️ WARNING: This client has full database access. Use with caution!
 *
 * @example
 * import { createAdminClient } from '@/lib/db/supabase-client'
 *
 * export async function deleteUserData(userId: string) {
 *   const supabase = createAdminClient()
 *   // This bypasses RLS
 *   await supabase.from('chat').delete().eq('user_id', userId)
 * }
 */
export function createAdminClient() {
  validateEnvVars();
  if (!supabaseServiceKey) {
    throw new Error(
      "Missing SUPABASE_SERVICE_ROLE_KEY. This is required for admin operations."
    );
  }

  return createBrowserClient(supabaseUrl!, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
