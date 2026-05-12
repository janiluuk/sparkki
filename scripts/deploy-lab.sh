#!/usr/bin/env bash
# Backwards-compatible wrapper — use scripts/lab-stack-up.sh
exec "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/lab-stack-up.sh" "$@"
