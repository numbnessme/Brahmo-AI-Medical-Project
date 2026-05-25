# Clinical Data Provenance Index
This file documents the clinical evidence and guidelines used to construct the safety validation data matrix:

1. **eGFR Calculations (CKD-EPI 2021 Equation):**
   - Source: National Kidney Foundation (NKF) and American Society of Nephrology (ASN) 2021 Task Force recommendations.
   - Clinical Verification Parameters: Female ($\kappa = 0.7, \alpha = -0.241$); Male ($\kappa = 0.9, \alpha = -0.302$).

2. **CHA₂DS₂-VASc Matrix Indexing:**
   - Source: European Society of Cardiology (ESC) / American Heart Association (AHA) Atrial Fibrillation Management Guidelines.

3. **Drug-to-Drug Interactions & Severe Cross-Reactivity Parameters:**
   - Source: Structured validation mappings curated via professional clinical reference databases (Lexicomp, Micromedex, and FDA structural prescribing labels).
   - Core Mechanisms Addressed: CYP3A4 metabolic path inhibition, NSAID-RAAS triple-whammy nephrotoxicity configurations, and beta-lactam side-chain cross-sensitivity distributions. 