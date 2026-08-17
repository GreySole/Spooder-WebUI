import React from 'react';
import { CascadeMenuButton } from './palette/CascadeMenu';
import { PaletteGroup, PaletteOption } from './palette/paletteTypes';

interface NodePaletteProps {
  // Built by useNodePalette in EventNodes and shared with the canvas context menu, so both
  // menus always offer the same nodes.
  groups: PaletteGroup[];
  onSelect: (option: PaletteOption) => void;
}

export default function NodePalette(props: NodePaletteProps) {
  const { groups, onSelect } = props;

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {groups.map((group) => (
        <CascadeMenuButton key={group.key} label={group.label} categories={group.categories} onSelect={onSelect} />
      ))}
    </div>
  );
}
