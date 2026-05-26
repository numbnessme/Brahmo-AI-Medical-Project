import React from 'react';
import { useDrugSafety } from '../context/DrugSafetyContext';

export const SafetyAlerts: React.FC = () => {
  const { activeAlerts, isProcessingCheck } = useDrugSafety();

  if (isProcessingCheck) {
    return (
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm text-center">
        <div className="inline-block animate-spin rounded-full h-5 w-5 border-b2 border-blue-600 mr-2 vertical-middle" />
        <span className="text-sm font-medium text-slate-600">Running safety checks against database engine...</span>
      </div>
    );
  }

  if (activeAlerts.length === 0) {
    return (
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
        <span className="text-xl">✅</span>
        <div>
          <h5 className="text-sm font-bold text-emerald-800">Deterministic Guardrails Clear</h5>
          <p className="text-xs text-emerald-600">No active blocks or dosing adjustments detected for this drug entry.</p>
        </div>
      ))}
    </div>
  );
};
