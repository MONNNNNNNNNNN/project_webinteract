#!/usr/bin/env bash
# API-level tests. Every external call (Supabase, Gemini, JSearch) is stubbed
# inside the test files, so this needs no network, no database and no API keys.
#
#   bash tests/run-api.sh      (or: npm test)
set -u
cd "$(dirname "$0")/.."

FAIL=0
run() {
  local title=$1; shift
  echo
  echo "=== $title"
  if ! env -u VERCEL_ENV -u ADMIN_EMAILS "$@"; then FAIL=1; fi
}

# Unanswered questions -> FAQ, with the Gemini draft guardrails.
run "unanswered -> FAQ (no Supabase configured)" \
  SUPABASE_URL= SUPABASE_ANON_KEY= SUPABASE_SERVICE_ROLE_KEY= GEMINI_API_KEY=fake \
  node tests/api/unanswered-to-faq.mjs nosb
run "unanswered -> FAQ (retrieval feeds the draft)" \
  SUPABASE_URL=https://fake.supabase.co SUPABASE_ANON_KEY=anon SUPABASE_SERVICE_ROLE_KEY=svc GEMINI_API_KEY=fake \
  node tests/api/unanswered-to-faq.mjs sb

# The chatbot's knowledge rebuilding itself after an admin save.
run "auto-rebuild (with Supabase)" \
  SUPABASE_URL=https://fake.supabase.co SUPABASE_ANON_KEY=anon SUPABASE_SERVICE_ROLE_KEY=svc \
  node tests/api/auto-rebuild-kb.mjs sb
run "auto-rebuild (simulated store)" \
  SUPABASE_URL= SUPABASE_ANON_KEY= SUPABASE_SERVICE_ROLE_KEY= \
  node tests/api/auto-rebuild-kb.mjs nosb

# Job listings: duplicate postings from JSearch collapse to one card.
run "careers de-duplication" \
  SUPABASE_URL=https://fake.supabase.co SUPABASE_ANON_KEY=anon SUPABASE_SERVICE_ROLE_KEY=svc JSEARCH_API_KEY= \
  node tests/api/careers-dedupe.mjs

echo
if [ "$FAIL" = 0 ]; then echo "all API tests passed"; else echo "SOME TESTS FAILED"; fi
exit $FAIL
