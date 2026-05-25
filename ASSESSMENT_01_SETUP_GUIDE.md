# SETUP GUIDE: Make AI Safe for Doctors
## Drug Safety Engine: Environment Setup + AI Starter Prompt

---

## ENVIRONMENT SETUP

### What You Need Installed

| Tool | Why |
|------|-----|
| Node.js (v18+) | Runtime | 
| Git | Version control + submission |
| VS Code (recommended) | Code editor |
| Supabase account (free) | PostgreSQL database |
| LLM API key | AI responses — free tier credits are sufficient |

### Mac Setup

```bash
# Install Homebrew (if needed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Verify
node --version   # v18+
npm --version    # 9+
git --version    # 2.x+

# Create project
mkdir brahmo-drug-safety
cd brahmo-drug-safety && git init

# Initialize (pick one)
npx create-next-app@latest . --typescript --tailwind --app --src-dir --no-import-alias
# OR: npm create vite@latest . -- --template react-ts

# Install dependencies
npm install @supabase/supabase-js

# Create .env.local
echo "NEXT_PUBLIC_SUPABASE_URL=your_url" > .env.local
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key" >> .env.local
echo "LLM_API_KEY=your_key" >> .env.local

# Start
npm run dev   # → http://localhost:3000
```

### Windows Setup

```powershell
# Install Node.js from https://nodejs.org (LTS, check "Add to PATH")
# Install Git from https://git-scm.com

# Verify in PowerShell
node --version   # v18+
npm --version    # 9+
git --version    # 2.x+

# Create project
mkdir brahmo-drug-safety
cd brahmo-drug-safety
git init

# Initialize
npx create-next-app@latest . --typescript --tailwind --app --src-dir --no-import-alias

# Install dependencies
npm install @supabase/supabase-js

# Create .env.local file with:
# NEXT_PUBLIC_SUPABASE_URL=your_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
# LLM_API_KEY=your_key

npm run dev
```

### Supabase Setup

```
1. Go to supabase.com → Sign up (free)
2. Create project: "brahmo-drug-safety"
3. Wait ~2 minutes for provisioning
4. Settings → API → Copy Project URL + anon key → paste into .env.local
5. SQL Editor → Run CREATE TABLE statements from Assessment 1 Part C
6. Table Editor → Verify tables created
7. SQL Editor → Run INSERT statements to load 50 drugs + 30 interactions
```

### LLM API Test

```javascript
// test-claude.js — run: node test-claude.js
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + process.env.LLM_API_KEY,
    "anthropic-version": "2023-06-01"
  },
  body: JSON.stringify({
    model: "your-preferred-model",
    max_tokens: 500,
    messages: [{ role: "user", content: "Say hello in 10 words or less" }]
  })
});
const data = await response.json();
console.log(data.content[0].text);
```

---

## AI STARTER PROMPT

Copy this into Claude Code, Cursor, or your AI assistant to scaffold the project:

