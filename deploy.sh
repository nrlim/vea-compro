#!/bin/bash

# ── 1. Preparation & Safety Checks ───────────────────────────────────────────
# Exit immediately if a command exits with a non-zero status
set -e
# Exit if any variable is uninitialized
set -u

echo "=============================================="
echo "🚀 Starting Production Deployment for vea-compro"
echo "📅 Date: $(date)"
echo "=============================================="

# Check if .env exists (crucial for production DB connections)
if [ ! -f .env ]; then
  echo "❌ ERROR: .env file not found! Next.js and Prisma require this."
  echo "Please create a .env file with your production database credentials."
  exit 1
fi

# ── 2. Source Code Management ───────────────────────────────────────────────
echo "📥 [1/6] Pulling the latest source code from GitHub..."
git fetch origin
git pull origin main

# ── 3. Dependencies ─────────────────────────────────────────────────────────
echo "📦 [2/6] Installing dependencies cleanly..."
# 'npm ci' is built for production: it wipes node_modules, reads package-lock.json 
# exactly, and prevents accidental version mismatches.
npm ci

# ── 4. Database Setup ───────────────────────────────────────────────────────
echo "🗄️ [3/6] Generating Prisma Client & Safely Applying Migrations..."
npx prisma generate
# 'migrate deploy' is the STRICT production standard. It applies pending
# migrations without resetting the database (unlike 'migrate dev').
npx prisma migrate deploy

# ── 5. Build Pipeline ───────────────────────────────────────────────────────
echo "🏗️ [4/6] Building Next.js application..."
# Next.js compiles pages and pre-renders static assets into the /.next folder.
npm run build

# ── 6. Storage & Infrastructure ─────────────────────────────────────────────
echo "📁 [5/6] Verifying local uploads architecture..."
mkdir -p public/uploads
# Ensure the process has rights to write to this location.
chmod 775 public/uploads 

# ── 7. PM2 Lifecycle Management ─────────────────────────────────────────────
APP_NAME="vea-compro"
echo "🔄 [6/6] Reloading PM2 process ($APP_NAME)..."

if ! command -v pm2 &> /dev/null; then
    echo "❌ ERROR: PM2 is not installed globally."
    echo "Install it using: 'npm install pm2 -g'"
    exit 1
fi

if pm2 show "$APP_NAME" > /dev/null; then
  echo "♻️ Performing zero-downtime cluster reload..."
  # --update-env ensures any changes to .env on the server take effect 
  pm2 reload "$APP_NAME" --update-env
else
  echo "▶️ Process not found in PM2. Bootstrapping new process..."
  pm2 start npm --name "$APP_NAME" -- start
fi

# Save the PM2 list so the server automatically brings the app back up on machine reboot
pm2 save

echo "=============================================="
echo "✅ Deployment Pipeline Completed Successfully!"
echo "=============================================="
