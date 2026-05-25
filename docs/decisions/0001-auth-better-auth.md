# ADR 0001 — Auth provider: Better Auth

**Date:** 2026-05-25
**Status:** Accepted
**Supersedes:** BRIEFING.md §1.1 (which named Clerk)

## Context

Refract needs an authentication layer for Sprint 2. BRIEFING.md named Clerk as the default. Cost projection:

| MAU | Clerk monthly cost |
|-----|-------------------|
| 10k | ~€200/mo (€0.02/MAU over 10k free) |
| 50k | ~€1,000/mo |
| 100k | ~€2,000/mo |

Refract's pricing is €9.90 (Pro) / €24.90 (Trader). At 10k MAU with 10% paid conversion, monthly revenue ~€10k; Clerk's €200/mo is 2% of revenue. At 50k MAU same conversion, Clerk is €1,000 against ~€50k revenue (still 2%) — but the absolute number means we'd be sending Clerk €12k/year in run-rate.

Compounding concern: User records live in Clerk's database. A future migration requires an email-reset wave for all users, multi-week project. The Austrian Steuerberater customer segment values data sovereignty highly — keeping user identity inside our own EU-hosted Postgres is a positioning asset.

## Decision

Use **Better Auth** as the authentication layer.

- Source: https://www.better-auth.com (open-source, MIT)
- TypeScript-native, no Node-server-language abstraction
- User records live in Refract's Postgres (our schema, our control)
- Free to operate at any scale
- Standard JWT-based session tokens, validated in NestJS via the existing `@nestjs/jwt` ecosystem

## Consequences

**Accepted costs:**
- Sprint 2 effort goes from ~1h (Clerk drop-in) to ~4h (build our own sign-in/sign-up/forgot-password UI components on top of Better Auth's primitives). The components live in `apps/web/components/auth/` and become reusable assets, not throwaway.
- We own the email-delivery integration for verification + password-reset. Reuse the same Resend account we'll add in Sprint 8 for alerts — single email provider for both.

**Gained:**
- ~€2,400/year saved at 10k MAU; ~€12,000/year at 50k MAU.
- Clean DSGVO posture for Steuerberater conversations: "user data lives only in our EU Postgres."
- Migration risk to any future auth lib is low — JWT is the standard interface.

## Implementation notes for Sprint 2

- Better Auth schema extends the existing `User` model (does not replace) — see `apps/api/prisma/schema.prisma`. Add `Session`, `Account` (OAuth providers), `Verification` tables per Better Auth's schema migration.
- Email/password + Google OAuth + Magic-Link on day one. Apple/GitHub OAuth post-launch on demand.
- 2FA (TOTP) gated to Trader tier as a premium-tier signal.
- Session storage: Postgres (not Redis) — Better Auth default. Sessions are infrequent reads, durable, and survive a Redis flush.
