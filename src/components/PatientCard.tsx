import React from 'react';
import { useDrugSafety } from '../context/DrugSafetyContext';

export const PatientCard: React.FC = () => {
  const { patients, selectedPatient, setSelectedPatient, currentEGFR, currentChadsVasc } = useDrugSafety();

  if (!selectedPatient) return <div className="p-4 bg-slate-100 animate-pulse rounded-xl" />;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* Patient Selection Header */}
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Active Clinical Profile
          </label>
          <select
            value={selectedPatient.id}
            onChange={(e) => {
              const patient = patients.find(p => p.id === e.target.value);
              if (patient) setSelectedPatient(patient);
            }}
            className="block w-full sm:w-64 rounded-lg border-slate-300 text-sm font-medium text-slate-800 bg-white border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Dynamic Mathematical Telemetry Highlights */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg text-center">
            <span className="block text-[10px] font-bold text-indigo-500 uppercase">eGFR (CKD-EPI)</span>
            <span className={`text-base font-bold ${currentEGFR < 30 ? 'text-red-600' : 'text-indigo-700'}`}>
              {currentEGFR}
            </span>
          </div>
          <div className="px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-lg text-center">
            <span className="block text-[10px] font-bold text-amber-500 uppercase">CHA₂DS₂-VASc</span>
            <span className="text-base font-bold text-amber-700">{currentChadsVasc}</span>
          </div>
        </div>
      </div>

      {/* Structured Clinical Vitals Grid */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        {/* Meds Column */}
        <div>
          <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
            📦 Active Regimen ({selectedPatient.medications.length})
          </h4>
          <ul className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100 max-h-36 overflow-y-auto">
            {selectedPatient.medications.map((med, idx) => (
              <li key={idx} className="text-slate-600 text-xs font-medium flex items-center gap-1">
                <span className="text-blue-500">•</span> {med}
              </li>
            ))}
          </ul>
        </div>

        {/* Allergies Column */}
        <div>
          <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
            ⚠️ Documented Allergies
          </h4>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 min-h-[72px]">
            {selectedPatient.allergies.length === 0 ? (
              <span className="text-xs text-slate-400 italic">No Known Drug Allergies (NKDA)</span>
            ) : (
              <div className="space-y-2">
                {selectedPatient.allergies.map((allergy, idx) => (
                  <div key={idx} className="p-1.5 bg-red-50 border border-red-100 rounded text-xs">
                    <span className="font-bold text-red-700">{allergy.allergen}</span> 
                    <span className="text-red-600 block italic text-[11px]">{allergy.manifestation}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Labs & Active Pathologies Column */}
        <div>
          <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
            🧪 Laboratory Assays & States
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-slate-50 border border-slate-100 rounded">
              <span className="text-slate-500 block">Serum Creatinine</span>
              <span className="font-semibold text-slate-700">{selectedPatient.labs.creatinine} mg/dL</span>
            </div>
            {selectedPatient.labs.hba1c && (
              <div className="p-2 bg-slate-50 border border-slate-100 rounded">
                <span className="text-slate-500 block">HbA1c Metric</span>
                <span className="font-semibold text-slate-700">{selectedPatient.labs.hba1c}%</span>
              </div>
            )}
            <div className="p-2 col-span-2 bg-slate-50 border border-slate-100 rounded flex flex-wrap gap-x-2">
              <span className="text-slate-500 w-full block">Comorbidities:</span>
              {Object.entries(selectedPatient.conditions)
                .filter(([_, value]) => value === true)
                .map(([key]) => (
                  <span key={key} className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase mt-1">
                    {key.replace('has', '')}
                  </span>
                ))}
              {/* Fallback if no comorbidities are tracking true */}
              {Object.values(selectedPatient.conditions).every(v => !v) && (
                <span className="text-slate-400 italic">No cardiovascular tracking data notes.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};