# FairShift – Decent Work Protocol (SDG 8)
Prompt Wars 2026 × SRM ACM. Next-generation workforce intelligence and tamper-evident labor rights platform. One codebase, two interfaces (Worker Portal / Admin Radar), multiple sectors (Construction Site, College Campus).

## Features & Improvements
- **Interactive 3D Holographic Canvas Orb**: Physics-driven 3D particle wave mesh sphere styled with dual neon gradient (violet/cyan and fiery coral) reacting to user interaction.
- **Tamper-Evident Attendance Ledger**: Check-ins are hash-chained (`prev` hash + worker + start + end). Any subsequent edit breaks the chain immediately. Includes worker-specific verification, precise tampered block highlighting, and attack simulation/recovery tools.
- **Living Multilingual Payslip with TTS**: Itemizes regular hours, sector overtime multipliers, hourly wage, and total gross pay in English, Tamil, and Hindi. Includes read-aloud speech synthesis with localized currency terms (`ரூபாய்`, `रुपये`, `rupees`) and tamper warning flags.
- **Encrypted Anonymous Hazard Dispatch**: Whistleblower reports protected by k-anonymity. Individual workers cannot spam to bypass thresholds; management views are securely unlocked only after independent confirmations from distinct workers. Includes voice dictation with active recording state.
- **Predictive Fatigue & Quit-Risk Intelligence**: Per-sector configurable caps, overtime rules, true consecutive-day streak detection, and rest period validation.
- **Holographic QR Scanner Terminal**: Realistic site QR check-in terminal with laser sweep animation and synthesized audio feedback.

## Sector Configurations
- **Construction**: Daily/hourly shifts, 8h cap, 2.0× overtime, 12h max shift, 10h min rest, 6-day max streak. Hazards: Scaffolds, Cranes, Site gates.
- **College Campus**: Campus staff, 9h cap, 1.5× overtime, 12h max shift, 10h min rest, 6-day max streak. Hazards: Hostels, Canteens, Laboratories.

## Run, Test, Deploy
```bash
node --test test/core.test.js   # Unit tests (Node 18+, zero external dependencies)
npx serve .                     # Local preview
gcloud run deploy fairshift --source . --region asia-south1 --allow-unauthenticated
```
