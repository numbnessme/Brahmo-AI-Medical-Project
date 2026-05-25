# Brahmo Drug Safety Engine 🩺🚀

An enterprise-grade, deterministic clinical validation engine designed to act as a fail-safe gatekeeper between medical practitioners and Large Language Models (LLMs). Built to power safe computer-aided prescription workflows, this system intercepts clinical queries, calculates critical patient risk metrics, and enforces strict, non-overridable safety guardrails directly within the LLM pipeline.

## 🌟 Core Features

- **Deterministic Evaluation Layer:** Bypasses unpredictable AI heuristics to run native, type-safe database validation loops on drug safety criteria *before* prompts reach the LLM.
- **Drug-Drug Interaction (DDI) Screening:** Dynamically references a PostgreSQL matrix to flag multi-tier severity pairs (`CONTRAINDICATED`, `SEVERE`, `MODERATE`, `MINOR`) along with clinical mechanisms and management advice.
- **Bi-directional Allergy Cross-Reactivity Mapping:** Tracks deep structural drug class relationships (e.g., historical Penicillin anaphylaxis flags vs. 1st-Gen Cephalosporins) rather than relying on primitive text-matching.
- **Strict Renal Dosing Guardrails:** Automatically executes the official **CKD-EPI (2021)** equation to evaluate real-time kidney performance against structured database threshold configurations.
- **"Triple Whammy" Polypharmacy Interceptor:** An advanced safety innovation that flags and hard-blocks the simultaneous prescription of an **NSAID/Antiplatelet + ACE Inhibitor/ARB + Diuretic**, preventing acute kidney injury (AKI).
- **Side-by-Side LLM Evaluation Layout:** Compares a generic AI response directly against a safety-enhanced AI response (powered by xAI Grok) that has deterministic constraints forced into its system prompt.

---

## 🛠️ Architecture & Data Flow

The Drug Safety Engine operates as a high-availability pipeline split into four clear operational stages:

1. **Sanitization:** Standardizes messy clinician inputs into uniform, lowercase normalized search strings to prevent query drops.
2. **Deterministic Processing:** Executes local math and Supabase relational lookups using a zero-dependency local codebase.
3. **Context Compilation:** Prioritizes active alerts by severity weights and auto-generates defensive instruction text strings.
4. **Grok Pipeline Enforcement:** Injecting the constraint matrix directly into the Grok System Prompt to mandate standard refusal and validation thresholds.

---

## 🧪 Technical Audit: Mathematical Verification

During formal integration testing and unit simulation of the isolated mathematical calculator layer, a baseline mismatch was identified within the initial assessment instructions. The project manual anticipated an eGFR output of 31.2 for Patient 1 and 18.0 for Patient 7. 

A rigorous validation of the standard **CKD-EPI (2021)** equation proves that the deterministic engine calculates kidney function with exact precision, yielding the following verified outputs:

* **Patient 1 (65, Female, Creatinine 2.1):** Evaluates precisely to **25.7 mL/min/1.73m²**.
* **Patient 7 (35, Female, Creatinine 3.2):** Evaluates precisely to **18.7 mL/min/1.73m²**.

The system logic has been intentionally configured to prioritize these exact mathematical standards over rough guideline estimations to ensure absolute medical accuracy.

---

## ⚙️ Environment Setup

### Prerequisites
- **Node.js** (v18+)
- **Supabase Account** (PostgreSQL cloud hosting)
- **xAI Console Account** (Grok API access key)

### Installation Steps

1. **Clone the Repository:**
   ```bash
   git clone [https://github.com/your-username/brahmo-drug-safety.git](https://github.com/your-username/brahmo-drug-safety.git)
   cd brahmo-drug-safety
