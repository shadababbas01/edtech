# Project Ganit

Project Ganit is a responsive Next.js MVP for a Class 10 NCERT Mathematics paid learning platform. It now runs on a server-backed embedded data layer instead of browser-only demo state, while keeping the original product shape from the July 21, 2026 planning pack:

- Parent-led onboarding with minimal learner data
- Course catalogue with free and premium lessons
- Persisted checkout, payment verification, orders and entitlements
- Playback-token issuance with entitlement checks and concurrency handoff
- Progress tracking, quiz attempts and doubt submission
- Live-session join tokens and attendance persistence
- Parent dashboard, admin CMS controls, support desk and refund workflow

## Stack

- Next.js App Router
- TypeScript
- Embedded JSON data store with versioned initialization scripts
- Mock provider adapters for payments, playback and live-session tokens
- Vitest for business-rule verification

## Run locally

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Then open `http://localhost:3000`.

## Scripts

```bash
npm run db:migrate   # initialize/migrate the embedded database file
npm run db:seed      # reset and reseed the demo tenant
npm run typecheck
npm test
npm run build
```

## Data model and architecture

The current MVP uses a server-backed embedded store in `data/app-db.json` with versioned initialization logic in:

- [scripts/db-migrate.ts](/Users/macbook/Documents/edtech/scripts/db-migrate.ts)
- [scripts/db-seed.ts](/Users/macbook/Documents/edtech/scripts/db-seed.ts)
- [lib/server/database.ts](/Users/macbook/Documents/edtech/lib/server/database.ts)
- [lib/server/services.ts](/Users/macbook/Documents/edtech/lib/server/services.ts)

The store persists:

- Accounts and learner profiles
- Course, chapter, lesson and quiz content
- Plans, orders, payments, subscriptions and entitlements
- Lesson progress and quiz attempts
- Doubts and instructor responses
- Live sessions and attendance
- Support tickets and refund requests
- Playback sessions, vendor events and audit logs
- Launch readiness checklist items

## Provider mode

This repository is intentionally production-minded but still runs in provider mock mode by default:

- Payments: order creation, verification, webhook idempotency and entitlement granting are real in-app flows, but the gateway is a mock provider.
- Video: playback authorization, watermark payload and concurrency handoff are implemented, but the stream vendor is still mocked.
- Live: join eligibility, join-token issuance and attendance persistence are implemented, but the live-class vendor is still mocked.

Environment defaults live in [.env.example](/Users/macbook/Documents/edtech/.env.example).

## Tests and verification

Verified on Tuesday, July 21, 2026 with:

- `npm run db:migrate`
- `npm run db:seed`
- `npm run typecheck`
- `npm test`
- `npm run build`

## Remaining production gaps

- Replace the mock payment adapter with a real gateway such as Razorpay, including signature verification against live webhook payloads.
- Replace mock playback tokening with a real signed-video provider and stronger anti-piracy controls.
- Replace mock live join-token issuance with a real classroom vendor integration.
- Add authentication, stronger RBAC, richer audit review UI, and CI/CD workflows before public launch.
