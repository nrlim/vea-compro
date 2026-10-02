# PT Vanguard Energy Amanah (PT VEA) — Docker & LIM-WAF Deployment

This guide documents the containerized deployment of the PT VEA web application (`vea-compro`) and its integration with the **LIM-WAF** gate system on the production VPS.

---

## 1. Port Allocations on Server

| Service | Host Port | Description |
| :--- | :--- | :--- |
| **Dokploy** | `3000` | Infrastructure & Container Management |
| **Nuralim Portfolio** | `3300` | Developer Portfolio |
| **Wif-Me App** | `3301` | Multi-service Umrah/Haji platform |
| **PT VEA App** | `3302` | PT Vanguard Energy Amanah (`vea-compro`) |
| **LIM WAF Internal Proxy** | `8081` | Go-based OWASP CRS v4 WAF Gate System |
| **LIM WAF Admin Dashboard** | `9443` | Real-time security metrics & rule management |
| **PostgreSQL Database** | `5432` | Host-level PostgreSQL cluster |

---

## 2. Infrastructure Topology

```
[ Internet Traffic ]
        │ (Port 443 HTTPS - SSL / TLS Termination)
        ▼
[ Nginx Reverse Proxy ]
        │ (proxy_pass http://127.0.0.1:8081)
        ▼
[ LIM WAF (:8081) ] (D:\Ex-Project\lim-waf)
  ├── Inspects Request via OWASP CRS v4
  ├── Malicious Request ──> 403 Branded Block Page
  └── Safe Request ───────> Matches domain "ptvea.com"
        │ (proxy_pass http://127.0.0.1:3302)
        ▼
[ PT VEA Docker Container (:3302) ]
  ├── Next.js 16 Standalone Server (Node.js 20)
  ├── Prisma Client ──> PgBouncer (pgbouncer-pooler:6432)
  ├── Prisma CLI ─────> PostgreSQL (postgres-center:5432)
  └── Uploads Volume ──> Host Directory (./public/uploads)
```

---

## 3. LIM-WAF Configuration (`/etc/lim-waf/config.yaml`)

Add the PT VEA site entry to your `/etc/lim-waf/config.yaml`:

```yaml
server:
  listen: ":8081"

sites:
  # Existing server allocations:
  # - nuralim.dev                 -> http://127.0.0.1:3300
  # - wifme.id                    -> http://127.0.0.1:3301
  # - snaptext.nuralim.dev        -> http://127.0.0.1:5173
  # - api-snaptext.nuralim.dev    -> http://127.0.0.1:5174

  # PT Vanguard Energy Amanah
  - domain: "ptvea.com"
    backend: "http://127.0.0.1:3302"
    waf:
      enabled: true
      mode: "on"
    csp: >-
      default-src 'self';
      script-src 'self' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: https:;
      font-src 'self' data:;
      connect-src 'self';
      frame-src 'none'; object-src 'none'; worker-src 'self' blob:;
      manifest-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';
      upgrade-insecure-requests

  - domain: "www.ptvea.com"
    backend: "http://127.0.0.1:3302"
    waf:
      enabled: true
      mode: "on"
    csp: >-
      default-src 'self';
      script-src 'self' 'unsafe-inline';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: https:;
      font-src 'self' data:;
      connect-src 'self';
      frame-src 'none'; object-src 'none'; worker-src 'self' blob:;
      manifest-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';
      upgrade-insecure-requests

rules:
  crs_path: "/etc/lim-waf/rules/coreruleset"
  custom_rules_path: "/etc/lim-waf/rules/custom"

logging:
  level: "info"
  file: "/var/log/lim-waf/access.log"
  audit_log: "/var/log/lim-waf/audit.log"

branding:
  name: "LIM"
  url: "https://nuralim.dev"
```

After updating the WAF config, reload the service:
```bash
sudo systemctl restart lim-waf
sudo systemctl status lim-waf
```

### 3.1 CSP / Security Headers
The app emits CSP and security headers from `next.config.ts`. LIM-WAF should use the same per-site CSP above, or WAF-side CSP injection should be disabled; browsers enforce both headers. Current CSP is intentionally minimal (`self` only, plus `img-src https:` for external image rendering); Midtrans Snap.js is not loaded by default.

---

## 4. Nginx Reverse Proxy Configuration

In `/etc/nginx/sites-available/ptvea.com`:

```nginx
server {
    listen 80;
    server_name ptvea.com www.ptvea.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ptvea.com www.ptvea.com;

    ssl_certificate /etc/letsencrypt/live/ptvea.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ptvea.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:8081; # Route through LIM-WAF
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 90;
    }
}
```

---

## 5. Deployment Step-by-Step

### 5.1 Prerequisites
1. Docker Engine & Docker Compose v2 installed.
2. Existing PostgreSQL stack connected to Docker network `postgres-network` (`pgbouncer-pooler:6432`, `postgres-center:5432`).
3. Mode `600` `.env.production` file.

### 5.2 First-time Setup
```bash
# 1. Clone repository
git clone https://github.com/nuralim/vea-compro.git /opt/vea-compro
cd /opt/vea-compro

# 2. Configure Environment
cp .env.production.example .env.production
chmod 600 .env.production
# Edit .env.production with your real secrets (DATABASE_URL via pgbouncer-pooler, DIRECT_URL via postgres-center, JWT_SECRET, etc.)

# 3. Create persistent storage directory
mkdir -p public/uploads
chmod 775 public/uploads

# 4. Build and run container
docker compose up --build -d

# 5. Check container logs
docker compose logs -f web
```

### 5.3 Updating Application
```bash
cd /opt/vea-compro
git pull origin main
docker compose up --build -d --remove-orphans
```

---

## 6. Upload Volume & Backup

All product images, catalog manuals, and partner logos are persisted in `./public/uploads` on the host machine. This directory is mounted into the container at `/app/public/uploads`.
Ensure regular backups of:
1. PostgreSQL Database (`pg_dump veadb > backup.sql`)
2. Uploads folder (`tar -czvf uploads-backup.tar.gz ./public/uploads`)
