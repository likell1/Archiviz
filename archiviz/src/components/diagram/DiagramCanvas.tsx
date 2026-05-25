'use client';

import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

import ServiceNode from './nodes/ServiceNode';
import GroupNode from './nodes/GroupNode';
import CustomEdge from './edges/CustomEdge';
import { DiagramSchema } from '@/types/diagram';
import { computeElkLayout } from '@/lib/layout/elkLayout';
import { useDiagramStore } from '@/store/diagramStore';

const nodeTypes = { service: ServiceNode, group: GroupNode };
const edgeTypes = { custom: CustomEdge };

interface Props {
  diagram: DiagramSchema;
}

function Canvas({ diagram }: Props) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [layoutReady, setLayoutReady] = useState(false);
  const addEdgeToStore = useDiagramStore((s) => s.addEdge);

  useEffect(() => {
    setLayoutReady(false);
    computeElkLayout(diagram).then(({ nodes: n, edges: e }) => {
      setNodes(n);
      setEdges(e);
      setLayoutReady(true);
    });
  }, [diagram, setNodes, setEdges]);

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge = {
        ...connection,
        id: `e-${connection.source}-${connection.target}-${Date.now()}`,
        type: 'custom',
        data: { style: 'solid' },
      };
      setEdges((eds) => addEdge(newEdge, eds));
      addEdgeToStore({
        id: newEdge.id,
        source: connection.source!,
        target: connection.target!,
        style: 'solid',
        animated: false,
      });
    },
    [setEdges, addEdgeToStore]
  );

  if (!layoutReady) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <span className="text-gray-400 text-sm">레이아웃 계산 중...</span>
      </div>
    );
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      defaultEdgeOptions={{ type: 'custom', data: { style: 'solid' } }}
      className="bg-gray-50"
    >
      <Background color="#e5e7eb" gap={20} size={1} />
      <Controls className="!bg-white !border-gray-200 !shadow-sm" />
      <MiniMap
        className="!bg-white !border-gray-200"
        nodeColor={(n) => (n.type === 'group' ? '#f3f4f6' : '#f97316')}
        maskColor="rgba(0,0,0,0.05)"
      />
    </ReactFlow>
  );
}

export default function DiagramCanvas({ diagram }: Props) {
  return (
    <ReactFlowProvider>
      <Canvas diagram={diagram} />
    </ReactFlowProvider>
  );
}
