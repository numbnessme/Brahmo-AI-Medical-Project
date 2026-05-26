import React, { useState } from 'react';
import { useDrugSafety } from '../context/DrugSafetyContext';

export const ResponseComparison: React.FC = () => {
  const { runSafetyPipeline, callLiveAI } = useDrugSafety();
  const [candidateDrug, setCandidateDrug] = useState('');
  const [doctorQuestion, setDoctorQuestion] = useState('');
  const [genericOutput, setGenericOutput] = useState('');
  const [enhancedOutput, setEnhancedOutput] = useState('');
  const [injectedPromptView, setInjectedPromptView] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateDrug.trim()) return;

    setIsLoading(true);
    setGenericOutput('Requesting unconstrained stream model...');
    setEnhancedOutput('Applying safety-constrained deterministic shields...');
    setInjectedPromptView('');

    try {
      // 1. Run database deterministic query checks
      const safetyResult = await runSafetyPipeline(candidateDrug);
      setInjectedPromptView(safetyResult.systemConstraintText);

      // 2. Trigger concurrent live AI queries side-by-side
      const [genericRes, shieldedRes] = await Promise.all([
        callLiveAI(candidateDrug, doctorQuestion, safetyResult.systemConstraintText, 'GENERIC'),
        callLiveAI(candidateDrug, doctorQuestion, safetyResult.systemConstraintText, 'SHIELDED')
      ]);

      setGenericOutput(genericRes);
      setEnhancedOutput(shieldedRes);
      setIsLoading(false);

    } catch (err) {
      console.error(err);
      setGenericOutput("Failed to run orchestration query.");
      setEnhancedOutput("Failed to run orchestration query.");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleConsultation} className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Target New Medication</label>
            <input
              type="text"
              required
              placeholder="e.g., Clarithromycin"
              value={candidateDrug}
              onChange={(e) => setCandidateDrug(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Clinical Context / Query</label>
            <input
              type="text"
              placeholder="e.g., Patient has a lung infection. Can we add this to his treatment?"
              value={doctorQuestion}
              onChange={(e) => setDoctorQuestion(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
        <div style={{ padding: '16px', fontSize: '13.5px', color: '#0f172a', lineHeight: '1.6', whiteSpace: 'pre-wrap', backgroundColor: '#fafcff', fontWeight: 500 }}>
          {enhancedOutput}
        </div>
      </div>
    </div>
  );
};