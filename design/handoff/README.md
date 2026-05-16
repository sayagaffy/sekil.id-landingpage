# Sekil.id Design Token Handoff

**Date:** 2026-05-16
**Status:** Derived from spec brand context — replace with Claude Design export when available

## Token Source

The Claude Design URL `https://api.anthropic.com/v1/design/h/u571ScDgMTw_oa-rxcCbmw` returned 404 at bootstrap time.
Tokens were generated from brand context in:
- `specs/04_Claude_Design_Handoff_Prompts.md`
- `specs/05_Repo_Setup_Guide.md` (section 3.3)

## Brand → Token Mapping

| Brand Element | Token Name | Value |
|---|---|---|
| Primary navy (from Metranet deck) | `--primary` / `primary-700` | HSL 217 71% 22% (#0E2A56) |
| Accent yellow | `--accent` / `accent-400` | HSL 47 100% 62% (#FFD93D) |
| Background | `--background` | HSL 0 0% 100% (white) |
| Text | `--foreground` | HSL 222 47% 11% |
| Muted text | `--muted-foreground` | HSL 215 16% 47% |
| Border | `--border` | HSL 214 32% 91% |

## To Update from Claude Design

1. Export the handoff bundle from Claude Design (claude.ai → project → Export)
2. Run the extraction prompt in `specs/04_Claude_Design_Handoff_Prompts.md` section 1.1
3. Update `design/design-tokens.json` with the extracted values
4. Run `npm run build` to verify CSS is valid

## Usage

CSS variables are defined in `src/styles/globals.css`.
Tailwind references them via `tailwind.config.ts` (no hardcoded values).
All components use `hsl(var(--token-name))` format.
