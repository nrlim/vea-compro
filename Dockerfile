# Uses the same Debian/OpenSSL base pattern as the proven Wif-Me deployment.
FROM node:20-bookworm-slim AS base

ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# Prisma's native engine requires OpenSSL in the build and runtime images.
RUN apt-get update \
    && apt-get install --no-install-recommends --yes openssl \
    && rm -rf /var/lib/apt/lists/*

FROM base AS installer
COPY package.json package-lock.json ./
# postinstall runs `prisma generate`, so the schema and Prisma config must exist now.
COPY prisma ./prisma/
COPY prisma.config.ts ./
RUN npm install

FROM base AS builder
COPY --from=installer /app/node_modules ./node_modules
COPY . .
RUN npm run prisma:generate && npm run build

FROM builder AS runner
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
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 3302) + '/api/health').then((res) => process.exit(res.ok ? 0 : 1)).catch(() => process.exit(1))"
ENTRYPOINT ["/app/docker-entrypoint.sh"]
