import { panelStyle } from '@spooder/webui-module-sdk';
import React, { useLayoutEffect, useRef, useState } from 'react';
import { PaletteCategory, PaletteOption } from './paletteTypes';

// Kept in sync with NodeContextMenu's own edge margin so a submenu and the root menu breathe
// the same amount of room at the screen edge.
const EDGE_MARGIN = 8;

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

export interface MenuBounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

function windowBounds(): MenuBounds {
  return { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}

interface CategoryPanelProps {
  categories: PaletteCategory[];
  onSelect: (option: PaletteOption) => void;
  onPick: () => void;
  // Set when the panel is already inside a menu surface (the context menu's search box sits
  // above it): the rows are drawn without a second border/shadow around them.
  embedded?: boolean;
  // The area a submenu isn't allowed to spill out of. Defaults to the browser window, but the
  // canvas context menu lives inside a `overflow: hidden` pane smaller than that - passing its
  // rect here is what keeps a submenu from being clipped by that pane instead of just the edge
  // of the screen.
  getBounds?: () => MenuBounds;
}

// Renders one level of the cascade. A row opens either a nested CategoryPanel (when the
// category has subcategories, e.g. Plugins -> each plugin) or its list of options, so the
// menu supports arbitrary depth while every level keeps the same look and hover behavior.
export function CategoryPanel(props: CategoryPanelProps) {
  const { categories, onSelect, onPick, embedded, getBounds } = props;
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
        <CategoryRow
          key={category.key}
          category={category}
          isActive={activeCategory === category.key}
          onEnter={() => setActiveCategory(category.key)}
          onSelect={onSelect}
          onPick={onPick}
          getBounds={getBounds}
        />
      ))}
    </div>
  );
}

interface CategoryRowProps {
  category: PaletteCategory;
  isActive: boolean;
  onEnter: () => void;
  onSelect: (option: PaletteOption) => void;
  onPick: () => void;
  getBounds?: () => MenuBounds;
}

// A category some large modules (Twitch's ~100+ triggers, in one flat category) can render a
// submenu taller than the screen, and a category opened near the right edge has no room to grow
// to the right - the browse cascade otherwise assumes both away. This measures the submenu after
// it mounts and, only when it would actually overflow, flips it to open to the left and/or clamps
// it to the viewport height with its own scrollbar - a plain top:0/left:100% is left alone
// otherwise, so nothing shifts for the common case of a menu that already fits.
function CategoryRow(props: CategoryRowProps) {
  const { category, isActive, onEnter, onSelect, onPick, getBounds } = props;
  const submenuRef = useRef<HTMLDivElement>(null);
  // The scrollbar itself, not just the content behind it, needs to be clipped to the rounded
  // corner - a border-radius on the same element as overflow-y:auto still lets some browsers
  // paint the native scrollbar track as a flat rectangle over the corner. Splitting the two
  // (outer masks to the rounded shape with overflow:hidden, inner does the actual scrolling)
  // clips the scrollbar's own chrome along with the content, in every browser.
  const scrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const submenu = submenuRef.current;
    const scroller = scrollRef.current;
    if (!isActive || !submenu || !scroller) {
      return;
    }
    // Reset to the natural position before measuring - the submenu can be re-measured (e.g. the
    // window resized) after a previous pass already offset it, which would otherwise bias every
    // measurement after the first toward whichever side/offset it last landed on.
    submenu.style.left = '100%';
    submenu.style.right = '';
    submenu.style.top = '0';
    submenu.style.height = '';
    submenu.style.overflow = '';
    scroller.style.height = '';
    scroller.style.overflowY = '';

    const rect = submenu.getBoundingClientRect();
    const bounds = getBounds?.() ?? windowBounds();

    if (rect.right > bounds.right - EDGE_MARGIN) {
      submenu.style.left = '';
      submenu.style.right = '100%';
    }

    const availableHeight = bounds.bottom - bounds.top - EDGE_MARGIN * 2;
    if (rect.height > availableHeight) {
      submenu.style.top = `${bounds.top + EDGE_MARGIN - rect.top}px`;
      // An explicit height, not max-height: a percentage height on the scroller only resolves
      // against a definite height on its parent, and max-height alone leaves that parent's own
      // `height` computed as auto - so the scroller's `height: 100%` would itself compute to
      // auto too, growing to fit all its content instead of clipping any of it.
      submenu.style.height = `${availableHeight}px`;
      submenu.style.overflow = 'hidden';
      scroller.style.height = '100%';
      scroller.style.overflowY = 'auto';
    } else if (rect.bottom > bounds.bottom - EDGE_MARGIN) {
      submenu.style.top = `${bounds.bottom - EDGE_MARGIN - rect.height - rect.top}px`;
    }
  }, [isActive, category, getBounds]);

  return (
    <div
      onMouseEnter={onEnter}
      style={{
        ...rowStyle,
        background: isActive ? HIGHLIGHT_BACKGROUND : undefined,
      }}
    >
      <span>{category.label}</span>
      <span style={{ opacity: 0.6, fontSize: '0.7rem' }}>▸</span>
      {isActive ? (
        <div
          ref={submenuRef}
          style={{ position: 'absolute', top: 0, left: '100%', zIndex: 1, borderRadius: panelStyle.borderRadius }}
        >
          <div ref={scrollRef}>
            {category.subcategories?.length ? (
              <CategoryPanel
                categories={category.subcategories}
                onSelect={onSelect}
                onPick={onPick}
                getBounds={getBounds}
              />
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
        </div>
      ) : null}
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
