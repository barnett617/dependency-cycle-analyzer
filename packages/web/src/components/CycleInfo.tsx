import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { DependencyCycle } from '../utils/parser';

interface CycleInfoProps {
  cycle: DependencyCycle | null;
}

export const CycleInfo: React.FC<CycleInfoProps> = ({ cycle }) => {
  if (!cycle) return null;

  return (
    <div className="cycle-info">
      <h3>Cycle Details</h3>
      <div className="cycle-details">
        <div className="detail-item">
          <span className="label">File:</span>
          <span className="value">{cycle.file}</span>
        </div>
        <div className="detail-item">
          <span className="label">Line:</span>
          <span className="value">{cycle.line}</span>
        </div>
        <div className="detail-item">
          <span className="label">Column:</span>
          <span className="value">{cycle.column}</span>
        </div>
      </div>

      <h3>Cycle Path</h3>
      <div className="cycle-path">
        <SyntaxHighlighter
          language="javascript"
          style={tomorrow}
          customStyle={{
            margin: 0,
            padding: '1rem',
            borderRadius: '0.375rem',
            backgroundColor: '#1e293b',
          }}
        >
          {cycle.cyclePath.join(' -> ')}
        </SyntaxHighlighter>
      </div>

      {cycle.codeContext && (
        <>
          <h3>Code Context</h3>
          <div className="code-context">
            <SyntaxHighlighter
              language="javascript"
              style={tomorrow}
              customStyle={{
                margin: 0,
                padding: '1rem',
                borderRadius: '0.375rem',
                backgroundColor: '#1e293b',
              }}
            >
              {cycle.codeContext}
            </SyntaxHighlighter>
          </div>
        </>
      )}
    </div>
  );
}; 