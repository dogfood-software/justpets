#!/usr/bin/env bash
#
# local-ssh.sh (macOS)
#
# 1. Starts the docker compose stack
# 2. Waits for the router and triggers Caddy's local CA generation
# 3. Extracts the root CA cert from the container
# 4. Installs it into the macOS System keychain (skipped if already trusted)
# 5. Optionally restarts Chrome so it picks up the new trust
#
# Usage:
#   ./local-ssh.sh
#
# Optional env vars:
#   CONTAINER_NAME (default: justpets-router)
#   SITE_HOST      (default: justpets.localhost)
#   COMPOSE_FILE   (default: <script dir>/dev/compose.yml)

set -euo pipefail

CONTAINER_NAME="${CONTAINER_NAME:-justpets-router}"
SITE_HOST="${SITE_HOST:-justpets.localhost}"
SITE_URL="https://${SITE_HOST}"
CERT_PATH_IN_CONTAINER="/caddy/data/caddy/pki/authorities/local/root.crt"
KEYCHAIN="/Library/Keychains/System.keychain"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPOSE_FILE="${COMPOSE_FILE:-${SCRIPT_DIR}/../compose.yml}"
OUTPUT_CERT="${SCRIPT_DIR}/caddy-local-root.crt"

if [[ "$(uname -s)" != "Darwin" ]]; then
  echo "ERROR: This script currently only supports macOS."
  exit 1
fi

echo "==> Starting docker compose stack..."
docker compose -f "$COMPOSE_FILE" up -d

echo "==> Waiting for '$CONTAINER_NAME' to be running..."
for i in $(seq 1 30); do
  if [[ "$(docker inspect -f '{{.State.Running}}' "$CONTAINER_NAME" 2>/dev/null || echo false)" == "true" ]]; then
    break
  fi
  if [[ "$i" -eq 30 ]]; then
    echo "ERROR: Container '$CONTAINER_NAME' did not start in time."
    exit 1
  fi
  sleep 1
done

echo "==> Hitting $SITE_URL to trigger Caddy cert generation..."
for i in $(seq 1 15); do
  # --resolve avoids macOS resolver quirks with *.localhost
  if curl -k -s -o /dev/null --resolve "${SITE_HOST}:443:127.0.0.1" "$SITE_URL"; then
    echo "Site responded."
    break
  fi
  if [[ "$i" -eq 15 ]]; then
    echo "WARNING: Could not reach $SITE_URL after 15 attempts. Continuing anyway."
  fi
  sleep 1
done

echo "==> Copying root CA cert out of container..."
ATTEMPTS=0
until docker cp "${CONTAINER_NAME}:${CERT_PATH_IN_CONTAINER}" "$OUTPUT_CERT" 2>/dev/null; do
  ATTEMPTS=$((ATTEMPTS + 1))
  if [[ "$ATTEMPTS" -ge 5 ]]; then
    echo "ERROR: Could not find $CERT_PATH_IN_CONTAINER in '$CONTAINER_NAME' after several tries."
    echo "Check that your Caddyfile has 'local_certs' set and that XDG_DATA_HOME is /caddy/data."
    exit 1
  fi
  echo "Cert not ready yet, retrying in 2s..."
  sleep 2
done
echo "==> Cert copied to $OUTPUT_CERT"

# Only install if this exact cert isn't already in the System keychain
FINGERPRINT="$(openssl x509 -in "$OUTPUT_CERT" -noout -fingerprint -sha1 | cut -d= -f2 | tr -d ':')"
NEWLY_INSTALLED=false

if security find-certificate -a -Z "$KEYCHAIN" 2>/dev/null | grep -q "$FINGERPRINT"; then
  echo "==> Cert already in System keychain, skipping install."
else
  echo "==> Installing cert into System keychain (requires sudo)..."
  sudo security add-trusted-cert -d -r trustRoot -k "$KEYCHAIN" "$OUTPUT_CERT"
  NEWLY_INSTALLED=true
fi

# Chrome caches trust decisions, so restart it after a new install
if [[ "$NEWLY_INSTALLED" == "true" ]] && pgrep -x "Google Chrome" >/dev/null; then
  read -r -p "==> Restart Chrome now to pick up the new trust? [y/N] " ANSWER
  if [[ "$ANSWER" =~ ^[Yy]$ ]]; then
    osascript -e 'quit app "Google Chrome"'
    while pgrep -x "Google Chrome" >/dev/null; do sleep 0.5; done
    open -a "Google Chrome"
    echo "    Chrome restarted. Use Cmd+Shift+T if your tabs didn't come back."
  fi
fi

echo ""
echo "==> Done. Site is at $SITE_URL"
echo "    Firefox doesn't use the macOS trust store by default. Either import"
echo "    $OUTPUT_CERT via about:preferences#privacy, or set"
echo "    security.enterprise_roots.enabled = true in about:config."