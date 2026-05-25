# ADR 0002 — Stripe Tax automatic

**Date:** 2026-05-25
**Status:** Accepted

## Context

Refract sells subscriptions across the EU. EU MOSS (Mini One-Stop Shop) rules require collecting VAT at the buyer's country rate, filing quarterly returns, and emitting compliant invoices. Options:

1. **Stripe Tax automatic** — Stripe determines the rate per buyer's country, applies it at checkout, generates compliant invoices, and exports a single MOSS-ready report. Fee: 0.5% of transaction value, capped at €0.50 per transaction.
2. **Manual EU MOSS** — We compute VAT ourselves per country, store rates, generate invoices, and file quarterly returns through FinanzOnline. No per-transaction fee, but real engineering and accounting work.

## Decision

Enable **Stripe Tax** with automatic computation from launch.

## Consequences

**Cost math:** At 1,000 Pro subscribers (€9.90/mo), VAT-base is ~€9,900/mo. Tax fee at 0.5% = ~€50/mo (~€600/year). At 10,000 subs = ~€500/mo (~€6,000/year). The cap of €0.50 per transaction means the worst case for a Trader-yearly (€249) sub is €0.50 — well below 0.5%.

Compared to manual EU MOSS: we save (a) the engineering of a rate table + country-detection + invoice templates (~40-80h), (b) ongoing maintenance as rates change, (c) the quarterly filing pain. €600/year for the first year is far cheaper than the engineering opportunity cost.

**Re-evaluation trigger:** If Refract grows past €1M ARR, revisit. At that scale the Tax fee becomes meaningful (~€5k/year) and we may bring it in-house.

**Tax residency:** OptiRisk e.U. is the Austrian entity in Phase 1. Stripe Tax registration uses that. When Phase 2 (Refract GmbH) takes over, Stripe Tax registration migrates.
