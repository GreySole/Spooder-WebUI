import React from 'react';

// The surface a floating panel sits on - the cascade menu in the node palette, and any panel a
// module puts beside it. Shared so a module's popover matches the host's rather than being an
// approximation of it that drifts the next time the theme moves.
export const panelStyle: React.CSSProperties = {
  minWidth: 180,
  background: 'var(--color-background-near, #2a2a2a)',
  border: '1px solid var(--color-border, #444)',
  borderRadius: 4,
  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
  padding: 4,
};
