# Multi-stage Dockerfile for PT Vanguard Energy Amanah (vea-compro)
# Based on Debian / OpenSSL base pattern proven on production VPS with LIM-WAF
FROM node:20-bookworm-slim AS base

ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# Prisma native engine requires OpenSSL in build and runtime images
RUN apt-get update \
    && apt-get install --no-install-recommends --yes openssl \
    && rm -rf /var/lib/apt/lists/*

FROM base AS installer
COPY package.json package-lock.json ./
# prisma schema needed for postinstall / generate
COPY prisma ./prisma/
RUN npm ci

FROM base AS builder
COPY --from=installer /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate && npm run build

FROM base AS runner
ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=3302
WORKDIR /app

RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs \
    && apt-get update \
    && apt-get install --no-install-recommends --yes dumb-init \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /app/public/uploads \
    && chown -R nextjs:nodejs /app/public/uploads

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./

RUN mkdir -p /app/.next/cache/images \
    && chown -R nextjs:nodejs /app/.next \
    && chmod +x docker-entrypoint.sh

USER nextjs
EXPOSE 3302
ENTRYPOINT ["/app/docker-entrypoint.sh"]
