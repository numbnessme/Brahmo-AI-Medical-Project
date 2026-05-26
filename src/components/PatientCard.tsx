import React from 'react';
import { Patient } from '../lib/types';

interface PatientCardProps {
  patient: Patient;
  isSelected: boolean;
  onClick: () => void;
}

export const PatientCard: React.FC<PatientCardProps> = ({ patient, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '14px',
        textAlign: 'left',
        borderRadius: '12px',
        border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
        backgroundColor: isSelected ? '#f0f6ff' : 'white',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        width: '100%',
        display: 'block',
      }}
    >
      <div style={{ fontSize: '14px', fontWeight: isSelected ? 600 : 500, color: isSelected ? '#1e40af' : '#1e293b' }}>
        {patient.name}
      </div>
      <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
        Age: {patient.age} • {patient.gender.toUpperCase()}
      </div>
    </button>
  );
};
