#!/usr/bin/env bash
set -euo pipefail
command -v node >/dev/null
command -v npm >/dev/null
command -v pm2 >/dev/null
command -v curl >/dev/null
test -f .env || { echo 'Missing server .env. See docs/deployment.md.'; exit 1; }
node --env-file=.env scripts/check-deploy-env.mjs
npm ci --include=dev
npm run build
pm2 startOrReload ecosystem.config.js --only trien-lam --update-env
healthy=false
for attempt in $(seq 1 20); do
  if curl --fail --silent --max-time 10 http://127.0.0.1:3127/ >/dev/null; then
    healthy=true
    break
  fi
  sleep 3
done
if [ "$healthy" != true ]; then
  echo 'Deployment failed: website did not return HTTP success on port 3127.'
  exit 1
fi
pm2 save
echo 'Deployment completed; website responds on port 3127.'
