import React from 'react';

interface ResponseComparisonProps {
  genericOutput: string;
  enhancedOutput: string;
}

export const ResponseComparison: React.FC<ResponseComparisonProps> = ({ genericOutput, enhancedOutput }) => {
  return (
    <div className="ai-twin-split">
      <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.01)', border: '1px solid #e2e8f0' }}>
        <div style={{ backgroundColor: '#f1f5f9', padding: '12px 16px', borderBottom: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569' }}>Generic Model Output</span>
        </div>
        <div style={{ padding: '16px', fontSize: '13.5px', color: '#475569', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
          {genericOutput}
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(37,99,235,0.06)', border: '1px solid #bfdbfe' }}>
        <div style={{ backgroundColor: '#2563eb', padding: '12px 16px', borderBottom: '1px solid #bfdbfe' }}>
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'white' }}>Brahmo Shield Output</span>
        </div>
        <div style={{ padding: '16px', fontSize: '13.5px', color: '#0f172a', lineHeight: '1.6', whiteSpace: 'pre-wrap', backgroundColor: '#fafcff', fontWeight: 500 }}>
          {enhancedOutput}
        </div>
      </div>
    </div>
  );
};
