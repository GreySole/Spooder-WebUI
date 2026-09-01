import { panelStyle } from '@spooder/webui-module-sdk';
import React, { useState } from 'react';
import { PaletteCategory, PaletteOption } from './paletteTypes';

// Defined in the module SDK so a module's panels can match this one.
export { panelStyle };

const rowStyle: React.CSSProperties = {
  position: 'relative',
  padding: '6px 10px',
  fontSize: '0.85rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  borderRadius: 3,
  cursor: 'default',
};

export const leafStyle: React.CSSProperties = {
  padding: '6px 10px',
  fontSize: '0.85rem',
  borderRadius: 3,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
};

export const HIGHLIGHT_BACKGROUND = 'var(--color-background-far, #383838)';

interface CategoryPanelProps {
  categories: PaletteCategory[];
  onSelect: (option: PaletteOption) => void;
  onPick: () => void;
  // Set when the panel is already inside a menu surface (the context menu's search box sits
  // above it): the rows are drawn without a second border/shadow around them.
  embedded?: boolean;
}

// Renders one level of the cascade. A row opens either a nested CategoryPanel (when the
// category has subcategories, e.g. Plugins -> each plugin) or its list of options, so the
// menu supports arbitrary depth while every level keeps the same look and hover behavior.
export function CategoryPanel(props: CategoryPanelProps) {
  const { categories, onSelect, onPick, embedded } = props;
  const [activeCategory, setActiveCategory] = useState('');
  const surfaceStyle = embedded ? {} : panelStyle;

  if (categories.length === 0) {
    return (
      <div style={surfaceStyle}>
        <div style={{ padding: '6px 10px', fontSize: '0.8rem', opacity: 0.6 }}>No options</div>
      </div>
    );
  }

  return (
    <div style={surfaceStyle}>
      {categories.map((category) => (
        <div
          key={category.key}
          onMouseEnter={() => setActiveCategory(category.key)}
          style={{
            ...rowStyle,
            background: activeCategory === category.key ? HIGHLIGHT_BACKGROUND : undefined,
          }}
        >
          <span>{category.label}</span>
          <span style={{ opacity: 0.6, fontSize: '0.7rem' }}>▸</span>
          {activeCategory === category.key ? (
            <div style={{ position: 'absolute', top: 0, left: '100%', zIndex: 1 }}>
              {category.subcategories?.length ? (
                <CategoryPanel categories={category.subcategories} onSelect={onSelect} onPick={onPick} />
              ) : (
                <div style={panelStyle}>
                  {category.options.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => {
                        onSelect(option);
                        onPick();
                      }}
                      style={leafStyle}
                      onMouseEnter={(e) => (e.currentTarget.style.background = HIGHLIGHT_BACKGROUND)}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

interface CascadeMenuButtonProps {
  label: string;
  categories: PaletteCategory[];
  onSelect: (option: PaletteOption) => void;
}

export function CascadeMenuButton(props: CascadeMenuButtonProps) {
  const { label, categories, onSelect } = props;
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <div
        style={{
          minWidth: 110,
          padding: '6px 10px',
          borderRadius: 4,
          border: '1px solid var(--color-border, #444)',
          background: 'var(--color-background-near, #2a2a2a)',
          color: 'var(--color-text, #eee)',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          cursor: 'default',
          userSelect: 'none',
        }}
      >
        <span>{label}</span>
        <span style={{ opacity: 0.6, fontSize: '0.7rem' }}>▾</span>
      </div>
      {open ? (
        <div style={{ position: 'absolute', top: '100%', left: 0 }}>
          <CategoryPanel categories={categories} onSelect={onSelect} onPick={() => setOpen(false)} />
        </div>
      ) : null}
    </div>
  );
}
