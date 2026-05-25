import ELK, { ElkNode, ElkExtendedEdge } from 'elkjs/lib/elk.bundled.js';
import { Node, Edge } from 'reactflow';
import { DiagramSchema, DiagramGroup } from '@/types/diagram';

const elk = new ELK();

const ELK_OPTIONS = {
  'elk.algorithm': 'layered',
  'elk.layered.spacing.nodeNodeBetweenLayers': '80',
  'elk.spacing.nodeNode': '40',
  'elk.padding': '[top=40,left=40,bottom=40,right=40]',
};

const NODE_WIDTH = 120;
const NODE_HEIGHT = 80;
const GROUP_PADDING = 60;

function buildElkChildren(
  groups: DiagramGroup[],
  parentId: string | null,
  schema: DiagramSchema
): ElkNode[] {
  const childGroups = groups.filter((g) => g.parent === parentId);

  return childGroups.map((group) => {
    const nodesInGroup = schema.nodes.filter((n) => n.group === group.id);
    const nestedGroups = buildElkChildren(groups, group.id, schema);

    return {
      id: group.id,
      layoutOptions: {
        'elk.algorithm': 'layered',
        'elk.padding': `[top=${GROUP_PADDING},left=${GROUP_PADDING},bottom=${GROUP_PADDING},right=${GROUP_PADDING}]`,
      },
      children: [
        ...nodesInGroup.map((n) => ({ id: n.id, width: NODE_WIDTH, height: NODE_HEIGHT })),
        ...nestedGroups,
      ],
    };
  });
}

export async function computeElkLayout(schema: DiagramSchema): Promise<{
  nodes: Node[];
  edges: Edge[];
}> {
  const direction = schema.meta.direction === 'LR' ? 'RIGHT' : 'DOWN';

  const ungroupedNodes = schema.nodes.filter((n) => n.group === null);
  const topLevelGroups = buildElkChildren(schema.groups, null, schema);

  const graph: ElkNode = {
    id: 'root',
    layoutOptions: {
      ...ELK_OPTIONS,
      'elk.direction': direction,
    },
    children: [
      ...ungroupedNodes.map((n) => ({ id: n.id, width: NODE_WIDTH, height: NODE_HEIGHT })),
      ...topLevelGroups,
    ],
    edges: schema.edges.map((e) => ({
      id: e.id,
      sources: [e.source],
      targets: [e.target],
    })) as ElkExtendedEdge[],
  };

  const laid = await elk.layout(graph);

  const rfNodes: Node[] = [];
  const rfEdges: Edge[] = [];

  function extractNodes(elkNode: ElkNode, parentId?: string) {
    if (elkNode.id === 'root') {
      elkNode.children?.forEach((c) => extractNodes(c));
      return;
    }

    const diagramNode = schema.nodes.find((n) => n.id === elkNode.id);
    const diagramGroup = schema.groups.find((g) => g.id === elkNode.id);

    if (diagramNode) {
      rfNodes.push({
        id: elkNode.id,
        type: 'service',
        position: { x: elkNode.x ?? 0, y: elkNode.y ?? 0 },
        data: diagramNode,
        parentNode: parentId,
        extent: parentId ? 'parent' : undefined,
      });
    } else if (diagramGroup) {
      rfNodes.push({
        id: elkNode.id,
        type: 'group',
        position: { x: elkNode.x ?? 0, y: elkNode.y ?? 0 },
        style: { width: elkNode.width, height: elkNode.height },
        data: diagramGroup,
        parentNode: parentId,
        extent: parentId ? 'parent' : undefined,
      });
      elkNode.children?.forEach((c) => extractNodes(c, elkNode.id));
    }
  }

  laid.children?.forEach((c) => extractNodes(c));

  schema.edges.forEach((e) => {
    rfEdges.push({
      id: e.id,
      source: e.source,
      target: e.target,
      label: e.label,
      type: 'custom',
      animated: e.animated,
      data: { style: e.style },
    });
  });

  return { nodes: rfNodes, edges: rfEdges };
}
