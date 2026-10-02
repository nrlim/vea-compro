#!/bin/sh
set -e

echo "Deploying database migrations..."
npm run prisma:deploy

echo "Starting Next.js..."
exec dumb-init node server.js
