# Project Ganit

Project Ganit is a responsive Next.js MVP for a Class 10 NCERT Mathematics paid learning platform. It translates the attached July 20, 2026 planning pack into a runnable web product that demonstrates the core user journeys:

- Parent-led onboarding with minimal learner data
- Course catalogue with free and premium lessons
- Mock checkout and entitlement flow
- Secure-playback UX framing with watermark and token route
- Progress tracking, quiz attempts and doubt submission
- Live-session dashboard, parent dashboard and admin launch controls
- Support, refund and cancellation communication

## Stack

- Next.js App Router
- TypeScript
- Local seeded state with `localStorage`
- Mock API routes for checkout and playback token issuance

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Important implementation notes

- This repository started empty, so the current build is an MVP scaffold aligned to the attached product documents.
- Payments, live classes and protected video are modeled as demo flows today. The docs in [docs/IMPLEMENTATION_STATUS.md](/Users/macbook/Documents/edtech/docs/IMPLEMENTATION_STATUS.md) mark those areas as `Partial` until real vendor integrations and audited backend controls are added.
- The seeded content focuses on the recommended Phase 1 launch wedge: Class 10 NCERT Mathematics, bilingual Hindi + English, web/PWA first.

## Production follow-ups

- Replace mock checkout with Razorpay orders, subscriptions, verified webhooks and reconciliation.
- Replace demo playback token issuance with a real signed-video integration and concurrency enforcement.
- Move local state into a server-backed identity, entitlement and learning data model.
- Add authentication, RBAC, audit trails, tests, CI/CD and legal-policy artefacts before public launch.
