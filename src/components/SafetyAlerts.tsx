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
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activeAlerts.map((alert, idx) => (
        <div key={idx} className={`p-4 border rounded-xl flex items-start gap-3 ${alert.severity === 'CRITICAL' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
          <span className="text-xl">{alert.severity === 'CRITICAL' ? '⛔' : '⚠️'}</span>
          <div>
            <h5 className={`text-sm font-bold ${alert.severity === 'CRITICAL' ? 'text-red-800' : 'text-amber-800'}`}>{alert.title}</h5>
            <p className={`text-xs mt-1 ${alert.severity === 'CRITICAL' ? 'text-red-600' : 'text-amber-700'}`}>{alert.message}</p>
            {alert.overrideStrategy && (
              <p className={`text-xs mt-2 font-semibold ${alert.severity === 'CRITICAL' ? 'text-red-700' : 'text-amber-700'}`}>Strategy: {alert.overrideStrategy}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
