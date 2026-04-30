import { config } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

/**
<<<<<<< HEAD
 * Load environment variables from the first .env file found, probing
 * multiple locations to support two run modes:
 *
 *   Mode A — run from webroot root (cd webroot && pnpm dev):
 *     CWD = webroot/  →  docker/.env  found at  <cwd>/docker/.env
 *
 *   Mode B — run from chat directory (cd webroot/chat && pnpm dev):
 *     CWD = webroot/chat/  →  docker/.env  found at  <cwd>/../docker/.env
 *
 *   Mode C — standalone / no docker setup:
 *     Falls back to  <cwd>/.env  (a local chat/.env file)
 */
export function loadEnvironment() {
  const cwd = process.cwd();

  const candidates = [
    resolve(cwd, '../docker/.env'),  // Mode B: chat/ is cwd
    resolve(cwd, 'docker/.env'),     // Mode A: webroot/ is cwd
    resolve(cwd, '.env'),            // Mode C: standalone fallback
  ];

  for (const envPath of candidates) {
    if (existsSync(envPath)) {
      console.log(`[env-loader] Loading environment from ${envPath}`);
      config({ path: envPath });
      return envPath;
    }
=======
 * Load environment variables from shared docker/.env if available,
 * otherwise fall back to local .env file.
 *
 * This allows the chat application to use centralized configuration
 * when running within the webroot structure.
 */
export function loadEnvironment() {
  // Use process.cwd() to get project root (works in both dev and build)
  const projectRoot = process.cwd();

  // Path to shared docker/.env (relative to project root)
  const dockerEnvPath = resolve(projectRoot, '../webroot/docker/.env');

  // Path to local .env (project root)
  const localEnvPath = resolve(projectRoot, '.env');

  // Try to load from docker/.env first
  if (existsSync(dockerEnvPath)) {
    console.log('[env-loader] Loading environment from shared docker/.env');
    config({ path: dockerEnvPath });
    return dockerEnvPath;
  }

  // Fall back to local .env
  if (existsSync(localEnvPath)) {
    console.log('[env-loader] Loading environment from local .env');
    config({ path: localEnvPath });
    return localEnvPath;
>>>>>>> upstream/main
  }

  console.log('[env-loader] No .env file found, using system environment variables');
  return null;
}

// Auto-load when this module is imported
loadEnvironment();
