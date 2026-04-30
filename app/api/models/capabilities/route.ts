import type { User } from "@supabase/supabase-js";
<<<<<<< HEAD
import { requireAuth } from "@/lib/auth/server";
import { getAdminConfigSummary } from "@/lib/db/queries/admin";
import {
  FALLBACK_ADMIN_CONFIG_SUMMARY,
  FALLBACK_DB_OFFLINE_STATUS,
  FALLBACK_DB_OFFLINE_STATUS_LOCALHOST,
} from "@/lib/ai/fallback-config";
=======
import { createAuthErrorResponse, requireAuth } from "@/lib/auth/server";
import { getAdminConfigSummary } from "@/lib/db/queries/admin";
import { ChatSDKError } from "@/lib/errors";
>>>>>>> upstream/main
import { ErrorCategory, ErrorSeverity, logApiError } from "@/lib/errors/logger";

// GET /api/models/capabilities - Public model capabilities for authenticated users
export async function GET(request: Request) {
<<<<<<< HEAD
  let user: User | undefined;
=======
  let user: User;
>>>>>>> upstream/main

  try {
    const authResult = await requireAuth();
    user = authResult.user;
  } catch (error) {
<<<<<<< HEAD
    // Auth uses Supabase too — if it's unreachable we still want the dropdown
    // populated with fallback models so the user can chat without persistence.
    await logApiError(
      ErrorCategory.UNAUTHORIZED_ACCESS,
      `Model capabilities auth failed (continuing with fallback): ${error instanceof Error ? error.message : "Unknown auth error"}`,
      { request: { method: "GET", url: request.url } },
      ErrorSeverity.WARNING
    );
=======
    await logApiError(
      ErrorCategory.UNAUTHORIZED_ACCESS,
      `Model capabilities GET request authentication failed: ${error instanceof Error ? error.message : "Unknown auth error"}`,
      {
        request: {
          method: "GET",
          url: request.url,
          headers: Object.fromEntries(request.headers.entries()),
        },
      },
      ErrorSeverity.WARNING
    );

    return createAuthErrorResponse(error as Error);
>>>>>>> upstream/main
  }

  try {
    const capabilities = await getAdminConfigSummary();

    return Response.json(
<<<<<<< HEAD
      { capabilities, dbStatus: { ok: true } },
=======
      { capabilities },
>>>>>>> upstream/main
      {
        status: 200,
        headers: {
          "X-API-Version": "1.0",
        },
      }
    );
  } catch (error) {
    await logApiError(
      ErrorCategory.DATABASE_ERROR,
      `Failed to retrieve model capabilities: ${error instanceof Error ? error.message : "Unknown database error"}`,
      {
        request: {
          method: "GET",
          url: request.url,
        },
        user,
      },
      ErrorSeverity.ERROR
    );

<<<<<<< HEAD
    const hostname = new URL(request.url).hostname;
    const isLocalhost =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1";

    return Response.json(
      {
        capabilities: FALLBACK_ADMIN_CONFIG_SUMMARY,
        dbStatus: isLocalhost
          ? FALLBACK_DB_OFFLINE_STATUS_LOCALHOST
          : FALLBACK_DB_OFFLINE_STATUS,
      },
      { status: 200 }
    );
=======
    return new ChatSDKError(
      "bad_request:database",
      "Failed to retrieve model capabilities"
    ).toResponse();
>>>>>>> upstream/main
  }
}
