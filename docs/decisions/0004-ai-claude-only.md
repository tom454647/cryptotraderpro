# ADR 0004 — AI Coach: Claude-only, no multi-provider

**Date:** 2026-05-25
**Status:** Accepted

## Context

BRIEFING.md uses Claude Haiku for two AI-driven features: KOL-sentiment classification (Sprint 8) and the AI Trade-Coach (Sprint 8). The architecture-hardening review flagged the question: do we add an OpenAI fallback for resilience, or accept Anthropic lock-in for simplicity?

Considerations:

- Anthropic API is generally available via [platform.claude.com](https://platform.claude.com/settings/keys) — there was no service interruption to plan around. Briefing assumption stands.
- Haiku 4.5 pricing (May 2026): $1/M input + $5/M output tokens. Sentiment classification is short-input/short-output, ~$0.002 per tweet. The AI Coach call averages ~2k tokens total per session, ~$0.014 per session.
- Cost ceiling at 50k Trader users × 5 coach sessions/month × $0.014 = ~$3,500/mo, comfortably below 2% of revenue at that scale.
- Multi-provider adds: (a) prompt-portability work (Claude system prompts ≠ OpenAI system prompts ≠ Google), (b) response-shape normalization, (c) two billing relationships, (d) two DPA agreements, (e) ongoing benchmarking to keep both calibrated.
- Anthropic-specific lock-in is mild: prompts and tool definitions are portable with ~1 day of porting work if we ever switched. The 200k-token context window in Haiku also means we don't need the 1M-token Opus for the Coach feature.

## Decision

Use **Anthropic Claude (Haiku 4.5) as the sole LLM provider** for both Sentiment and the AI Coach. Do not build a multi-provider abstraction in Sprint 8.

## Consequences

**Gained:**
- ~1 week of engineering effort saved.
- Single set of prompts to maintain and tune.
- One DPA to sign, one billing relationship.
- Better tool-use ergonomics (Claude's tool definitions are well-shaped for our journal-question generation).

**Accepted risks:**
- Anthropic outage = AI features down for that window. Mitigation: AI is enrichment, not core — wallet/exchange aggregation + tax + alerts all work without it. Outage degrades UX but does not break the product. We log "AI temporarily unavailable" with a Sentry breadcrumb.
- Pricing change risk. Anthropic has not raised prices since model launches; their direction has been opposite (cheaper smaller models). Re-evaluate annually.

**Implementation:**
- API key in `ANTHROPIC_API_KEY` env var, never in code.
- All LLM calls go through a thin `AnthropicService` in `apps/api/src/ai/`. Single chokepoint for any future provider swap.
- Per-request cost is logged into `usage_event` (see ARCHITECTURE.md §9) — feeds the True Cost widget and lets us spot runaway prompts.
- Anonymization: see ADR 0003 — prompts never contain `userId`, email, or other PII.
