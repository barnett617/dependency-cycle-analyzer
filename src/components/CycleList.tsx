import React from 'react';
import { DependencyCycle } from '../utils/parser';

interface CycleListProps {
  cycles: DependencyCycle[];
  selectedCycle: DependencyCycle | null;
  onCycleSelect: (cycle: DependencyCycle) => void;
}

const CycleList: React.FC<CycleListProps> = ({ cycles, selectedCycle, onCycleSelect }) => {
  return (
    <div className="cycle-list">
      <h3>Dependency Cycles ({cycles.length})</h3>
      <div className="cycle-list-container">
        {cycles.map((cycle, index) => (
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default CycleList; 