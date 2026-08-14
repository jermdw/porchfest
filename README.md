# Senoia PorchFest

Website + volunteer sign-up system for [Senoia PorchFest](https://www.enjoysenoia.com/events/senoia-porchfest-2026)
— live music on the porches of historic Senoia, GA. Sunday, September 6, 2026.

Firebase project: `senoiaporchfest`. Sister site to
[senoia-car-show](../senoia-car-show) — same architecture.

## Local development

```bash
npm install
(cd functions && npm install)
npx firebase-tools emulators:start --only auth,functions,firestore   # terminal 1
node scripts/seed-shifts.mjs data/shifts_2026.csv                    # seed emulator
npm run dev                                                          # terminal 2 → http://localhost:5174
```

## Deploy

```bash
npm run build
npx firebase-tools deploy --only functions,hosting --project senoiaporchfest
```

See `CLAUDE.md` for architecture, invariants, and gotchas.
