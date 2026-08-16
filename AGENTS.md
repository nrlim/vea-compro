<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from older training data. Read relevant Next.js 16+ docs before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# PT Vanguard Energy Amanah (`vea-compro`) — Agent Rules & Architecture Guide

> File ini adalah **rules, arsitektur, dan single source of truth** untuk AI Agent yang mengembangkan atau memelihara repositori `vea-compro`. Seluruh konten di sini bersifat imperatif dan WAJIB dipatuhi saat menulis, merevisi, atau mendepoloy kode.

---

## 1. Identitas Produk & Domain Bisnis

**PT Vanguard Energy Amanah (PT VEA)** adalah perusahaan kontraktor pengadaan instrumen presisi, valves industri, fitting perpipaan, dan solusi Engineering, Procurement, and Construction (EPC) yang melayani sektor hulu & hilir Oil & Gas, Petrokimia, dan Power Generation di Indonesia.

### 1.1 Fokus Solusi & Portofolio
- **Instrumen Presisi:** Barton Chart Recorders, Pressure & Differential Transmitters, Temperature Gauges, Ultrasonic & Magnetic Flow Meters.
- **Valves & Flow Control:** Control Valves, Emergency Shut Down (ESD), Ball Valves, Check Valves, Safety Relief Valves (Fisher, Daniel, dll).
- **Piping & Tubing:** Seamless Stainless Steel Tubing (SS 316/316L), High Pressure Double Ferrule Fittings, Instrument Manifolds.
- **Layanan EPC & Pengadaan:** BOM Reconciliation, Technical Sizing, Material Compliance (NACE MR0175), Logistik Terjadwal.

### 1.2 Target Audiens
- Procurement Manager, Instrument Engineer, EPC Contractor, dan Plant Operations Manager dari perusahaan B2B dan B2G nasional.

---

## 2. Arsitektur Infrastruktur & Server Topology

Production target adalah **Self-Hosted Linux VPS** dengan arsitektur containerization Docker, di belakang **LIM-WAF (Go-based OWASP CRS v4 WAF)** dan Nginx TLS Termination.

```
┌─────────────────────────────────────────────────────────────┐
│                    INTERNET / CLIENTS                       │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Port 443 HTTPS - TLS)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                    NGINX TLS TERMINATION                    │
└──────────────────────────────┬──────────────────────────────┘
                               │ (proxy_pass http://127.0.0.1:8081)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             LIM WAF GATE SYSTEM (:8081)                     │
│                  (D:\Ex-Project\lim-waf)                    │
│   ├── OWASP Core Rule Set (CRS) v4 Inspection               │
│   ├── Malicious Payload ──> 403 Custom Block Page           │
│   └── Safe Request ───────> Matches domain "ptvea.com"      │
└──────────────────────────────┬──────────────────────────────┘
                               │ (proxy_pass http://127.0.0.1:3302)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│           NEXT.JS STANDALONE DOCKER CONTAINER               │
│                  (vea-compro on :3302)                      │
│   ├── Next.js 16 Standalone Server (Node.js 20 Debian)      │
│   ├── Prisma Client ──> Host PostgreSQL (127.0.0.1:5432)    │
│   └── Storage Mount ──> Host Directory (./public/uploads)   │
└─────────────────────────────────────────────────────────────┘
```

### 2.1 Alokasi Port Server

| Service | Host Port | Keterangan |
| :--- | :--- | :--- |
| **Dokploy** | `3000` | Management UI |
| **Nuralim Portfolio** | `3300` | Portfolio |
| **Wif-Me App** | `3301` | Multi-service Umrah app (`D:\Ex-Project\wif-me`) |
| **PT VEA App** | `3302` | **PT Vanguard Energy Amanah (`vea-compro`)** |
| **LIM-WAF Proxy** | `8081` | Internal reverse proxy WAF |
| **LIM-WAF Admin** | `9443` | WAF Real-time statistics & rule hot reload |
| **PostgreSQL** | `5432` | Central database cluster on host |

### 2.2 Integrasi LIM-WAF (`/etc/lim-waf/config.yaml`)
WAF gate system memeriksa seluruh traffic sebelum mencapai container:
```yaml
server:
  listen: ":8081"

sites:
  - domain: "ptvea.com"
    backend: "http://127.0.0.1:3302"
    waf:
      enabled: true
      mode: "on"

  - domain: "www.ptvea.com"
    backend: "http://127.0.0.1:3302"
    waf:
      enabled: true
      mode: "on"
```

---

## 3. Technology Stack Aktual

> JANGAN menebak library atau dependencies. Selalu rujuk `package.json`.

| Layer | Teknologi | Detail & Constraint |
| :--- | :--- | :--- |
| **Framework** | Next.js `16.1.6` | App Router, Standalone Output Mode |
| **Runtime** | Node.js `20-bookworm-slim` | Debian base with OpenSSL in Docker |
| **UI Library** | React `19.2.3` | React 19 Actions & Transitions |
| **Styling** | Tailwind CSS `v4` | `@tailwindcss/postcss` + `@theme` inline tokens |
| **Animation** | Framer Motion `12.37.0` | Custom spring curves, staggered entrance |
| **ORM** | Prisma `6.19.2` | PostgreSQL native engine |
| **State** | Zustand `5.0.12` | Cart Store (`lib/store/cart.ts`) |
| **Validation** | Zod `4.3.6` | Schema validation |
| **Icons** | Lucide React `0.577.0` | Ultra-clean thin icons |
| **Payments** | Midtrans Client `1.4.3` | Snap.js integration (Sandbox/Production) |
| **Notifications** | Resend `6.9.4` + Nodemailer `8.0.2` | Dynamic email routing & SMTP Gateway |
| **Security/Auth** | Jose `6.2.1` + Bcryptjs `3.0.3` | JWT HttpOnly Cookie Session |

