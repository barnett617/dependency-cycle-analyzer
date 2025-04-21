import React, { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { DependencyCycle } from '../utils/parser';

interface GraphVisualizerProps {
  cycles: DependencyCycle[];
  onCycleSelect: (cycle: DependencyCycle) => void;
}

const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ cycles, onCycleSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCycle, setSelectedCycle] = useState<DependencyCycle | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      console.error('Container ref is not available');
      return;
    }

    console.log('Initializing network with cycles:', cycles.length);
    
    const nodes = new DataSet<any>();
    const edges = new DataSet<any>();

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
            opacity: 0.8,
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
              opacity: 0.5,
            },
            width: 2,
          });
        }
      });
    });

    console.log('Created nodes:', nodes.length, 'edges:', edges.length);

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
            background: '#D2E5FF',
          },
        },
        opacity: 0.8,
      },
      edges: {
        width: 2,
        color: {
          color: '#2B7CE9',
          highlight: '#2B7CE9',
          hover: '#2B7CE9',
          opacity: 0.5,
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
      configure: {
        enabled: false,
      },
      autoResize: true,
      height: '100%',
      width: '100%',
    };

    try {
      // Clean up any existing network
      if (networkRef.current) {
        networkRef.current.destroy();
      }

      // Create new network
      const network = new Network(containerRef.current, { nodes, edges }, options);
      networkRef.current = network;
      console.log('Network created successfully');

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
            setSelectedCycle(cycle);
            onCycleSelect(cycle);
            
            // Update node and edge styles based on selection
            const allNodes = nodes.get();
            const allEdges = edges.get();
            
            // Reset all nodes and edges to default style
            allNodes.forEach((node: any) => {
              nodes.update({
                ...node,
                color: {
                  border: '#2B7CE9',
                  background: '#97C2FC',
                },
                opacity: 0.3,
              });
            });
            
            allEdges.forEach((edge: any) => {
              edges.update({
                ...edge,
                color: {
                  color: '#2B7CE9',
                  opacity: 0.2,
                },
              });
            });
            
            // Highlight selected cycle
            const selectedNodes = new Set(cycle.cyclePath.map(node => `${cycleIndex}-${node}`));
            const selectedEdges = new Set();
            
            // Find edges that are part of the cycle
            allEdges.forEach((edge: any) => {
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

  const handleReset = () => {
    setSelectedCycle(null);
    if (networkRef.current) {
      // Recreate the network with default styles
      const container = containerRef.current;
      if (container) {
        container.innerHTML = '';
        networkRef.current = null;
        // Trigger a re-render by updating the cycles prop
        onCycleSelect(cycles[0]);
      }
    }
  };

  return (
    <div className="flex h-full" style={{ height: 'calc(100vh - 2rem)' }}>
      <div className="w-1/4 p-4 overflow-y-auto border-r bg-white">
        <h2 className="text-lg font-semibold mb-4">Dependency Cycles</h2>
        <div className="space-y-2">
          {cycles.map((cycle, index) => (
            <div
              key={index}
              className={`p-3 rounded cursor-pointer ${
                selectedCycle === cycle
                  ? 'bg-red-100 border-red-300'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
              onClick={() => {
                const nodeId = `${index}-${cycle.cyclePath[0]}`;
                if (networkRef.current) {
                  networkRef.current.selectNodes([nodeId]);
                }
              }}
            >
              <div className="font-medium text-sm">
                {cycle.cyclePath.join(' → ')}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {cycle.file}:{cycle.line}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 relative bg-white" style={{ height: 'calc(100vh - 2rem)' }}>
        <div 
          ref={containerRef} 
          id="network-container"
          style={{ 
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            border: '1px solid #e5e7eb',
            backgroundColor: 'white'
          }}
        />
        {selectedCycle && (
          <button
            onClick={handleReset}
            className="absolute top-4 right-4 px-3 py-1 bg-white border rounded shadow-sm hover:bg-gray-50 z-10"
          >
            Reset View
          </button>
        )}
      </div>
    </div>
  );
};

export { GraphVisualizer }; 