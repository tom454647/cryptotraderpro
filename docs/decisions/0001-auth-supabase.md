# ADR 0001 — Auth provider: Supabase Auth

**Date:** 2026-05-25
**Status:** Accepted
**Supersedes:** BRIEFING.md §1.1 (which named Clerk)
**Amendment note:** Earlier the same day this ADR was drafted with Better Auth as the choice. Within hours the operator (Thomas) revised: complexity-budget concern — Better Auth requires us to build our own sign-in/sign-up/forgot-password UI components on top of primitives. Supabase Auth ships those out of the box and is open-source-self-hostable as the lock-in escape hatch. The amendment is recorded here rather than in a superseding ADR to keep the file count low — the decision is dated, the prior consideration is documented, that's enough.

## Context

CryptoTrader Pro needs an authentication layer for Sprint 2. BRIEFING.md named Clerk. Cost projection at 10k MAU ≈ €200/mo with Clerk; at 50k MAU ≈ €1,000/mo. Compounding concern: user records live in Clerk's database, making future migration a multi-week project with a forced password-reset wave for every user.

Two viable open-source-friendly alternatives:

| | Better Auth | Supabase Auth |
|---|---|---|
| Cost at 10k MAU | €0 (own infra) | €0 (free tier covers 50k MAU) |
| EU residency | Lives in our Postgres | Frankfurt region available |
| UI components | We build them (~3-4h) | Pre-built React/Next.js components |
| Lock-in risk | Zero (MIT, lives in our DB) | Low (open-source, self-hostable) |
| TS-native DX | Excellent | Good |
| Magic links + OAuth + 2FA + Passkeys | Yes, all | Yes, all |
| NestJS integration | First-class JWT | Standard JWT validation |
| Email delivery | We integrate Resend | Built-in (Supabase SMTP), or BYO Resend |

The decisive factor: Sprint 2 complexity budget. Better Auth saves a vendor but spends ~3-4h on UI components we'd otherwise get from Supabase ready-made. The operator's preference is to ship fast at MVP and revisit if the Supabase relationship sours.

## Decision

Use **Supabase Auth** as CryptoTrader Pro's authentication layer. Configure with:

- **Region:** EU-Frankfurt (mandatory for GDPR — see ADR 0003).
- **Mode:** Auth-only — we don't use Supabase's Postgres or Storage. Our database stays on Railway. Supabase JWTs are validated in NestJS via standard `jsonwebtoken` against Supabase's JWKS endpoint.
- **Providers:** Email/password + Magic Link + Google OAuth + (Trader-tier) TOTP 2FA.
- **Email delivery:** Supabase's built-in SMTP for verification + password-reset initially; migrate to Resend in Sprint 8 when alert/journal emails come online (one provider for everything).
- **User mirror:** A `User` row in our own Postgres is created on Supabase webhook `user.created` — keeps queries and joins inside one DB. Supabase ID stored as `User.authProviderId`.

## Consequences

**Gained:**
- ~€2,400/year saved at 10k MAU vs Clerk; ~€12,000/year at 50k MAU.
- Pre-built UI components — Sprint 2 stays close to the briefing's ~4h budget instead of ballooning.
- EU residency one config flag away.
- Self-hostable escape route if Supabase pricing or terms ever turn hostile.

**Accepted costs:**
- One additional vendor in the GDPR-DPA mappe (small, Supabase has a standard EU DPA template).
- Two systems of record for user identity (Supabase ID vs our `User.id`) — kept in sync via webhook, but a sync failure is a class of bug we'd not have with Better Auth.
- We don't fully own the password-reset email template (Supabase brands it lightly — replaceable with custom SMTP later).

## Implementation notes for Sprint 2

1. Supabase project created in EU-Frankfurt region. JWT secret + URL go into Railway env vars.
2. `apps/web` uses `@supabase/ssr` + `@supabase/auth-ui-react` for the sign-in components. Theme matched to CryptoTrader Pro's Spectrum palette.
3. `apps/api` validates JWTs via a NestJS guard pulling Supabase JWKS. Token expiry honored, refresh via Supabase's client.
4. Webhook endpoint `/api/webhooks/supabase`: `user.created` → upsert our `User` table; `user.updated` → propagate email/metadata; `user.deleted` → soft-delete + 30-day grace + hard-delete worker.
5. 2FA enrollment hidden until tier upgrades past FREE — small UX tweak in the settings page.
