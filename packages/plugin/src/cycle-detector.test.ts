import { describe, it, expect } from 'vitest';
import { detectCycles } from './cycle-detector';

describe('Cycle Detection', () => {
  it('detects simple cycles', () => {
    const graph = {
      'A': ['B'],
      'B': ['C'],
      'C': ['A']
    };
    const cycles = detectCycles(graph);
    expect(cycles).toHaveLength(1);
    expect(cycles[0]).toEqual(['A', 'B', 'C', 'A']);
  });

  it('detects multiple cycles', () => {
    const graph = {
      'A': ['B'],
      'B': ['C', 'D'],
      'C': ['A'],
      'D': ['A']
    };
    const cycles = detectCycles(graph);
    expect(cycles).toHaveLength(2);
    expect(cycles).toContainEqual(['A', 'B', 'C', 'A']);
    expect(cycles).toContainEqual(['A', 'B', 'D', 'A']);
  });

  it('handles acyclic graphs', () => {
    const graph = {
      'A': ['B'],
      'B': ['C'],
      'C': []
    };
    const cycles = detectCycles(graph);
    expect(cycles).toHaveLength(0);
  });

  it('handles empty graphs', () => {
    const graph = {};
    const cycles = detectCycles(graph);
    expect(cycles).toHaveLength(0);
  });
}); 