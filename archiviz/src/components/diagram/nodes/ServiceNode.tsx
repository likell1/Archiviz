'use client';

import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import Image from 'next/image';
import { DiagramNode } from '@/types/diagram';
import { resolveIcon } from '@/lib/icons/iconMap';
import { useDiagramStore } from '@/store/diagramStore';

function ServiceNode({ data, selected }: NodeProps<DiagramNode>) {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const updateNode = useDiagramStore((s) => s.updateNode);

  const iconPath = resolveIcon(data.service);

  function handleDoubleClick() {
    setEditing(true);
  }

  function handleBlur() {
    setEditing(false);
    if (label !== data.label) {
      updateNode(data.id, { label });
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
    if (e.key === 'Escape') {
      setLabel(data.label);
      setEditing(false);
    }
  }

  return (
    <div
      className={`flex flex-col items-center justify-center w-[120px] h-[80px] rounded-xl bg-white border-2 transition-colors cursor-pointer select-none shadow-sm ${
        selected ? 'border-orange-400 shadow-lg shadow-orange-500/20' : 'border-gray-200 hover:border-gray-400'
      } ${data.external ? 'opacity-75 border-dashed' : ''}`}
      onDoubleClick={handleDoubleClick}
    >
      <Handle type="target" position={Position.Left} className="!bg-orange-400 !border-white" />
      <Handle type="source" position={Position.Right} className="!bg-orange-400 !border-white" />
      <Handle type="target" position={Position.Top} className="!bg-orange-400 !border-white" />
      <Handle type="source" position={Position.Bottom} className="!bg-orange-400 !border-white" />

      <div className="relative w-8 h-8 mb-1">
        <Image
          src={iconPath}
          alt={data.service}
          fill
          className="object-contain"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/icons/generic/service.svg';
          }}
        />
      </div>

      {editing ? (
        <input
          autoFocus
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-[100px] text-center text-[11px] bg-gray-100 text-gray-900 rounded px-1 outline-none border border-orange-400"
        />
      ) : (
        <span className="text-[11px] text-gray-700 text-center leading-tight px-1 truncate w-full text-center">
          {data.label}
        </span>
      )}
    </div>
  );
}

export default memo(ServiceNode);
