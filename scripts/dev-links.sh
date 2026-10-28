#!/usr/bin/env bash
# Prints the newest invitation and password reset links from the local Forge
# database, so you can test activation and reset without real emails.
# Local development only: nothing in the build depends on this script.
#
# Usage: npm run dev:links [-- email]
#   email  Optional. Only look up the newest invitation for this address.
#
# Environment (defaults match ~/forge-api/compose.yaml):
#   FORGE_DB_CONTAINER  forge-api-db-1
#   FORGE_DB_NAME       forge
#   FORGE_DB_USER       forge
#   FRONTEND_URL        http://localhost:3000

set -euo pipefail

container="${FORGE_DB_CONTAINER:-forge-api-db-1}"
db_name="${FORGE_DB_NAME:-forge}"
db_user="${FORGE_DB_USER:-forge}"
frontend_url="${FRONTEND_URL:-http://localhost:3000}"
frontend_url="${frontend_url%/}"
email="${1:-}"

if ! command -v docker >/dev/null 2>&1; then
  echo "docker is not installed or not on PATH." >&2
  exit 1
fi

running="$(docker inspect -f '{{.State.Running}}' "$container" 2>/dev/null || true)"
if [ "$running" != "true" ]; then
  echo "The database container '$container' is not running." >&2
  echo "Start it with: cd ~/forge-api && docker compose up -d db" >&2
  exit 1
fi

query() {
  docker exec "$container" psql -U "$db_user" -d "$db_name" -At -F ' ' -c "$1"
}

if [ -n "$email" ]; then
  # Escape single quotes for the SQL string literal
  safe_email="${email//\'/\'\'}"
  invite_filter="WHERE lower(email) = lower('$safe_email')"
else
  invite_filter=""
fi

invite="$(query "SELECT email, token FROM invitations $invite_filter ORDER BY created_at DESC LIMIT 1")"
reset="$(query "SELECT u.email, t.token FROM password_reset_tokens t JOIN users u ON u.id = t.user_id ORDER BY t.created_at DESC LIMIT 1")"

echo "Newest invitation${email:+ for $email}:"
if [ -n "$invite" ]; then
  read -r invite_email invite_token <<<"$invite"
  echo "  $invite_email"
  echo "  $frontend_url/activate?token=$invite_token"
else
  echo "  none found"
fi

echo
echo "Newest password reset:"
if [ -n "$reset" ]; then
  read -r reset_email reset_token <<<"$reset"
  echo "  $reset_email"
  echo "  $frontend_url/reset-password?token=$reset_token"
else
  echo "  none found"
fi