---

## 4. Design System & Anti-Slop Directives

> **DILARANG MENGGUNAKAN AI SLOP:**
> - ❌ Banned: Gradasi ungu-pink murah (AI Purple).
> - ❌ Banned: 3 kartu fitur generik yang monoton.
> - ❌ Banned: Placeholder "Lorem ipsum" atau teks tidak terarah.
> - ❌ Banned: Transisi `linear` / `ease-in-out` default.

### 4.1 Corporate Industrial Palette
- **Deep Midnight Navy & Obsidian:** `oklch(0.18 0.065 255)` / `#071326` — melambangkan stabilitas, kedalaman teknologi energi, dan presisi.
- **Brushed Brass & Warm Gold:** `oklch(0.76 0.15 82)` / `#C5A880` / `#D4AF37` — aksen material logam presisi industri dan komitmen mutu tinggi.
- **Clean Alabaster & Titanium Slate:** `oklch(0.985 0.003 240)` / `#F9FAFC` — latar belakang architectural yang bersih dan mudah dibaca.

### 4.2 Typography Hierarchy
- **Sans (Body & UI):** `Plus Jakarta Sans` (`--font-sans`) — bersih, modern, dan sangat terbaca pada layar teknik.
- **Serif (Headlines):** `Playfair Display` (`--font-serif`) — wibawa korporasi B2B terpercaya.
- **Mono (Metrics & Specs):** `JetBrains Mono` (`--font-mono`) — untuk kode part number, harga mata uang IDR, dan dimensi teknis.

### 4.3 Double-Bezel (Chassis Hardware Technique)
Semua card utama dibungkus dengan arsitektur double-bezel (outer shell beraksen tipis + inner core solid) yang menyerupai chassis instrumen presisi yang diproduksi dengan mesin CNC.

---

## 5. Struktur Folder & Kode

```
vea-compro/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                      # Landing page utama
│   │   ├── layout.tsx                    # Root layout (Fonts, Meta, Toaster, Snap)
│   │   ├── globals.css                   # Tailwind v4 Design Tokens
│   │   └── produk/page.tsx               # Katalog produk & inventaris
│   ├── payment/                          # Status pembayaran Midtrans
│   │   ├── finish/page.tsx
│   │   ├── pending/page.tsx
│   │   └── error/page.tsx
│   ├── internal-admin/                   # Admin Portal
│   │   ├── (dashboard)/
│   │   │   ├── page.tsx                  # KPI Dashboard
│   │   │   ├── products/                 # Manajemen produk
│   │   │   ├── orders/                   # Riwayat order & Snap tokens
│   │   │   ├── contacts/                 # Inbox RFQ & Konsultasi
│   │   │   ├── brands/                   # Principal brands
│   │   │   ├── mitra/                    # Mitra korporat
│   │   │   ├── settings/                 # SMTP, WhatsApp, Workflows
│   │   │   └── users/                    # Staff & admin accounts
│   │   └── login/page.tsx                # Admin auth login
│   ├── actions/                          # Next.js Server Actions (CRUD & business logic)
│   └── api/
│       ├── health/route.ts               # Docker & WAF healthcheck
│       ├── webhooks/midtrans/            # Midtrans notification handler
│       └── download/                     # Technical documents downloader
├── components/
│   ├── navbar.tsx                        # Floating glass island navbar
│   ├── hero-section.tsx                  # High-impact hero section
│   ├── partners-slider.tsx               # Infinite marquee clients
│   ├── brands-section.tsx                # Principal showcase bento
│   ├── about-section.tsx                 # Core values & milestone timeline
│   ├── services-section.tsx              # Solutions & services cards
│   ├── advantages-section.tsx            # Core advantages & stats
│   ├── contact-section.tsx               # Enterprise RFQ form & channels
│   ├── footer.tsx                        # Corporate luxury footer
│   ├── cart-sheet.tsx                    # Slide-out cart & checkout drawer
│   ├── products/                         # ProductGrid, ProductCard, DetailModal
│   └── ui/                               # Radix / Shadcn primitives
├── prisma/
│   └── schema.prisma                     # Prisma schema (PostgreSQL)
├── public/
│   ├── uploads/                          # Persistent storage mount for images
│   └── main-vea-logo.png                 # Official brand assets
├── Dockerfile                            # Multi-stage standalone build
├── docker-compose.yml                    # Host networking & volume mount
├── docker-entrypoint.sh                  # Automatic db push & server boot
├── DOCKER.md                             # Production deployment runbook
└── AGENTS.md                             # Single Source of Truth
```

---

## 6. Storage & Uploads Policy

1. Semua unggahan file (foto produk, logo brand/mitra, lampiran RFQ) disimpan langsung ke sistem file VPS lokal pada direktori `/public/uploads/`.
2. Pada Docker container, direktori ini **WAJIB** di-mount via volume:
   ```yaml
   volumes:
     - ./public/uploads:/app/public/uploads
   ```
3. Jangan pernah menyimpan upload ke memory ephemeral atau storage temporary tanpa persistensi volume.

---

## 7. Security & Deployment Runbook

### 7.1 Build & Deploy Container
```bash
# Build dan start container
docker compose up --build -d

# Cek logs aplikasi
docker compose logs -f web

# Health check test
curl http://127.0.0.1:3302/api/health
```

### 7.2 Database Operations
- Skema PostgreSQL dikelola via Prisma.
- `docker-entrypoint.sh` secara otomatis menjalankan `npx prisma db push --skip-generate` saat startup container.
- Password SMTP dienkripsi at rest menggunakan algoritma AES-256 (`SMTP_ENCRYPTION_KEY`).

---
*PT Vanguard Energy Amanah — Engineered with Precision.*
