import React, { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { DependencyCycle } from '../utils/parser';

interface GraphVisualizerProps {
  cycles: DependencyCycle[];
  selectedCycle: DependencyCycle | null;
  onCycleSelect: (cycle: DependencyCycle) => void;
}

const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ cycles, selectedCycle, onCycleSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const nodesRef = useRef<DataSet<any>>(new DataSet());
  const edgesRef = useRef<DataSet<any>>(new DataSet());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      console.error('Container ref is not available');
      return;
    }

    const nodes = nodesRef.current;
    const edges = edgesRef.current;

    // Clear existing data
    nodes.clear();
    edges.clear();

    // Create nodes and edges for all cycles
    cycles.forEach((cycle, cycleIndex) => {
      cycle.cyclePath.forEach((node, nodeIndex) => {
        const nodeId = `${cycleIndex}-${node}`;
        if (!nodes.get(nodeId)) {
          nodes.add({
            id: nodeId,
            label: node,
            title: node,
            group: cycleIndex,
            color: {
              border: '#2B7CE9',
              background: '#97C2FC',
            },
            opacity: 0.3,
          });
        }

        // Create edge to next node in cycle
        if (nodeIndex < cycle.cyclePath.length - 1) {
          const nextNode = cycle.cyclePath[nodeIndex + 1];
          const nextNodeId = `${cycleIndex}-${nextNode}`;
          edges.add({
            from: nodeId,
            to: nextNodeId,
            arrows: 'to',
            color: {
              color: '#2B7CE9',
              opacity: 0.2,
            },
            width: 2,
          });
        }
      });
    });

    const options = {
      nodes: {
        shape: 'dot',
        size: 16,
        font: {
          size: 12,
          color: '#333',
          strokeWidth: 0,
          strokeColor: '#ffffff',
        },
        borderWidth: 2,
        borderWidthSelected: 3,
        color: {
          border: '#2B7CE9',
          background: '#97C2FC',
          highlight: {
            border: '#2B7CE9',
            background: '#D2E5FF',
          },
          hover: {
            border: '#2B7CE9',
            background: '#D2E3FF',
          },
        },
      },
      edges: {
        width: 2,
        color: {
          color: '#2B7CE9',
          highlight: '#2B7CE9',
          hover: '#2B7CE9',
        },
        smooth: {
          enabled: true,
          type: 'continuous',
          forceDirection: 'none',
          roundness: 0.5,
        },
        arrows: {
          to: {
            enabled: true,
            scaleFactor: 0.5,
          },
        },
      },
      physics: {
        enabled: true,
        stabilization: {
          enabled: true,
          iterations: 1000,
          updateInterval: 25,
        },
      },
      interaction: {
        dragNodes: true,
        dragView: true,
        hideEdgesOnDrag: false,
        hideNodesOnDrag: false,
        hover: true,
        multiselect: false,
        navigationButtons: true,
        selectable: true,
        selectConnectedEdges: true,
        tooltipDelay: 200,
        zoomView: true,
      },
      layout: {
        improvedLayout: true,
        hierarchical: {
          enabled: false,
          direction: 'UD',
          sortMethod: 'directed',
        },
      },
    };

    try {
      if (networkRef.current) {
        networkRef.current.destroy();
      }

      const network = new Network(containerRef.current, { nodes, edges }, options);
      networkRef.current = network;

      // Fit the network to the viewport
      setTimeout(() => {
        network.fit({
          animation: {
            duration: 1000,
            easingFunction: 'easeInOutQuad'
          }
        });
      }, 100);

      const handleNodeClick = (params: any) => {
        if (params.nodes.length > 0 && networkRef.current) {
          const nodeId = params.nodes[0];
          const cycleIndex = parseInt(nodeId.split('-')[0]);
          const cycle = cycles[cycleIndex];
          if (cycle) {
            onCycleSelect(cycle);
          }
        }
      };

      network.on('click', handleNodeClick);

      return () => {
        network.off('click', handleNodeClick);
        network.destroy();
      };
    } catch (error) {
      console.error('Error creating network:', error);
      setError('Failed to create network visualization');
    }
  }, [cycles, onCycleSelect]);

  // Update node and edge styles when selectedCycle changes
  useEffect(() => {
    if (!selectedCycle) return;

    const nodes = nodesRef.current;
    const edges = edgesRef.current;

    // Reset all nodes and edges to default style
    nodes.forEach((node: any) => {
      nodes.update({
        ...node,
        color: {
          border: '#2B7CE9',
          background: '#97C2FC',
        },
        opacity: 0.3,
      });
    });

    edges.forEach((edge: any) => {
      edges.update({
        ...edge,
        color: {
          color: '#2B7CE9',
          opacity: 0.2,
        },
      });
    });

    // Highlight selected cycle
    const cycleIndex = cycles.indexOf(selectedCycle);
    if (cycleIndex !== -1) {
      const selectedNodes = new Set(selectedCycle.cyclePath.map(node => `${cycleIndex}-${node}`));
      const selectedEdges = new Set();

      // Find edges that are part of the cycle
      edges.forEach((edge: any) => {
        if (selectedNodes.has(edge.from) && selectedNodes.has(edge.to)) {
          selectedEdges.add(edge.id);
        }
      });

      // Update selected nodes and edges
      selectedNodes.forEach(nodeId => {
        nodes.update({
          id: nodeId,
          color: {
            border: '#FF6B6B',
            background: '#FFE3E3',
          },
          opacity: 1,
        });
      });

      selectedEdges.forEach(edgeId => {
        edges.update({
          id: edgeId,
          color: {
            color: '#FF6B6B',
            opacity: 1,
          },
          width: 3,
        });
      });
    }
  }, [selectedCycle, cycles]);

  return (
    <div className="graph-container" ref={containerRef}>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default GraphVisualizer; 