# ADR 0003 — GDPR: EU-only data residency across all vendors

**Date:** 2026-05-25
**Status:** Accepted

## Context

CryptoTrader Pro's target customers include Austrian retail crypto investors and (especially) Steuerberater handling clients' crypto positions. For the Steuerberater segment, EU data residency is a hard requirement — they cannot recommend CryptoTrader Pro to clients if user data sits on US servers under FISA-702.

GDPR Schrems-II reality: even with Standard Contractual Clauses, US data transfers require a Transfer Impact Assessment and remain legally precarious. EU-residency-by-default sidesteps the whole conversation.

## Decision

Every vendor in CryptoTrader Pro's data path must store user data **only in the EU**, with no automatic backup or replication to US regions. Where a vendor doesn't offer that, we substitute.

| Vendor | Purpose | EU residency | Configured |
|--------|---------|--------------|------------|
| Railway | API + DB + workers | EU-Frankfurt | At project creation |
| Vercel | Web frontend | EU-Frankfurt-Edge | At project creation |
| Supabase (Auth) | Identity | EU-Frankfurt | At project creation (ADR 0001) |
| Stripe | Payments | EU-Ireland | Account region set to AT |
| Sentry | Errors | EU-Frankfurt | Use `sentry.eu` org |
| PostHog | Product analytics | EU-Frankfurt | Use `eu.posthog.com` |
| Better Stack | Logs + uptime | EU-Frankfurt | Confirm at project creation |
| Resend | Transactional email | EU region | Confirm at account creation |
| Anthropic (LLM) | AI coach | US-only (see notes) | See notes |
| Alchemy | EVM RPC | US (see notes) | See notes |
| Helius | Solana RPC | US (see notes) | See notes |
| CoinGecko | Prices | Global CDN (see notes) | See notes |

### LLM + on-chain provider notes

Anthropic, Alchemy, Helius, CoinGecko, Zerion process **anonymized request data only** — no user identifiers, no email addresses, no portfolio composition tied to a person. The wallet address is technically pseudonymous public data already. We document this in our Privacy Notice under "external processors of pseudonymized/public data."

For the AI coach: prompts are constructed server-side from anonymized trade events (asset symbol, side, amount, timestamp) — no `userId`, no email, no name. The model's response is returned through us, never logged with PII. This brings the Anthropic call inside the "non-personal data" category, sidestepping the Schrems-II concern. Documented in `docs/privacy/llm-data-flow.md` (to be written in Sprint 8).

## Consequences

- Every vendor signup includes the explicit region selection — written into Sprint 2 setup checklist.
- The DPA mappe is straightforward: every vendor on the table above has a standard EU DPA template signed before they touch production data.
- One operational implication: we cannot use Sentry's Cron Monitoring (US-only at the moment) — we'll use Better Stack's uptime monitoring instead, which has the same trigger semantics.
- We cannot use Vercel's Postgres or KV stores (US regions only for those products). Postgres + Redis stay on Railway.