```
I'm building a Drug Safety Engine for a clinical AI system. Here's what I need:

TECH STACK: Next.js + TypeScript + Supabase + Claude API + Tailwind CSS

DATABASE (Supabase):
Create these 3 tables and seed with data:

1. "drugs" table — 50 medications with:
   id (UUID), generic_name, generic_name_normalized (lowercase no spaces),
   drug_class (e.g., "statin", "macrolide", "penicillin"),
   renal_dosing (JSONB with eGFR thresholds)

2. "drug_interactions" table — 30 interaction pairs with:
   drug_a_id, drug_b_id, severity (CONTRAINDICATED/SEVERE/MODERATE/MINOR),
   mechanism, clinical_effect, management

3. "allergy_cross_reactivity" table — drug class cross-reactivity:
   drug_class_a, drug_class_b, cross_reactivity_pct, clinical_guidance

SAFETY ENGINE (4 deterministic checks — database lookups, NOT AI):
1. checkDrugInteractions(newDrug, currentMedications) → check all pairs
2. checkAllergyConflicts(newDrug, patientAllergies) → direct + cross-reactivity
3. checkRenalDosing(newDrug, patientEGFR) → threshold comparison
4. computeScore(calculator, patientData) → eGFR CKD-EPI + CHA2DS2-VASc

CONSTRAINT TEXT GENERATOR:
Convert safety results into text with severity icons:
⛔ HARD BLOCK (importance 10), ⚠️ WARNING, ℹ️ INFO
This text gets prepended to Claude's system prompt.

CLAUDE API — Two calls for comparison:
- Generic: Claude with just patient data (no safety constraints)
- Enhanced: Claude with safety constraint text as system prompt

FRONTEND:
- Patient selector (10 pre-loaded patients)
- Patient summary card (meds, allergies, labs)
- Doctor's question input
- Two buttons: "Ask Generic Claude" / "Ask Safety-Enhanced Claude"
- Safety alerts panel (which checks fired)
- Side-by-side response comparison

IMPORTANT: The safety engine must work for ANY patient and ANY drug
in the database, not just the demo scenarios. During evaluation,
new patients will be tested that weren't in the original demo.

Start with database schema + seed data, then safety engine, then frontend.
```

---

## PROJECT STRUCTURE

```
brahmo-drug-safety/
├── README.md
├── .env.local                    ← DO NOT commit
├── .env.local.example            ← Commit with placeholder values
├── package.json
├── src/
│   ├── app/
│   │   ├── page.tsx              ← Main demo page
│   │   └── api/
│   │       ├── safety-check/route.ts
│   │       └── claude/route.ts
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── safety-engine.ts      ← DDI, allergy, renal checks
│   │   ├── calculators.ts        ← eGFR, CHA2DS2-VASc
│   │   └── types.ts
│   └── components/
│       ├── PatientCard.tsx
│       ├── SafetyAlerts.tsx
│       └── ResponseComparison.tsx
├── supabase/
│   ├── schema.sql                ← All CREATE TABLE
│   └── seed.sql                  ← All INSERT (50 drugs, 30 DDIs)
└── docs/
    └── architecture.md
```

## TIME MANAGEMENT (8 hours)

| Phase | Hours | Focus |
|-------|:-----:|-------|
| Setup + read assessment | 0.5 | Environment, Supabase, read thoroughly |
| Database schema + load ALL 50 drugs + 30 DDIs | 1.5 | Get data right FIRST |
| Safety engine (4 checks) | 2.5 | MOST IMPORTANT — get logic correct |
| Claude API integration | 1.0 | Generic vs enhanced comparison |
| Frontend + demo flow | 1.5 | Patient selector, side-by-side display |
| Innovation features | 0.5 | Your 25-30% additions |
| Test ALL scenarios + surprise-readiness | 0.5 | Run every drug combo, not just demo ones |

---

## SUBMISSION CHECKLIST

```
□ README.md with setup instructions
□ .env.local.example (placeholder values)
□ supabase/schema.sql runs clean
□ supabase/seed.sql loads ALL 50 drugs + 30 interactions
□ All 4 demo scenarios work
□ System handles NEW patients not in demo (surprise-ready)
□ eGFR calculator works for any creatinine/age/sex
□ CHA₂DS₂-VASc works for any valid inputs
□ Clean git history
□ docs/architecture.md explains key decisions
```

*Setup Guide v1.0 — Make AI Safe for Doctors*

---

## FREE TIER API OPTIONS (No Cost Required)

You do NOT need paid subscriptions. Here are free options for the demo app's LLM calls:

| Provider | Free Tier | How to Get |
|---|---|---|
| **Anthropic (Claude)** | $5 free credit on new account | console.anthropic.com → sign up → API key |
| **OpenAI (GPT)** | $5 free credit on new account (may vary) | platform.openai.com → sign up → API key |
| **Google (Gemini)** | Free tier available | ai.google.dev → sign up → API key |

