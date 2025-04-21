import React, { useState, useEffect } from 'react';
import { parseESLintOutput, DependencyCycle } from './utils/parser';
import { SyntaxHighlighter } from './components/SyntaxHighlighter';
import GraphVisualizer from './components/GraphVisualizer';
import { CycleInfo } from './components/CycleInfo';
import CycleList from './components/CycleList';
import './App.css';

const STORAGE_KEY = 'dependency-cycle-analyzer-input';
const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB limit
const WARNING_SIZE = 1 * 1024 * 1024; // 1MB warning threshold

// Compression utilities
const compressData = (data: string): string => {
  try {
    return btoa(encodeURIComponent(data));
  } catch (e) {
    console.error('Compression failed:', e);
    return data;
  }
};

const decompressData = (data: string): string => {
  try {
    return decodeURIComponent(atob(data));
  } catch (e) {
    console.error('Decompression failed:', e);
    return data;
  }
};

function App() {
  const [input, setInput] = useState(() => {
    try {
      const savedInput = localStorage.getItem(STORAGE_KEY);
      return savedInput ? decompressData(savedInput) : '';
    } catch (e) {
      console.error('Failed to load saved input:', e);
      return '';
    }
  });
  const [cycles, setCycles] = useState<DependencyCycle[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<DependencyCycle | null>(null);
  const [showSizeWarning, setShowSizeWarning] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  // Save input to localStorage whenever it changes
  useEffect(() => {
    try {
      if (input) {
        const compressedData = compressData(input);
        if (compressedData.length > MAX_STORAGE_SIZE) {
          setStorageError('Input is too large to save. Your changes will be lost on refresh.');
          return;
        }
        
        setShowSizeWarning(compressedData.length > WARNING_SIZE);
        localStorage.setItem(STORAGE_KEY, compressedData);
        setStorageError(null);
      } else {
        localStorage.removeItem(STORAGE_KEY);
        setShowSizeWarning(false);
        setStorageError(null);
      }
    } catch (e) {
      console.error('Failed to save input:', e);
      setStorageError('Failed to save input. Your changes will be lost on refresh.');
    }
  }, [input]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    if (value) {
      const parsedCycles = parseESLintOutput(value);
      setCycles(parsedCycles);
      if (parsedCycles.length > 0) {
        setSelectedCycle(parsedCycles[0]);
      }
    } else {
      setCycles([]);
      setSelectedCycle(null);
    }
  };

  const handleClear = () => {
    setInput('');
    setCycles([]);
    setSelectedCycle(null);
    localStorage.removeItem(STORAGE_KEY);
    setShowSizeWarning(false);
    setStorageError(null);
  };

  // Parse cycles from saved input on initial load
  useEffect(() => {
    if (input) {
      const parsedCycles = parseESLintOutput(input);
      setCycles(parsedCycles);
      if (parsedCycles.length > 0) {
        setSelectedCycle(parsedCycles[0]);
      }
    }
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1>Dependency Cycle Analyzer</h1>
        <p>Visualize and analyze dependency cycles in your codebase</p>
      </header>

      <div className="main-content">
        <div className="input-section">
          <div className="input-header">
            <h2>Paste ESLint Output</h2>
            {input && (
              <button onClick={handleClear} className="clear-button">
                Clear Input
              </button>
            )}
          </div>
          {showSizeWarning && (
            <div className="warning-message">
              Warning: Large input may affect performance
            </div>
          )}
          {storageError && (
            <div className="error-message">
              {storageError}
            </div>
          )}
          <textarea
            value={input}
            onChange={handleInputChange}
            placeholder="Paste your ESLint output here..."
            className="input-area"
          />
        </div>

        {cycles.length > 0 ? (
          <div className="visualization-section">
            <div className="graph-container">
              <GraphVisualizer
                cycles={cycles}
                selectedCycle={selectedCycle}
                onCycleSelect={setSelectedCycle}
              />
            </div>
            <div className="cycle-list">
              <CycleList
                cycles={cycles}
                selectedCycle={selectedCycle}
                onCycleSelect={setSelectedCycle}
              />
            </div>
            {selectedCycle && (
              <div className="details-container">
                <CycleInfo cycle={selectedCycle} />
              </div>
            )}
          </div>
        ) : (
          <div className="demo-section">
            <h2>Example ESLint Output</h2>
            <SyntaxHighlighter
              code={`warning: Dependency cycle detected (import/no-cycle) at src/components/contentDropMenu/index.vue:64:1:
  62 | import { eventBus } from '@/manager/eventManager';
  63 | import Item from './menuItem.vue';
64 | import { ContentMenuData } from '.';
     | ^`}
            />
          </div>
        )}
      </div>

      <footer className="footer">
        <p>Built with React, TypeScript, and vis-network</p>
      </footer>
    </div>
  );
}

export default App; 