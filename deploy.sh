#!/bin/bash
set -euo pipefail

echo "🚀 Deploying vea-compro Docker container"

if [ ! -f .env.production ]; then
  echo "❌ .env.production not found"
  exit 1
fi

mkdir -p public/uploads
chmod 775 public/uploads

git fetch origin
git pull origin main

docker compose up --build -d --remove-orphans
docker compose ps
docker compose logs --tail=80 web

echo "✅ vea-compro is running on 127.0.0.1:3302 behind LIM-WAF"
