import { useState } from 'react';
import { useDrugSafety, DrugSafetyProvider } from './context/DrugSafetyContext';
import { ASSESSMENT_PATIENTS } from './lib/mock-patients';

function DashboardContent() {
  const { 
    patients, 
    selectedPatient, 
    setSelectedPatient, 
    activeAlerts, 
    isProcessingCheck, 
    runSafetyPipeline,
    callLiveAI,
    currentEGFR,
    currentChadsVasc 
  } = useDrugSafety();

  const [drugInput, setDrugInput] = useState('');
  const [doctorQuestion, setDoctorQuestion] = useState('');
  const [genericOutput, setGenericOutput] = useState('');
  const [enhancedOutput, setEnhancedOutput] = useState('');
  const [simulationResult, setSimulationResult] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Clean form submit pipeline handling true React synthetic events
  const handleCheckSafety = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!drugInput.trim()) return;

    setIsAiLoading(true);
    setGenericOutput('Querying unshielded probabilistic model streams...');
    setEnhancedOutput('Evaluating safety-shielded abstract constraint prompt boundary tokens...');
    setSimulationResult('Processing... Please check live viewport streams below.');

    try {
      // 1. Run local/database deterministic guardrails
      const result = await runSafetyPipeline(drugInput);
      setSimulationResult(result.systemConstraintText);

      // 2. Fire concurrent API proxy calls directly to your OpenAI key
      const [genericRes, shieldedRes] = await Promise.all([
        callLiveAI(drugInput, doctorQuestion || "Is it safe?", result.systemConstraintText, 'GENERIC'),
        callLiveAI(drugInput, doctorQuestion || "Is it safe?", result.systemConstraintText, 'SHIELDED')
      ]);

      setGenericOutput(genericRes);
      setEnhancedOutput(shieldedRes);

    } catch (err) {
      console.error(err);
      setGenericOutput("Failed to fulfill remote completions gateway handshake.");
      setEnhancedOutput("Failed to fulfill remote completions gateway handshake.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#1e293b' }}>
      
      {/* HARDWARE-ACCELERATED CSS ANIMATIONS & GRAPHICS OVERRIDES */}
      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes statusPulse {
          0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); }
          70% { box-shadow: 0 0 0 12px rgba(37, 99, 235, 0); }
          100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
        }
        .animate-fade-in { animation: slideUpFade 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .patient-row-btn:hover { transform: translateY(-1px); background-color: #f8fafc !important; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
        
        /* Adaptive Multi-Device Responsive Breakpoint Framework */
        .portal-grid-wrapper { display: grid; grid-template-columns: 320px 1fr; gap: 24px; }
        .patient-stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .ai-twin-split { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        
        @media (max-width: 1024px) {
          .portal-grid-wrapper { grid-template-columns: 250px 1fr; gap: 16px; }
        }
        @media (max-width: 768px) {
          .portal-grid-wrapper { grid-template-columns: 1fr; gap: 20px; }
          .patient-stats-grid { grid-template-columns: 1fr; gap: 14px; }
          .ai-twin-split { grid-template-columns: 1fr; gap: 16px; }
        }
      `}</style>

      {/* PREMIUM TOP GLOBAL NAVIGATION BAR CONTAINER */}
      <nav style={{ backgroundColor: '#0f172a', color: 'white', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Medical Guardian Shield SVG Graphic */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 700, letterSpacing: '-0.025em' }}>
            BRAHMO <span style={{ color: '#3b82f6', fontWeight: 400 }}>Clinical Portal</span>
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#94a3b8', fontWeight: 500 }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }}></span>
          Deterministic Guardrails Active
        </div>
      </nav>

      {/* RESPONSIVE WORKING APPARATUS GRID CONTAINER */}
      <div className="portal-grid-wrapper" style={{ padding: '24px', maxWidth: '1600px', margin: '0 auto' }}>
        
        {/* LEFT SIDEBAR PANEL: PATIENT FILE REGISTRIES */}
        <div className="animate-fade-in" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.01)', border: '1px solid #e2e8f0', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <h2 style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Patient Registry</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {patients.map((p) => {
              const activeSelectionMatch = selectedPatient?.id === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  className="patient-row-btn"
                  onClick={() => {
                    setSelectedPatient(p);
                    setSimulationResult(null);
                    setDrugInput('');
                    setDoctorQuestion('');
                    setGenericOutput('');
                    setEnhancedOutput('');
                  }}
                  style={{
                    padding: '14px',
                    textAlign: 'left',
                    borderRadius: '12px',
                    border: activeSelectionMatch ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    backgroundColor: activeSelectionMatch ? '#f0f6ff' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    width: '100%',
                    display: 'block'
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: activeSelectionMatch ? 600 : 500, color: activeSelectionMatch ? '#1e40af' : '#1e293b' }}>{p.name}</div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Age: {p.age} • {p.gender.toUpperCase()}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT CONTENT DESK WORKSPACE */}
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', animationDelay: '0.05s' }}>
          {selectedPatient ? (
            <>
              {/* COMPREHENSIVE ASSESSMENT AND SUBMISSION CORE FORM */}
              <form onSubmit={handleCheckSafety} style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.01)', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f0f6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 700 }}>
                      {selectedPatient.name.charAt(0)}
                    </div>
                    <div>
                      <h2 style={{ margin: 0, color: '#0f172a', fontSize: '18px', fontWeight: 700 }}>{selectedPatient.name} Summary</h2>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Case Ref: #00{selectedPatient.id}</span>
                    </div>
                  </div>
                </div>

                {/* Patient Parameters Stats Columns */}
                <div className="patient-stats-grid" style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontSize: '14px' }}>
                      <span style={{ color: '#64748b', display: 'block', marginBottom: '2px', fontWeight: 500 }}>Current Medications</span>
                      <div style={{ color: '#1e293b', fontWeight: 500 }}>{selectedPatient.medications.join(', ') || 'No active therapy lines documented'}</div>
                    </div>
                    <div style={{ fontSize: '14px' }}>
                      <span style={{ color: '#64748b', display: 'block', marginBottom: '2px', fontWeight: 500 }}>Documented Allergies</span>
                      <div style={{ color: selectedPatient.allergies.length > 0 ? '#dc2626' : '#10b981', fontWeight: 600 }}>
                        {selectedPatient.allergies.map(a => `${a.allergen} (${a.manifestation})`).join(', ') || 'No Known Drug Allergies (NKDA)'}
                      </div>
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Physiological Baselines</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                      <span style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                        eGFR (CKD-EPI 2021):
                      </span>
                      <strong style={{ color: currentEGFR < 30 ? '#dc2626' : '#0f172a', backgroundColor: currentEGFR < 30 ? '#fef2f2' : '#f0fdf4', padding: '4px 8px', borderRadius: '6px' }}>
                        {currentEGFR} mL/min/1.73m²
                      </strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                      <span style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        CHA₂DS₂-VASc Index Score:
                      </span>
                      <strong style={{ backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '6px' }}>{currentChadsVasc}</strong>
                    </div>
                  </div>
                </div>

                {/* THE TRANSACTION ACTION PANEL */}
                <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '14px', border: '1px solid #e2e8f0', animation: 'statusPulse 2.5s infinite' }}>
                  <h3 style={{ margin: '0 0 14px 0', fontSize: '13px', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    Prescription Assessment Pipeline Request
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                    <div style={{ flex: '1 1 220px' }}>
                      <input
                        type="text"
                        required
                        value={drugInput}
                        onChange={(e) => setDrugInput(e.target.value)}
                        placeholder="Generic drug candidate name..."
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
                      />
                    </div>
                    <div style={{ flex: '2 1 320px' }}>
                      <input
                        type="text"
                        value={doctorQuestion}
                        onChange={(e) => setDoctorQuestion(e.target.value)}
                        placeholder="Clinical inquiry notes or rationale context..."
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isAiLoading || isProcessingCheck}
                    style={{ width: '100%', padding: '14px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s' }}
                  >
                    {isAiLoading ? 'Executing Multi-Layer Guardrail Boundaries...' : '⚡ Run Split Live AI Consultation'}
                  </button>
                </div>
              </form>

              {/* CORE DETERMINISTIC INTERCEPT ALERTS CARDS */}
              <div className="animate-fade-in" style={{ backgroundColor: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.01)', border: '1px solid #e2e8f0' }}>
                <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '15px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>
                  Database Intercept alerts ({activeAlerts.length})
                </h3>
                {activeAlerts.length === 0 ? (
                  <div style={{ padding: '16px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#15803d', borderRadius: '10px', fontSize: '13px', fontWeight: 500 }}>
                    ✅ Local safety lookup matching complete. No active allergy or cross-reactivity flags hit this profile.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {activeAlerts.map((alert, idx) => (
                      <div key={idx} style={{ padding: '16px', borderRadius: '10px', backgroundColor: alert.severity === 'CRITICAL' ? '#fef2f2' : '#fffbeb', borderLeft: `6px solid ${alert.severity === 'CRITICAL' ? '#dc2626' : '#f59e0b'}` }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>{alert.title}</h4>
                        <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#334155', lineHeight: 1.5 }}>{alert.message}</p>
                        <small style={{ color: '#64748b', display: 'block', fontSize: '11px', backgroundColor: 'rgba(0,0,0,0.02)', padding: '6px 10px', borderRadius: '4px' }}><strong>Strategy Protocol:</strong> {alert.overrideStrategy}</small>
                      </div>
                    ))}
                  </div>
                )}
              </div>


              {simulationResult && (
                <>
                  {/* ENVELOPE STRUCTURAL PRE-INJECTED TEXT INSIGHT */}
                  <div className="animate-fade-in" style={{ backgroundColor: '#0f172a', color: '#38bdf8', padding: '16px', borderRadius: '12px', fontFamily: 'monospace', fontSize: '12px', border: '1px solid #1e293b' }}>
                    <span style={{ color: '#64748b', display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>// CONSTRAINTS INJECTED COMPLIANCE CONTEXT MAP:</span>
                    <pre style={{ whiteSpace: 'pre-wrap', margin: 0, color: '#94a3b8' }}>{simulationResult}</pre>
                  </div>

                  <div className="ai-twin-split">
                    {/* OPTION 1: PROBABILISTIC RAW assistant PANEL */}
                    <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.01)', border: '1px solid #e2e8f0' }}>
                      <div style={{ backgroundColor: '#f1f5f9', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569' }}>Generic Model Output (No Guardrails)</span>
                        <span style={{ fontSize: '9px', fontWeight: 'bold', backgroundColor: '#fee2e2', color: '#991b1b', padding: '2px 6px', borderRadius: '4px' }}>PROBABILISTIC</span>
                      </div>
                      <div style={{ padding: '16px', fontSize: '13.5px', color: '#475569', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                        {genericOutput}
                      </div>
                    </div>

                    {/* OPTION 2: DETERMINISTIC SHIELDED PANEL */}
                    <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(37,99,235,0.06)', border: '1px solid #bfdbfe' }}>
                      <div style={{ backgroundColor: '#2563eb', padding: '12px 16px', borderBottom: '1px solid #bfdbfe', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'white' }}>Brahmo Shield Output</span>
                        <span style={{ fontSize: '9px', fontWeight: 'bold', backgroundColor: '#dbeafe', color: '#1e40af', padding: '2px 6px', borderRadius: '4px' }}>GUARDRAIL ACTIVE</span>
                      </div>
                      <div style={{ padding: '16px', fontSize: '13.5px', color: '#0f172a', lineHeight: '1.6', whiteSpace: 'pre-wrap', backgroundColor: '#fafcff', fontWeight: 500 }}>
                        {enhancedOutput}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div style={{ backgroundColor: 'white', padding: '60px 20px', borderRadius: '16px', textAlign: 'center', color: '#64748b', border: '1px solid #e2e8f0' }}>
              <h3>Registry Idle. Please click an entry in the sidebar list panel to mount diagnostics.</h3>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// 💡 SINGLE ROOT PAGE EXPORT: Fixed duplicate compilation crash errors
export default function Page() {
  return (
    <DrugSafetyProvider mockPatients={ASSESSMENT_PATIENTS}>
      <DashboardContent />
    </DrugSafetyProvider>
  );
}
