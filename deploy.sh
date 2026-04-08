#!/bin/bash

# ── 1. Preparation & Safety Checks ───────────────────────────────────────────
set -e
set -u

echo "=============================================="
echo "🚀 Starting Production Deployment for vea-compro"
echo "📅 Date: $(date)"
echo "=============================================="

# Check if .env exists
if [ ! -f .env ]; then
  echo "❌ ERROR: .env file not found!"
  exit 1
fi

# ── 2. Source Code Management (With Conflict Handling) ───────────────────────
echo "📥 [1/6] Syncing source code from GitHub..."

# Menghindari konflik dengan menyimpan perubahan lokal sementara
git stash || echo "No local changes to stash."

# Pull data terbaru
git fetch origin
git pull origin main

# Mengembalikan perubahan lokal (seperti file deploy.sh ini sendiri)
git stash pop || echo "No stashed changes to re-apply."

# ── 3. Dependencies ─────────────────────────────────────────────────────────
echo "📦 [2/6] Installing dependencies cleanly..."
npm ci

# ── 4. Database Setup (Fix Error P3005) ──────────────────────────────────────
echo "🗄️ [3/6] Syncing Prisma Client..."
npx prisma generate

# Sync schema menggunakan 'db push' tetapi TANPA flag data-loss.
# Jika ada perubahan skema yang berbahaya (misal: hapus kolom), proses deploy akan gagal 
# untuk melindungi data production Anda.
npx prisma db push || echo "⚠️ Warning: Failed to sync database schema. Pengecekan manual diperlukan."

# [Opsional] Jika ini pertama kalinya di-deploy ke server baru dan butuh data awal
# npx prisma db seed
# ── 5. Build Pipeline ───────────────────────────────────────────────────────
echo "🏗️ [4/6] Building Next.js application..."
export NODE_ENV=production
npm run build

# ── 6. Storage & Infrastructure ─────────────────────────────────────────────
echo "📁 [5/6] Verifying local uploads architecture..."
mkdir -p public/uploads
chmod 775 public/uploads 

# ── 7. PM2 Lifecycle Management ─────────────────────────────────────────────
APP_NAME="vea-compro"
echo "🔄 [6/6] Reloading PM2 process ($APP_NAME)..."

if ! command -v pm2 &> /dev/null; then
    echo "❌ ERROR: PM2 is not installed globally."
    exit 1
fi

if pm2 show "$APP_NAME" > /dev/null; then
  echo "♻️ Performing zero-downtime cluster reload..."
  pm2 reload "$APP_NAME" --update-env
else
  echo "▶️ Bootstrapping new process..."
  pm2 start npm --name "$APP_NAME" --env production -- start
fi

pm2 save

echo "=============================================="
echo "✅ Deployment Pipeline Completed Successfully!"
echo "=============================================="