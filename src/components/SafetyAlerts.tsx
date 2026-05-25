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
      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
        ⚠️ Safety Intercept Flags ({activeAlerts.length})
      </h3>
      {activeAlerts.map((alert, index) => {
        const isCritical = alert.severity === 'CRITICAL';
        return (
          <div
            key={index}
            className={`border rounded-xl p-4 shadow-sm transition-all ${
              isCritical 
                ? 'bg-rose-50 border-rose-200 text-rose-900' 
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5">{isCritical ? '⛔' : '⚠️'}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h4 className="text-sm font-bold tracking-tight">{alert.title}</h4>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                    isCritical ? 'bg-rose-200 text-rose-800' : 'bg-amber-200 text-amber-800'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-xs mt-1 text-slate-700 leading-relaxed">{alert.message}</p>
                {alert.overrideStrategy && (
                  <div className="mt-2.5 pt-2 border-t border-dashed border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="font-bold uppercase text-slate-500">Enforcement Strategy:</span>
                    <span className={`font-mono font-bold ${isCritical ? 'text-red-700' : 'text-amber-800'}`}>
                      {alert.overrideStrategy}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};