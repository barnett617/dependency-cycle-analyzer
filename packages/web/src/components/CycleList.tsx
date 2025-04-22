import React, { useState, useMemo } from 'react';
import { DependencyCycle } from '../utils/parser';

interface CycleListProps {
  cycles: DependencyCycle[];
  selectedCycle: DependencyCycle | null;
  onCycleSelect: (cycle: DependencyCycle) => void;
}

const CycleList: React.FC<CycleListProps> = ({ cycles, selectedCycle, onCycleSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'length' | 'alphabetical'>('length');

  const filteredCycles = useMemo(() => {
    let result = cycles;

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(cycle => 
        cycle.cyclePath.some(node => node.toLowerCase().includes(term)) ||
        cycle.file.toLowerCase().includes(term)
      );
    }

    // Sort cycles
    if (sortBy === 'length') {
      result.sort((a, b) => b.cyclePath.length - a.cyclePath.length);
    } else {
      result.sort((a, b) => {
        const pathA = a.cyclePath.join(' → ');
        const pathB = b.cyclePath.join(' → ');
        return pathA.localeCompare(pathB);
      });
    }

    return result;
  }, [cycles, searchTerm, sortBy]);

  return (
    <div className="cycle-list">
      <div className="cycle-list-header">
        <h3>Dependency Cycles ({cycles.length})</h3>
        <div className="search-controls">
          <input
            type="text"
            placeholder="Search cycles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'length' | 'alphabetical')}
            className="sort-select"
          >
            <option value="length">Sort by Length</option>
            <option value="alphabetical">Sort Alphabetically</option>
          </select>
        </div>
      </div>
      <div className="cycle-list-container">
        {filteredCycles.length === 0 ? (
          <div className="no-results">
            No cycles found matching your search criteria
          </div>
        ) : (
          filteredCycles.map((cycle, index) => (
            <div
              key={index}
              className={`cycle-item ${selectedCycle === cycle ? 'selected' : ''}`}
              onClick={() => onCycleSelect(cycle)}
            >
              <div className="cycle-item-header">
                <span className="cycle-index">Cycle {index + 1}</span>
                <span className="cycle-length">({cycle.cyclePath.length} nodes)</span>
              </div>
              <div className="cycle-path">
                {cycle.cyclePath.join(' → ')}
              </div>
              <div className="cycle-file">
                {cycle.file}:{cycle.line}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CycleList; 