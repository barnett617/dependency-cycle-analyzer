import React, { useEffect, useRef } from "react";
import { Network } from "vis-network";
import { DataSet } from "vis-data";
import { DependencyCycle } from "../utils/parser";

interface DependencyGraphProps {
  cycles: DependencyCycle[];
}

export const DependencyGraph: React.FC<DependencyGraphProps> = ({ cycles }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create nodes and edges from cycles
    const nodes = new DataSet<{ id: string; label: string }>();
    const edges = new DataSet<{ id: string; from: string; to: string }>();

    cycles.forEach((cycle, cycleIndex) => {
      cycle.cyclePath.forEach((path, index) => {
        const nodeId = `${cycleIndex}-${path}`;
        nodes.add({ id: nodeId, label: path });
        if (index < cycle.cyclePath.length - 1) {
          edges.add({
            id: `${nodeId}-${cycleIndex}-${cycle.cyclePath[index + 1]}`,
            from: nodeId,
            to: `${cycleIndex}-${cycle.cyclePath[index + 1]}`,
          });
        } else {
          // Connect last node to first node to complete the cycle
          edges.add({
            id: `${nodeId}-${cycleIndex}-${cycle.cyclePath[0]}`,
            from: nodeId,
            to: `${cycleIndex}-${cycle.cyclePath[0]}`,
          });
        }
      });
    });

    const data = {
      nodes,
      edges,
    };

    const options = {
      nodes: {
        shape: "box",
        margin: 10,
        font: {
          size: 14,
        },
      },
      edges: {
        smooth: {
          enabled: true,
          type: "curvedCW",
          roundness: 0.2,
        },
      },
      physics: {
        stabilization: false,
        barnesHut: {
          gravitationalConstant: -80000,
          springConstant: 0.001,
          springLength: 200,
        },
      },
    };

    networkRef.current = new Network(containerRef.current, data, options);
  }, [cycles]);

  return (
    <div style={{ height: "600px", width: "100%", border: "1px solid #ccc" }}>
      <div ref={containerRef} style={{ height: "100%", width: "100%" }} />
    </div>
  );
};
