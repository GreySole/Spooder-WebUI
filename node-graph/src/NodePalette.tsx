import React from 'react';
import { CascadeMenuButton, MenuBounds } from './palette/CascadeMenu';
import { PaletteGroup, PaletteOption } from './palette/paletteTypes';

interface NodePaletteProps {
  // Built by useNodePalette in EventNodes and shared with the canvas context menu, so both
  // menus always offer the same nodes.
  groups: PaletteGroup[];
  onSelect: (option: PaletteOption) => void;
  // The canvas the buttons sit on, so the menus stay inside it rather than the window.
  getBounds?: () => MenuBounds;
}

export default function NodePalette(props: NodePaletteProps) {
  const { groups, onSelect, getBounds } = props;

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {groups.map((group) => (
        <CascadeMenuButton
          key={group.key}
          label={group.label}
          categories={group.categories}
          onSelect={onSelect}
          getBounds={getBounds}
        />
      ))}
    </div>
  );
}
