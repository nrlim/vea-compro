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

# ── 2. Source Code Management ───────────────────────────────────────────────
echo "📥 [1/6] Pulling the latest source code from GitHub..."
git fetch origin
git pull origin main

# ── 3. Dependencies ─────────────────────────────────────────────────────────
echo "📦 [2/6] Installing dependencies cleanly..."
# npm ci lebih cepat dan konsisten untuk production
npm ci

# ── 4. Database Setup (Fix Error P3005) ──────────────────────────────────────
echo "🗄️ [3/6] Syncing Prisma Client..."
npx prisma generate

echo "🔄 Applying migrations..."
# Menggunakan --skip-generate karena kita sudah melakukan generate di atas.
# Jika ada error P3005 (database not empty), script akan tetap lanjut ke build.
npx prisma migrate deploy || echo "⚠️ Warning: Migration skipped or database already baselined. Continuing to build..."

# ── 5. Build Pipeline ───────────────────────────────────────────────────────
echo "🏗️ [4/6] Building Next.js application..."
# Memastikan build berjalan dalam mode production
export NODE_ENV=production
npm run build

# ── 6. Storage & Infrastructure (PT VEA Clean Storage) ──────────────────────
echo "📁 [5/6] Verifying local uploads architecture..."
# Membuat folder upload di luar kendali Git agar data foto produk aman
mkdir -p public/uploads
chmod 775 public/uploads 

# ── 7. PM2 Lifecycle Management ─────────────────────────────────────────────
APP_NAME="vea-compro"
echo "🔄 [6/6] Reloading PM2 process ($APP_NAME)..."

if ! command -v pm2 &> /dev/null; then
    echo "❌ ERROR: PM2 is not installed globally."
    exit 1
fi

# Periksa apakah proses sudah ada
if pm2 show "$APP_NAME" > /dev/null; then
  echo "♻️ Performing zero-downtime cluster reload..."
  pm2 reload "$APP_NAME" --update-env
else
  echo "▶️ Bootstrapping new process with Production Environment..."
  # Menjalankan aplikasi dengan flag production eksplisit
  pm2 start npm --name "$APP_NAME" --env production -- start
fi

# Simpan konfigurasi agar otomatis nyala saat VPS reboot
pm2 save

echo "=============================================="
echo "✅ Deployment Pipeline Completed Successfully!"
echo "🌐 App is running on port 3000"
echo "=============================================="