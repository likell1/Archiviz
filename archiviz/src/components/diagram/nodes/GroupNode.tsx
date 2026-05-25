'use client';

import { memo } from 'react';
import { NodeProps, NodeResizer } from 'reactflow';
import { DiagramGroup } from '@/types/diagram';

const GROUP_COLORS: Record<DiagramGroup['type'], string> = {
  vpc:     'border-blue-500/40 bg-blue-950/20',
  subnet:  'border-green-500/40 bg-green-950/20',
  az:      'border-purple-500/40 bg-purple-950/20',
  cluster: 'border-orange-500/40 bg-orange-950/20',
  custom:  'border-gray-500/40 bg-gray-800/20',
};

const LABEL_COLORS: Record<DiagramGroup['type'], string> = {
  vpc:     'text-blue-400',
  subnet:  'text-green-400',
  az:      'text-purple-400',
  cluster: 'text-orange-400',
  custom:  'text-gray-400',
};

function GroupNode({ data, selected }: NodeProps<DiagramGroup>) {
  return (
    <div
      className={`w-full h-full rounded-2xl border-2 ${GROUP_COLORS[data.type]} relative`}
    >
      <NodeResizer
        isVisible={selected}
        minWidth={120}
        minHeight={80}
        lineClassName="!border-blue-400"
        handleClassName="!bg-blue-400 !border-gray-900"
      />
      <span
        className={`absolute top-2 left-3 text-xs font-semibold tracking-wide uppercase ${LABEL_COLORS[data.type]}`}
      >
        {data.label}
      </span>
    </div>
  );
}

export default memo(GroupNode);
