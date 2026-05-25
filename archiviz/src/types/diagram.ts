export interface DiagramMeta {
  title: string;
  provider: 'aws' | 'gcp' | 'azure' | 'mixed' | 'unknown';
  direction: 'LR' | 'TB';
}

export interface DiagramGroup {
  id: string;
  label: string;
  type: 'vpc' | 'subnet' | 'az' | 'cluster' | 'custom';
  parent: string | null;
}

export interface DiagramNode {
  id: string;
  service: string;
  label: string;
  group: string | null;
  external: boolean;
}

export interface DiagramEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  style: 'solid' | 'dashed';
  animated: boolean;
}

export interface DiagramSchema {
  meta: DiagramMeta;
  groups: DiagramGroup[];
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}