$5 free credit covers 100+ API calls — more than enough for development + demo.

For AI coding assistance, use free tiers of:
- Claude.ai free (daily message limit)
- ChatGPT free (usage caps)
- Cursor free (50 premium requests/month)
- GitHub Copilot free (if available through your account)
- Any other AI tool you prefer

**Total cost to complete this assessment: $0**

---

## SEED DATA — PATIENTS

Load these 10 patients into your app. Your demo uses Patients 1, 3, 7, 8 specifically.

```
PATIENT 1 (Demo): 65M | Meds: Metformin 1g BD, Glimepiride 2mg OD, Telmisartan 40mg OD, Atorvastatin 20mg HS | Allergy: Penicillin (ANAPHYLAXIS 2023) | Cr 2.1, eGFR 31.2, HbA1c 8.4, K+ 5.1, Trop 4.8 | HR 110, BP 90/60, SpO2 94%

PATIENT 2: 58F | Meds: Enoxaparin 40mg SC, Paracetamol 1g QDS, Tramadol 50mg TDS, Pantoprazole 40mg | Allergy: NKDA | Cr 0.9, eGFR 82, Hb 10.2

PATIENT 3 (Demo): 78M | Meds: Amlodipine 10mg, Telmisartan 80mg, Metformin 500mg BD, Glimepiride 1mg, Atorvastatin 40mg, Aspirin 75mg, Pantoprazole 20mg, Escitalopram 10mg, Tamsulosin 0.4mg, Paracetamol PRN, Diclofenac PRN (OTC), Calcium+D3 | Allergy: Sulfonamide (rash) | Cr 1.4, eGFR 48, K+ 4.8

PATIENT 4: 6yo, 20kg | Meds: Sodium Valproate 200mg BD, Levetiracetam 250mg BD | Allergy: NKDA | Valproate level 85

PATIENT 5: 62M | Meds: Furosemide 80mg BD, Carvedilol 12.5mg BD, Amlodipine 5mg, Erythropoietin weekly, Calcium 500mg TDS | Allergy: ACE inhibitors (angioedema) | Cr 4.8, eGFR 12, K+ 5.6

PATIENT 6: 28F, 32 weeks pregnant | Meds: Methyldopa 250mg TDS, Folic acid 5mg, Iron 200mg | Allergy: Codeine (nausea) | Hb 10.8, Cr 0.6

PATIENT 7 (Demo): 35F ICU | Meds: Meropenem 1g IV TDS, Noradrenaline, Insulin infusion, Enoxaparin 40mg, Pantoprazole 40mg IV | Allergy: Penicillin (rash, NOT anaphylaxis) | Cr 3.2, eGFR 18, WBC 22, Lactate 4.8 | HR 118, BP 85/50, SpO2 92%, RR 28, Temp 39.2

PATIENT 8 (Demo): 68M | Meds: Warfarin 5mg, Bisoprolol 5mg, Ramipril 5mg, Atorvastatin 80mg, Furosemide 40mg, Spironolactone 25mg | Allergy: NKDA | Conditions: AF, HF (EF 35%), HTN, T2DM, Previous TIA (2022) | INR 2.8, eGFR 62, K+ 4.9, BNP 450

PATIENT 9: 55M | Meds: Metformin 1g BD, Empagliflozin 10mg, Insulin Glargine 24U, Pregabalin 150mg BD, Duloxetine 60mg, Aspirin 75mg | Allergy: Metoclopramide (dystonia) | Cr 1.0, eGFR 72, HbA1c 7.8

PATIENT 10: 10yo, 35kg | Meds: Salbutamol PRN, Fluticasone 125μg BD, Montelukast 5mg | Allergy: Aspirin (bronchospasm) | FEV1 78%
```

## SEED DATA — 50 DRUGS (Load into Supabase)

