'use client';

import { memo } from 'react';
import { NodeProps, NodeResizer } from 'reactflow';
import { DiagramGroup } from '@/types/diagram';

const GROUP_COLORS: Record<DiagramGroup['type'], string> = {
  vpc:     'border-blue-300 bg-blue-50/60',
  subnet:  'border-green-300 bg-green-50/60',
  az:      'border-purple-300 bg-purple-50/60',
  cluster: 'border-orange-300 bg-orange-50/60',
  custom:  'border-gray-300 bg-gray-50/60',
};

const LABEL_COLORS: Record<DiagramGroup['type'], string> = {
  vpc:     'text-blue-600',
  subnet:  'text-green-600',
  az:      'text-purple-600',
  cluster: 'text-orange-600',
  custom:  'text-gray-500',
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
        lineClassName="!border-orange-400"
        handleClassName="!bg-orange-400 !border-white"
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
