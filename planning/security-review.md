# Security Review — AI Token Launchpad Designer

## 1. Smart Contract Security

### ✅ Passes

| Check | Status | Detail |
|---|---|---|
| OpenZeppelin base | ✅ | ERC-20 + Ownable from `@openzeppelin/contracts@5.x` |
| No custom mint/burn | ✅ | Supply fixed at deploy, no owner mint backdoor |
| Ownable access | ✅ | Only `transferOwnership` and `renounceOwnership` — no admin drain functions |
| Optimizer enabled | ✅ | solc 0.8.20, 200 runs — standard setting |
| Reentrancy | ✅ | No external calls in constructor; ERC-20 transfer is non-reentrant by design |

### ⚠️ Flagged

| Item | Risk | Mitigation |
|---|---|---|
| No vesting contract on-chain | Medium | Vesting is configured but not enforced on-chain yet. Phase 5 improvement. |
| No anti-sniper module | Low | `antiBotBlocks` is AI-generated but not contract-enforced. Feature flag for future. |
| Ownable not renounced | Info | Owner can transfer ownership. Users should `renounceOwnership()` post-launch if desired. |

---

## 2. API Security

| Check | Status | Detail |
|---|---|---|
| Input validation | ✅ | `/api/analyze` validates goal (10–2000 chars, string type check) |
| Rate limiting | ⚠️ | No rate limiter on `/api/analyze` — add `vercel-kv` rate limit in production |
| Env var protection | ✅ | `GROQ_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are server-only (no `NEXT_PUBLIC_` prefix) |
| SQL injection | ✅ | Using Supabase JS client (parameterized queries), no raw SQL |
| JSON mode | ✅ | Groq API called with `response_format: { type: 'json_object' }` to prevent prompt injection in output |

---

## 3. Frontend Security

| Check | Status | Detail |
|---|---|---|
| XSS prevention | ✅ | React auto-escapes all rendered text; no `dangerouslySetInnerHTML` |
| Wallet interaction | ✅ | Uses wagmi/viem — no raw `window.ethereum` calls |
| Private key handling | ✅ | No private keys ever stored or transmitted; MetaMask signs all txs |
| HTTPS enforcement | ✅ | Vercel default on production deployments |
| CORS | ✅ | Next.js API routes are same-origin by default |

---

## 4. Data & Privacy

| Check | Status | Detail |
|---|---|---|
| PII collected | ✅ Minimal | Only wallet address (public on-chain data) — no email, no name |
| localStorage usage | ✅ | Only stores config IDs (UUIDs), no sensitive data |
| Supabase RLS | ⚠️ | RLS policies exist but should be tightened per-wallet in production |
| Data export | ✅ | Users can export their configs as JSON (GDPR-lite compliance) |

---

## 5. Dependency Audit Summary

| Category | Count | Action |
|---|---|---|
| Total packages | ~977 | Standard for Next.js + wagmi + Recharts stack |
| High severity | 17 | Most from Hardhat dev deps (not in production bundle) |
| Moderate | 1 | `postcss` — no exploit path in this usage |
| Low | 1 | Informational |

**Recommendation:** Run `npm audit fix` before production deploy. All high-severity vulns trace to Hardhat dev tooling which is NOT included in the Next.js production build.

---

## 6. Recommendations for Production

1. **Add rate limiting** on `/api/analyze` (e.g., 10 requests/min per IP via Vercel KV)
2. **Add vesting contract** to enforce unlock schedules on-chain
3. **Renounce ownership** option in UI after deploy
4. **Audit contract** via Certik or similar before mainnet
5. **Add CSP headers** in `next.config.js` for production
6. **Tighten Supabase RLS** to wallet-scoped read/write
