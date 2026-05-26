import React from 'react';
import { Alert } from '../lib/types';

interface SafetyAlertsProps {
  alerts: Alert[];
}

export const SafetyAlerts: React.FC<SafetyAlertsProps> = ({ alerts }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {alerts.map((alert, idx) => (
        <div
          key={idx}
          style={{
            padding: '16px',
            borderRadius: '10px',
            backgroundColor: alert.severity === 'CRITICAL' ? '#fef2f2' : '#fffbeb',
            borderLeft: `6px solid ${alert.severity === 'CRITICAL' ? '#dc2626' : '#d97706'}`,
            borderTop: '1px solid #f1f5f9',
            borderRight: '1px solid #f1f5f9',
            borderBottom: '1px solid #f1f5f9',
          }}
        >
          <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold', color: '#0f172a' }}>
            {alert.title}
          </h4>
          <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#334155', lineHeight: 1.5 }}>
            {alert.message}
          </p>
        </div>
      ))}
    </div>
  );
};
