import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import useEvents from '../../../../app/hooks/useEvents';
import {
  ActionNodeDef,
  EventGraph,
  EventGraphNode,
  EventGraphNodeKind,
  OperationNodeDef,
  TriggerNodeDef,
} from '../../../Types';
import { buildGraphKey } from '../FormKeys';
import { CORE_ACTION_DEFS, CORE_TRIGGER_DEFS } from './coreNodeDefs';

interface NodePaletteProps {
  eventName: string;
}

interface PaletteOption {
  value: string;
  label: string;
  kind: EventGraphNodeKind;
  moduleName: string;
  nodeTypeId: string;
  defaults: { [key: string]: any };
}

interface PaletteCategory {
  key: string;
  label: string;
  options: PaletteOption[];
}

export default function NodePalette(props: NodePaletteProps) {
  const { eventName } = props;
  const { watch, setValue } = useFormContext();
  const { getNodeManifest, getOperationNodes } = useEvents();
  const { manifests } = getNodeManifest();
  const { operationNodes } = getOperationNodes();

  const graphKey = buildGraphKey(eventName);

  const triggerCategories: PaletteCategory[] = [];
  const actionCategories: PaletteCategory[] = [];

  for (const manifest of manifests ?? []) {
    if (manifest.triggers.length) {
      triggerCategories.push({
        key: manifest.moduleName,
        label: manifest.moduleName,
        options: manifest.triggers.map((trigger: TriggerNodeDef) => ({
          value: `callback::${manifest.moduleName}::${trigger.id}`,
          label: trigger.label,
          kind: 'callback',
          moduleName: manifest.moduleName,
          nodeTypeId: trigger.id,
          defaults: trigger.defaults,
        })),
      });
    }
    if (manifest.actions.length) {
      actionCategories.push({
        key: manifest.moduleName,
        label: manifest.moduleName,
        options: manifest.actions.map((action: ActionNodeDef) => ({
          value: `action::${manifest.moduleName}::${action.id}`,
          label: action.label,
          kind: 'action',
          moduleName: manifest.moduleName,
          nodeTypeId: action.id,
          defaults: action.defaults,
        })),
      });
    }
  }

  if (CORE_TRIGGER_DEFS.length) {
    triggerCategories.push({
      key: 'core',
      label: 'core',
      options: CORE_TRIGGER_DEFS.map((trigger) => ({
        value: `callback::core::${trigger.id}`,
        label: trigger.label,
        kind: 'callback',
        moduleName: 'core',
        nodeTypeId: trigger.id,
        defaults: trigger.defaults,
      })),
    });
  }
  if (CORE_ACTION_DEFS.length) {
    actionCategories.push({
      key: 'core',
      label: 'core',
      options: CORE_ACTION_DEFS.map((action) => ({
        value: `action::core::${action.id}`,
        label: action.label,
        kind: 'action',
        moduleName: 'core',
        nodeTypeId: action.id,
        defaults: action.defaults,
      })),
    });
  }

  const operationsByCategory = new Map<string, OperationNodeDef[]>();
  for (const op of operationNodes ?? []) {
    const list = operationsByCategory.get(op.category) ?? [];
    list.push(op);
    operationsByCategory.set(op.category, list);
  }
  for (const [category, ops] of operationsByCategory) {
    actionCategories.push({
      key: `operation:${category}`,
      label: `${category} operations`,
      options: ops.map((op) => ({
        value: `operation::${op.category}::${op.id}`,
        label: op.label,
        kind: 'operation',
        moduleName: op.category,
        nodeTypeId: op.id,
        defaults: op.defaults,
      })),
    });
  }

  function addNode(option: PaletteOption) {
    const graph: EventGraph = watch(graphKey);
    const nodes = graph?.nodes ?? [];
    const newNode: EventGraphNode = {
      id: uuidv4(),
      kind: option.kind,
      moduleName: option.moduleName,
      nodeTypeId: option.nodeTypeId,
      values: { ...option.defaults },
      delay: option.kind === 'action' ? 0 : undefined,
      position: {
        x: option.kind === 'callback' ? 40 : 360,
        y: 40 + nodes.length * 110,
      },
    };
    setValue(`${graphKey}.nodes`, [...nodes, newNode], { shouldDirty: true });
  }

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <CascadeMenuButton label='Triggers' categories={triggerCategories} onSelect={addNode} />
      <CascadeMenuButton label='Actions' categories={actionCategories} onSelect={addNode} />
    </div>
  );
}

interface CascadeMenuButtonProps {
  label: string;
  categories: PaletteCategory[];
  onSelect: (option: PaletteOption) => void;
}

function CascadeMenuButton(props: CascadeMenuButtonProps) {
  const { label, categories, onSelect } = props;
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('');

  function close() {
    setOpen(false);
    setActiveCategory('');
  }

  return (
    <div style={{ position: 'relative' }} onMouseEnter={() => setOpen(true)} onMouseLeave={close}>
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
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            minWidth: 160,
            background: 'var(--color-background-near, #2a2a2a)',
            border: '1px solid var(--color-border, #444)',
            borderRadius: 4,
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            padding: 4,
          }}
        >
          {categories.length === 0 ? (
            <div style={{ padding: '6px 10px', fontSize: '0.8rem', opacity: 0.6 }}>No options</div>
          ) : (
            categories.map((category) => (
              <div
                key={category.key}
                onMouseEnter={() => setActiveCategory(category.key)}
                style={{
                  position: 'relative',
                  padding: '6px 10px',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  borderRadius: 3,
                  cursor: 'default',
                  background: activeCategory === category.key ? 'var(--color-background-far, #383838)' : undefined,
                }}
              >
                <span>{category.label}</span>
                <span style={{ opacity: 0.6, fontSize: '0.7rem' }}>▸</span>
                {activeCategory === category.key ? (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '100%',
                      minWidth: 200,
                      background: 'var(--color-background-near, #2a2a2a)',
                      border: '1px solid var(--color-border, #444)',
                      borderRadius: 4,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                      padding: 4,
                    }}
                  >
                    {category.options.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => {
                          onSelect(option);
                          close();
                        }}
                        style={{
                          padding: '6px 10px',
                          fontSize: '0.85rem',
                          borderRadius: 3,
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-background-far, #383838)')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
