#!/usr/bin/env bash
# Checks that the Forge API the frontend points at is up.
# Local development only: nothing in the build depends on this script.
#
# The address comes from NEXT_PUBLIC_API_BASE_URL, then .env.local, then
# http://localhost:8000.

set -uo pipefail

url="${NEXT_PUBLIC_API_BASE_URL:-}"
if [ -z "$url" ] && [ -f .env.local ]; then
  url="$(sed -n 's/^NEXT_PUBLIC_API_BASE_URL=//p' .env.local | tail -n 1 | tr -d '"'"'"' \r')"
fi
url="${url:-http://localhost:8000}"
url="${url%/}"

if body="$(curl -fsS --max-time 5 "$url/health" 2>&1)"; then
  echo "API is up at $url"
  echo "  /health: $body"
else
  echo "API is not reachable at $url"
  echo "  $body"
  if [[ "$url" == http://localhost* || "$url" == http://127.0.0.1* ]]; then
    echo "Start it with:"
    echo "  cd ~/forge-api && docker compose up -d db && source .venv/bin/activate && uvicorn forge.main:app --reload"
  fi
  exit 1
fi
