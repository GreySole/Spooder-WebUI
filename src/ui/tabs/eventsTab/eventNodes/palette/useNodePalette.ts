import { useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import useEvents from '../../../../../app/hooks/useEvents';
import {
  ActionNodeDef,
  EventGraph,
  EventGraphNode,
  NodeManifest,
  OperationNodeDef,
  TriggerNodeDef,
} from '../../../../Types';
import { buildGraphKey, GRAPH_KEY } from '../../FormKeys';
import { Point } from '../canvas/types';
import { CORE_ACTION_DEFS, CORE_TRIGGER_DEFS, PALETTE_HIDDEN_CORE_ACTIONS } from '../coreNodeDefs';
import { collectTimerUsage, TIMER_MENU_NODE_IDS, TIMER_NODE_IDS } from '../timerUsage';
import { PaletteCategory, PaletteGroup, PaletteOption } from './paletteTypes';

export interface UseNodePaletteOptions {
  eventName: string;
  onManageTimers: () => void;
}

export interface NodePalette {
  // Triggers/Actions/Timers, in menu order. Empty groups are dropped.
  groups: PaletteGroup[];
  // `position` places the node's top-left at a graph-space point (the context menu drops a node
  // where the cursor was); without it nodes stack down the canvas as the palette buttons do.
  addNode: (option: PaletteOption, position?: Point) => void;
}

// Builds the node palette tree once, for every menu that offers nodes: the palette buttons in
// the canvas corner and the right-click/shift+space context menu both render this, so an entry
// added to a manifest shows up in both with no further wiring.
export default function useNodePalette(options: UseNodePaletteOptions): NodePalette {
  const { eventName, onManageTimers } = options;
  const { watch, setValue } = useFormContext();
  const { getNodeManifest, getOperationNodes } = useEvents();
  const { manifests } = getNodeManifest();
  const { operationNodes } = getOperationNodes();

  const graphKey = buildGraphKey(eventName);

  // Keyed by category key so nodes that share a key (e.g. the backend's own 'core'
  // manifest and the hardcoded CORE_*_DEFS below, both moduleName 'core') merge into
  // a single menu entry instead of showing up as two separate 'core' rows.
  const triggerCategories = new Map<string, PaletteCategory>();
  const actionCategories = new Map<string, PaletteCategory>();
  // Plugin manifests are collected separately so they can be nested under one 'Plugins'
  // row rather than each becoming its own top-level category.
  const pluginActionCategories = new Map<string, PaletteCategory>();

  function addOptions(map: Map<string, PaletteCategory>, key: string, label: string, entries: PaletteOption[]) {
    if (!entries.length) {
      return;
    }
    const existing = map.get(key);
    if (existing) {
      existing.options.push(...entries);
    } else {
      map.set(key, { key, label, options: entries });
    }
  }

  for (const manifest of manifests ?? []) {
    addOptions(
      triggerCategories,
      manifest.moduleName,
      manifest.moduleName,
      manifest.triggers.map((trigger: TriggerNodeDef) => ({
        value: `callback::${manifest.moduleName}::${trigger.id}`,
        label: trigger.label,
        kind: 'callback',
        moduleName: manifest.moduleName,
        nodeTypeId: trigger.id,
        defaults: trigger.defaults,
      })),
    );
    addOptions(
      manifest.isPlugin ? pluginActionCategories : actionCategories,
      manifest.moduleName,
      manifest.moduleName,
      manifest.actions.map((action: ActionNodeDef) => ({
        value: `action::${manifest.moduleName}::${action.id}`,
        label: action.label,
        kind: 'action',
        moduleName: manifest.moduleName,
        nodeTypeId: action.id,
        defaults: action.defaults,
      })),
    );
  }

  addOptions(
    triggerCategories,
    'core',
    'core',
    CORE_TRIGGER_DEFS.map((trigger) => ({
      value: `callback::core::${trigger.id}`,
      label: trigger.label,
      kind: 'callback',
      moduleName: 'core',
      nodeTypeId: trigger.id,
      defaults: trigger.defaults,
    })),
  );
  // Timer nodes come from the backend core manifest but belong in their own menu, so they're
  // filtered out of the core Triggers/Actions categories above and rebuilt below.
  for (const map of [triggerCategories, actionCategories]) {
    const core = map.get('core');
    if (core) {
      core.options = core.options.filter(
        (o) => !(o.moduleName === 'core' && TIMER_MENU_NODE_IDS.includes(o.nodeTypeId)),
      );
      if (core.options.length === 0) {
        map.delete('core');
      }
    }
  }

  addOptions(
    actionCategories,
    'core',
    'core',
    CORE_ACTION_DEFS.filter((action) => !PALETTE_HIDDEN_CORE_ACTIONS.includes(action.id)).map((action) => ({
      value: `action::core::${action.id}`,
      label: action.label,
      kind: 'action',
      moduleName: 'core',
      nodeTypeId: action.id,
      defaults: action.defaults,
    })),
  );

  const operationsByCategory = new Map<string, OperationNodeDef[]>();
  for (const op of operationNodes ?? []) {
    const list = operationsByCategory.get(op.category) ?? [];
    list.push(op);
    operationsByCategory.set(op.category, list);
  }
  for (const [category, ops] of operationsByCategory) {
    addOptions(
      actionCategories,
      `operation:${category}`,
      `${category} operations`,
      ops.map((op) => ({
        value: `operation::${op.category}::${op.id}`,
        label: op.label,
        kind: 'operation',
        moduleName: op.category,
        nodeTypeId: op.id,
        defaults: op.defaults,
      })),
    );
  }

  // Timers menu: the four node types with a blank name, then one submenu per timer already
  // used anywhere in the save file offering the same four pre-filled - so pointing a second
  // event at an existing timer needs no typing.
  const timerDefs = [
    ...(manifests ?? [])
      .filter((m: NodeManifest) => m.moduleName === 'core')
      .flatMap((m: NodeManifest) => [
        ...m.triggers.map((t: TriggerNodeDef) => ({ def: t, kind: 'callback' as const })),
        ...m.actions.map((a: ActionNodeDef) => ({ def: a, kind: 'action' as const })),
      ]),
  ].filter((entry) => TIMER_MENU_NODE_IDS.includes(entry.def.id));

  function timerOptions(timerName: string): PaletteOption[] {
    // Per-timer submenus list only the nodes that actually take a timer name.
    const defs = timerName ? timerDefs.filter((e) => TIMER_NODE_IDS.includes(e.def.id)) : timerDefs;
    return defs.map(({ def, kind }) => ({
      value: `timer::${timerName}::${def.id}`,
      label: def.label,
      kind,
      moduleName: 'core',
      nodeTypeId: def.id,
      defaults: timerName ? { ...def.defaults, name: timerName } : def.defaults,
    }));
  }

  const timerCategories: PaletteCategory[] = [];
  if (timerDefs.length > 0) {
    timerCategories.push({ key: 'timer-new', label: 'Timer Nodes', options: timerOptions('') });
    for (const usage of collectTimerUsage(watch(GRAPH_KEY))) {
      timerCategories.push({
        key: `timer-${usage.name}`,
        label: `${usage.name}  (${usage.references.length})`,
        options: timerOptions(usage.name),
      });
    }
    timerCategories.push({
      key: 'timer-manage',
      label: 'Manage Timers',
      options: [
        {
          value: 'timer::manage',
          label: 'Open Timer Manager',
          kind: 'action',
          moduleName: 'core',
          nodeTypeId: '',
          defaults: {},
          onActivate: onManageTimers,
        },
      ],
    });
  }

  // Added last so 'Plugins' sits below core/module/operation entries. Skipped entirely when
  // no plugin contributed any actions, rather than showing an empty submenu.
  if (pluginActionCategories.size > 0) {
    actionCategories.set('plugins', {
      key: 'plugins',
      label: 'Plugins',
      options: [],
      subcategories: [...pluginActionCategories.values()],
    });
  }

  function addNode(option: PaletteOption, position?: Point) {
    if (option.onActivate) {
      option.onActivate();
      return;
    }
    const graph: EventGraph = watch(graphKey);
    const nodes = graph?.nodes ?? [];
    const newNode: EventGraphNode = {
      id: uuidv4(),
      kind: option.kind,
      moduleName: option.moduleName,
      nodeTypeId: option.nodeTypeId,
      values: { ...option.defaults },
      position: position ?? {
        x: option.kind === 'callback' ? 40 : 360,
        y: 40 + nodes.length * 110,
      },
    };
    setValue(`${graphKey}.nodes`, [...nodes, newNode], { shouldDirty: true });
  }

  const groups: PaletteGroup[] = [
    { key: 'triggers', label: 'Triggers', categories: [...triggerCategories.values()] },
    { key: 'actions', label: 'Actions', categories: [...actionCategories.values()] },
    { key: 'timers', label: 'Timers', categories: timerCategories },
  ].filter((group) => group.categories.length > 0);

  return { groups, addNode };
}
