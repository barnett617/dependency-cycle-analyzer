import React, { useState } from 'react';
import { DependencyGraph } from './components/DependencyGraph';
import { parseESLintOutput } from './utils/parser';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const App: React.FC = () => {
  const [cycles, setCycles] = useState<ReturnType<typeof parseESLintOutput>>([]);
  const [inputText, setInputText] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value;
    setInputText(text);
    const parsedCycles = parseESLintOutput(text);
    setCycles(parsedCycles);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Dependency Cycle Analyzer</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Input ESLint Output</h2>
        <textarea
          value={inputText}
          onChange={handleFileUpload}
          style={{
            width: '100%',
            height: '200px',
            padding: '10px',
            fontFamily: 'monospace',
            marginBottom: '20px'
          }}
          placeholder="Paste your ESLint output here..."
        />
      </div>

      {cycles.length > 0 ? (
        <>
          <h2>Dependency Cycles</h2>
          <DependencyGraph cycles={cycles} />
          
          <h2>Cycle Details</h2>
          {cycles.map((cycle, index) => (
            <div key={index} style={{ marginBottom: '20px' }}>
              <h3>Cycle {index + 1}</h3>
              <p>File: {cycle.file}</p>
              <p>Line: {cycle.line}, Column: {cycle.column}</p>
              <div style={{ marginTop: '10px' }}>
                <SyntaxHighlighter language="javascript" style={tomorrow}>
                  {cycle.cyclePath.join(' -> ')}
                </SyntaxHighlighter>
              </div>
            </div>
          ))}
        </>
      ) : (
        <p>No dependency cycles found. Paste your ESLint output above to analyze.</p>
      )}
    </div>
  );
};

export default App; 