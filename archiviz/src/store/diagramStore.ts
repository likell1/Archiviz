import { create } from 'zustand';
import { DiagramSchema, DiagramNode, DiagramEdge } from '@/types/diagram';

interface DiagramStore {
  diagram: DiagramSchema | null;
  history: DiagramSchema[];
  future: DiagramSchema[];
  selectedNodeId: string | null;
  isLoading: boolean;
  error: string | null;

  setDiagram: (diagram: DiagramSchema) => void;
  updateNode: (nodeId: string, updates: Partial<DiagramNode>) => void;
  addNode: (node: DiagramNode) => void;
  removeNode: (nodeId: string) => void;
  addEdge: (edge: DiagramEdge) => void;
  removeEdge: (edgeId: string) => void;
  undo: () => void;
  redo: () => void;
  setSelectedNode: (nodeId: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

function snapshot(state: DiagramStore): DiagramSchema | null {
  return state.diagram ? structuredClone(state.diagram) : null;
}

export const useDiagramStore = create<DiagramStore>((set, get) => ({
  diagram: null,
  history: [],
  future: [],
  selectedNodeId: null,
  isLoading: false,
  error: null,

  setDiagram: (diagram) =>
    set((s) => ({
      diagram,
      history: s.diagram ? [...s.history.slice(-20), s.diagram] : s.history,
      future: [],
    })),

  updateNode: (nodeId, updates) =>
    set((s) => {
      if (!s.diagram) return s;
      const prev = snapshot(s);
      return {
        diagram: {
          ...s.diagram,
          nodes: s.diagram.nodes.map((n) =>
            n.id === nodeId ? { ...n, ...updates } : n
          ),
        },
        history: prev ? [...s.history.slice(-20), prev] : s.history,
        future: [],
      };
    }),

  addNode: (node) =>
    set((s) => {
      if (!s.diagram) return s;
      const prev = snapshot(s);
      return {
        diagram: { ...s.diagram, nodes: [...s.diagram.nodes, node] },
        history: prev ? [...s.history.slice(-20), prev] : s.history,
        future: [],
      };
    }),

  removeNode: (nodeId) =>
    set((s) => {
      if (!s.diagram) return s;
      const prev = snapshot(s);
      return {
        diagram: {
          ...s.diagram,
          nodes: s.diagram.nodes.filter((n) => n.id !== nodeId),
          edges: s.diagram.edges.filter(
            (e) => e.source !== nodeId && e.target !== nodeId
          ),
        },
        history: prev ? [...s.history.slice(-20), prev] : s.history,
        future: [],
      };
    }),

  addEdge: (edge) =>
    set((s) => {
      if (!s.diagram) return s;
      const prev = snapshot(s);
      return {
        diagram: { ...s.diagram, edges: [...s.diagram.edges, edge] },
        history: prev ? [...s.history.slice(-20), prev] : s.history,
        future: [],
      };
    }),

  removeEdge: (edgeId) =>
    set((s) => {
      if (!s.diagram) return s;
      const prev = snapshot(s);
      return {
        diagram: {
          ...s.diagram,
          edges: s.diagram.edges.filter((e) => e.id !== edgeId),
        },
        history: prev ? [...s.history.slice(-20), prev] : s.history,
        future: [],
      };
    }),

  undo: () =>
    set((s) => {
      if (s.history.length === 0) return s;
      const prev = s.history[s.history.length - 1];
      return {
        diagram: prev,
        history: s.history.slice(0, -1),
        future: s.diagram ? [s.diagram, ...s.future] : s.future,
      };
    }),

  redo: () =>
    set((s) => {
      if (s.future.length === 0) return s;
      const next = s.future[0];
      return {
        diagram: next,
        history: s.diagram ? [...s.history, s.diagram] : s.history,
        future: s.future.slice(1),
      };
    }),

  setSelectedNode: (nodeId) => set({ selectedNodeId: nodeId }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
