#!/bin/sh
set -e

echo "[PT VEA] Syncing database schema with Prisma..."
npx prisma db push --skip-generate || echo "Database push returned non-zero code, continuing startup..."

echo "[PT VEA] Starting Next.js standalone server on port ${PORT:-3302}..."
exec dumb-init node server.js
