import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ContextMenuAnchor, Point } from '../canvas/types';
import { CategoryPanel, HIGHLIGHT_BACKGROUND, leafStyle, panelStyle } from './CascadeMenu';
import { PaletteCategory, PaletteGroup, PaletteOption, searchPalette } from './paletteTypes';

const MENU_WIDTH = 240;
// How tall the results list is allowed to grow before it scrolls.
const MENU_HEIGHT = 320;
const EDGE_MARGIN = 8;

interface NodeContextMenuProps {
  anchor: ContextMenuAnchor;
  groups: PaletteGroup[];
  onSelect: (option: PaletteOption, position: Point) => void;
  // Only reachable when the menu was opened on a node (anchor.nodeId).
  onDuplicateNode: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onClose: () => void;
}

interface NodeActionRowProps {
  label: string;
  color?: string;
  onClick: () => void;
}

function NodeActionRow(props: NodeActionRowProps) {
  const { label, color, onClick } = props;
  return (
    <div
      onClick={onClick}
      style={{ ...leafStyle, color }}
      onMouseEnter={(e) => (e.currentTarget.style.background = HIGHLIGHT_BACKGROUND)}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      {label}
    </div>
  );
}

// The canvas context menu (right click / shift+space). It offers the same tree as the palette
// buttons - the groups come from the same useNodePalette call - with the three top-level menus
// collapsed into one cascade, plus a search box that flattens the whole tree.
export default function NodeContextMenu(props: NodeContextMenuProps) {
  const { anchor, groups, onSelect, onDuplicateNode, onDeleteNode, onClose } = props;
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // Starts at the cursor and is corrected before paint by the measure below, so the menu opens
  // where the click was unless that would hang it off an edge of the graph.
  const [position, setPosition] = useState<Point>({ x: anchor.screen.x, y: anchor.screen.y });

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) {
      return;
    }
    // Measured rather than assumed: the panel's height depends on how many results the query
    // turned up, so a guessed height would push the menu away from the cursor for no reason.
    const { width, height } = panel.getBoundingClientRect();
    setPosition({
      x: Math.max(EDGE_MARGIN, Math.min(anchor.screen.x, anchor.viewport.width - width - EDGE_MARGIN)),
      y: Math.max(EDGE_MARGIN, Math.min(anchor.screen.y, anchor.viewport.height - height - EDGE_MARGIN)),
    });
  }, [anchor, query]);

  // Typing is the point of the menu, so it takes focus the moment it appears - the keyboard
  // opener (shift+space) would otherwise leave focus on whatever the graph had.
  useLayoutEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const results = searchPalette(groups, query);
  // A group is a cascade row like any other, so searching and browsing share one renderer.
  const rootCategories: PaletteCategory[] = groups.map((group) => ({
    key: group.key,
    label: group.label,
    options: [],
    subcategories: group.categories,
  }));

  function choose(option: PaletteOption) {
    onSelect(option, anchor.graph);
    onClose();
  }

  function runNodeAction(action: (nodeId: string) => void) {
    if (!anchor.nodeId) {
      return;
    }
    action(anchor.nodeId);
    onClose();
  }

  function onSearchKeyDown(e: React.KeyboardEvent) {
    if (!results.length) {
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight((current) => (current + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight((current) => (current - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(results[Math.min(highlight, results.length - 1)].option);
    }
  }


  return (
    // Full-container backdrop: a press anywhere outside dismisses the menu, and it also keeps
    // that press from reaching the canvas underneath (which would pan or deselect).
    <div
      style={{ position: 'absolute', inset: 0, zIndex: 30 }}
      onPointerDown={onClose}
      onContextMenu={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div
        ref={panelRef}
        onPointerDown={(e) => e.stopPropagation()}
        style={{
          ...panelStyle,
          position: 'absolute',
          left: position.x,
          top: position.y,
          width: MENU_WIDTH,
          // Only the results list scrolls: the browse cascade has to let its submenus escape
          // the panel, which an overflow of anything but `visible` would clip.
          maxHeight: query.trim() ? MENU_HEIGHT : undefined,
          overflowY: query.trim() ? 'auto' : 'visible',
          color: 'var(--color-text, #eee)',
        }}
      >
        {/* Actions on the node the menu was opened on, above the palette: they act on what was
            right-clicked, while everything below adds something new. The search box is left out
            of them deliberately - it filters nodes to add, not commands. */}
        {anchor.nodeId ? (
          <>
            <NodeActionRow label='Duplicate Node' onClick={() => runNodeAction(onDuplicateNode)} />
            <NodeActionRow label='Delete Node' color='#e74c3c' onClick={() => runNodeAction(onDeleteNode)} />
            <div style={{ height: 1, margin: '4px 0', background: 'var(--color-border, #444)' }} />
          </>
        ) : null}
        <input
          ref={inputRef}
          value={query}
          placeholder='Search nodes...'
          onChange={(e) => {
            setQuery(e.target.value);
            setHighlight(0);
          }}
          onKeyDown={onSearchKeyDown}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: '4px 6px',
            marginBottom: 4,
            fontSize: '0.8rem',
            borderRadius: 3,
            border: '1px solid var(--color-border, #444)',
            background: 'var(--color-background, #1e1e1e)',
            color: 'var(--color-text, #eee)',
          }}
        />
        {query.trim() ? (
          results.length === 0 ? (
            <div style={{ padding: '6px 10px', fontSize: '0.8rem', opacity: 0.6 }}>No matches</div>
          ) : (
            results.map((result, index) => (
              <div
                key={`${result.path}::${result.option.value}`}
                // Keeps arrow-key navigation visible once the list is longer than the panel.
                ref={index === highlight ? (el) => el?.scrollIntoView({ block: 'nearest' }) : undefined}
                onClick={() => choose(result.option)}
                onMouseEnter={() => setHighlight(index)}
                style={{
                  ...leafStyle,
                  whiteSpace: 'normal',
                  background: index === highlight ? HIGHLIGHT_BACKGROUND : undefined,
                }}
              >
                <div>{result.option.label}</div>
                <div style={{ fontSize: '0.7rem', opacity: 0.55 }}>{result.path}</div>
              </div>
            ))
          )
        ) : (
          <CategoryPanel categories={rootCategories} onSelect={choose} onPick={onClose} embedded />
        )}
      </div>
    </div>
  );
}
