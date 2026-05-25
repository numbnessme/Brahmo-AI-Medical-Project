# Hybrid Clinical AI Architecture - Architecture Notes
### System Design Framework: Doctor BRAHMO Safe Intercept Engine

### 1. Separation of Concerns & Guardrail Flow
Our system implements a deterministic framework that completely isolates safety calculations from the probabilistic reasoning of Large Language Models (LLMs). 
- **Deterministic Layer (~30ms):** Executes structured queries across heavily indexed relational parameters in Supabase. Computes precise metrics (eGFR via CKD-EPI 2021) and detects 100% of recorded interactions.
- **Probabilistic Layer:** Generates clinical conversational responses but operates within a strictly bounded workspace. It cannot override or hallucinate past system-enforced constraints.

### 2. High-Performance Caching & DDI Scale Strategies
- **Time Complexity Optimization:** A patient regimen with $N$ active medications requires $N$ database lookups to check for pairwise interactions. To ensure sub-100ms processing times as scales hit higher bounds, we leverage indexing on `generic_name_normalized`.
- **Extensibility:** The system avoids hardcoded strings. Injecting a new medication or interaction requires a single row transaction inside Supabase, which is picked up immediately by the system wrapper hooks.