| Generic Name | Drug Class | Key Renal Dosing Rule |
|---|---|---|
| Metformin | biguanide | eGFR <30: contraindicated |
| Glimepiride | sulfonylurea | eGFR <30: avoid |
| Empagliflozin | sglt2i | eGFR <20: avoid |
| Insulin Glargine | insulin | Reduce as eGFR declines |
| Atorvastatin | statin | No adjustment |
| Rosuvastatin | statin | eGFR <30: start low |
| Amlodipine | ccb | No adjustment |
| Telmisartan | arb | Monitor K+ in CKD |
| Ramipril | ace_inhibitor | eGFR <30: reduce |
| Lisinopril | ace_inhibitor | eGFR <30: reduce |
| Furosemide | loop_diuretic | Higher doses in CKD |
| Spironolactone | k_sparing_diuretic | eGFR <30: avoid |
| Bisoprolol | beta_blocker | No significant adjustment |
| Carvedilol | beta_blocker | No adjustment |
| Aspirin | antiplatelet | No adjustment |
| Clopidogrel | antiplatelet | No adjustment |
| Ticagrelor | antiplatelet | No adjustment |
| Warfarin | vka | No adjustment; monitor INR |
| Rivaroxaban | doac | eGFR 15-49: 15mg; <15: avoid |
| Apixaban | doac | eGFR <25: reduce |
| Enoxaparin | lmwh | eGFR <30: once daily |
| Amoxicillin | penicillin | eGFR <30: reduce frequency |
| Amoxicillin-Clavulanate | penicillin | eGFR <30: reduce frequency |
| Ampicillin | penicillin | eGFR <30: reduce frequency |
| Clarithromycin | macrolide | eGFR <30: reduce 50% |
| Azithromycin | macrolide | No adjustment |
| Levofloxacin | fluoroquinolone | eGFR <50: adjust |
| Ciprofloxacin | fluoroquinolone | eGFR <30: reduce 50% |
| Meropenem | carbapenem | eGFR <26: reduce |
| Ceftriaxone | cephalosporin_3rd | No adjustment |
| Cefazolin | cephalosporin_1st | eGFR <35: reduce |
| Nitrofurantoin | nitrofuran | eGFR <30: avoid |
| Co-trimoxazole | sulfonamide | eGFR <15: avoid |
| Gabapentin | gabapentinoid | eGFR 30-60: 50%; 15-30: 100mg OD |
| Pregabalin | gabapentinoid | eGFR 30-60: reduce; 15-30: 75% less |
| Escitalopram | ssri | No significant adjustment |
| Fluoxetine | ssri | No adjustment |
| Duloxetine | snri | eGFR <30: avoid |
| Tramadol | opioid | eGFR <30: reduce |
| Morphine | opioid | eGFR <30: reduce (metabolites) |
| Fentanyl | opioid | Preferred in CKD |
| Paracetamol | analgesic | No adjustment |
| Diclofenac | nsaid | Avoid in CKD |
| Ibuprofen | nsaid | Avoid in CKD |
| Pantoprazole | ppi | No adjustment |
| Omeprazole | ppi | No adjustment |
| Tamsulosin | alpha_blocker | No adjustment |
| Digoxin | cardiac_glycoside | eGFR <30: reduce, monitor levels |
| Phenytoin | anticonvulsant | Complex in CKD |
| Sodium Valproate | anticonvulsant | No significant adjustment |

## SEED DATA — 30 DRUG INTERACTIONS

