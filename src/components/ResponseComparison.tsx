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
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm py-2 px-4 rounded-lg shadow transition-all disabled:opacity-50"
        >
          {isLoading ? 'Processing Pipeline Routing Tokens...' : '⚡ Run Split Live AI Consultation'}
        </button>
      </form>

      {injectedPromptView && (
        <div className="bg-slate-900 text-slate-200 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-48 border border-slate-800">
          <span className="text-indigo-400 font-bold block mb-1">// SYSTEM PROMPT CONSTRAINT PRE-PENDED PAYLOAD (ANONYMIZED ON WAN TRANSMISSION):</span>
          {injectedPromptView}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[300px]">
          <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase">Generic LLM Response (No Guardrails)</span>
            <span className="bg-red-100 text-red-800 text-[9px] font-extrabold px-2 py-0.5 rounded uppercase">Probabilistic</span>
          </div>
          <div className="p-4 flex-1 text-xs text-slate-600 leading-relaxed bg-slate-50/50 whitespace-pre-wrap">
            {genericOutput}
          </div>
        </div>

        <div className="bg-white border border-blue-200 rounded-xl shadow-sm overflow-hidden flex flex-col min-h-[300px]">
          <div className="bg-blue-600 px-4 py-2 text-white flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wide">Brahmo Safety-Enhanced Response</span>
            <span className="bg-blue-500 text-white text-[9px] font-extrabold px-2 py-0.5 rounded border border-blue-400 uppercase">Deterministic Shielded</span>
          </div>
          <div className="p-4 flex-1 text-xs text-slate-800 leading-relaxed bg-white whitespace-pre-wrap border-t border-blue-100">
            {enhancedOutput}
          </div>
        </div>
      </div>
    </div>
  );
};