| Drug A | Drug B | Severity | Mechanism → Effect |
|---|---|---|---|
| Clarithromycin | Atorvastatin | SEVERE | CYP3A4 → 4-5x statin → rhabdomyolysis |
| Clarithromycin | Rosuvastatin | MODERATE | Weak CYP3A4 → monitor myopathy |
| Clarithromycin | Amlodipine | MODERATE | CYP3A4 → hypotension |
| Clarithromycin | Warfarin | SEVERE | CYP → increased INR → bleeding |
| Ciprofloxacin | Warfarin | MODERATE | CYP1A2 → increased INR |
| Fluoxetine | Tramadol | SEVERE | Serotonin syndrome → death risk |
| Escitalopram | Tramadol | MODERATE | Serotonin risk → monitor |
| Diclofenac | Telmisartan | SEVERE | Nephrotoxicity "triple whammy" |
| Diclofenac | Ramipril | SEVERE | Nephrotoxicity "triple whammy" |
| Ibuprofen | Aspirin | MODERATE | Reduced antiplatelet effect |
| Warfarin | Aspirin | SEVERE | Additive → major hemorrhage |
| Spironolactone | Ramipril | MODERATE | Hyperkalemia → cardiac arrest |
| Spironolactone | Telmisartan | MODERATE | Hyperkalemia |
| Digoxin | Amiodarone | SEVERE | Reduced clearance → toxicity |
| Metformin | Contrast dye | MODERATE | Lactic acidosis risk |
| Phenytoin | Sodium Valproate | MODERATE | Altered metabolism |
| Duloxetine | Tramadol | SEVERE | Serotonin syndrome |
| Clopidogrel | Omeprazole | MODERATE | CYP2C19 → reduced antiplatelet |
| Clopidogrel | Pantoprazole | MINOR | Weak CYP2C19 (pantoprazole preferred) |
| Rivaroxaban | Clarithromycin | SEVERE | P-gp+CYP3A4 → bleeding |
| Apixaban | Clarithromycin | MODERATE | P-gp+CYP3A4 → increased levels |
| Simvastatin | Amlodipine | MODERATE | CYP3A4 → limit simvastatin 20mg |
| Methotrexate | Co-trimoxazole | SEVERE | Antifolate → pancytopenia |
| Carbamazepine | Clarithromycin | SEVERE | CYP3A4 → carbamazepine toxicity |
| Theophylline | Ciprofloxacin | SEVERE | CYP1A2 → seizures |
| Escitalopram | Ondansetron | MODERATE | Additive QT → Torsades |
| Metformin | Furosemide | MINOR | Lactic acidosis risk in CKD |
| Morphine | Escitalopram | MINOR | CNS depression |
| Pregabalin | Morphine | MODERATE | CNS+respiratory depression |
| Lithium | Diclofenac | SEVERE | Reduced clearance → toxicity |

## ALLERGY CROSS-REACTIVITY

| Allergy To | Cross-Reacts With | Rate | Guidance |
|---|---|---|---|
| Penicillin | Amoxicillin, Ampicillin | 100% | Same class — DIRECT MATCH |
| Penicillin | Cephalosporin 1st gen | 1-2% | Avoid if anaphylaxis |
| Penicillin | Cephalosporin 3rd gen | <0.5% | Use with caution |
| Penicillin | Carbapenem | <1% | Generally safe |
| Sulfonamide | Co-trimoxazole | 100% | Same class |
| ACE inhibitor | Other ACE inhibitors | 100% | Angioedema risk |
| ACE inhibitor | ARBs | 0% | ARBs are SAFE |
| NSAID/Aspirin | All NSAIDs | Variable | Avoid ALL in aspirin-exacerbated |

## CALCULATOR FORMULAS

**eGFR (CKD-EPI 2021):**
```
Female: kappa=0.7, alpha=-0.241, multiplier=1.012
Male:   kappa=0.9, alpha=-0.302, multiplier=1.0
eGFR = 142 × min(Scr/kappa,1)^alpha × max(Scr/kappa,1)^(-1.200) × 0.9938^age × multiplier
```

**CHA₂DS₂-VASc:** C(HF)+1, H(HTN)+1, A₂(≥75)+2, D(DM)+1, S₂(Stroke/TIA)+2, V(vascular)+1, A(65-74)+1, Sc(female)+1. Max=9. ≥2 male or ≥3 female → anticoagulation recommended.
