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
import {
  STORAGE_ACTION_NODE_IDS,
  STORAGE_CATEGORY_KEY,
  STORAGE_CATEGORY_LABEL,
} from '../storageNodes';
import {
  collectTimerUsage,
  TIMER_MENU_NODE_IDS,
  TIMER_NODE_IDS,
  TIMER_OPERATION_NODES,
} from '../timerUsage';
import { PaletteCategory, PaletteGroup, PaletteOption } from './paletteTypes';

// Operation-node categories that belong to an integration module, and what its submenu of them
// is called inside that module's menu.
const MODULE_OPERATION_LABELS: { [category: string]: string } = { discord: 'Components' };

// Only the first letter, so a name that is already cased on purpose ('OBS') is left alone.
function capitalize(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// The submenus Core's action nodes are sorted into, by node id. 'Legacy' holds what only exists
// for the Response scripts events used to be: the script node itself, and Trigger Event, which
// chained one event into another - a graph can just carry as many triggers as it needs.
const CORE_ACTION_GROUPS: { [label: string]: string[] } = {
  Conditional: ['if', 'platform_branch'],
  Debug: ['debug_text'],
  HTTP: ['http_request', 'promise_all'],
  Legacy: ['response', 'trigger_event'],
  Mod: ['mod'],
  OSC: ['software', 'osc_claim', 'osc_release'],
};

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
      map.set(key, { key, label: capitalize(label), options: entries });
    }
  }

  for (const manifest of manifests ?? []) {
    addOptions(
      triggerCategories,
      manifest.moduleName,
      manifest.displayName ?? manifest.moduleName,
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
      manifest.displayName ?? manifest.moduleName,
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

  // Timer operations (Is Timer Active) join the Timers menu below instead of getting a generic
  // 'timer operations' category of their own - same reasoning as the storage setters further
  // down, just for an operation node instead of an action.
  const operationsByCategory = new Map<string, OperationNodeDef[]>();
  for (const op of operationNodes ?? []) {
    if (TIMER_OPERATION_NODES.includes(op.id)) {
      continue;
    }
    const list = operationsByCategory.get(op.category) ?? [];
    list.push(op);
    operationsByCategory.set(op.category, list);
  }
  for (const [category, ops] of operationsByCategory) {
    const entries: PaletteOption[] = ops.map((op) => ({
      value: `operation::${op.category}::${op.id}`,
      label: op.label,
      kind: 'operation',
      moduleName: op.category,
      nodeTypeId: op.id,
      defaults: op.defaults,
    }));
    const moduleLabel = MODULE_OPERATION_LABELS[category];
    if (moduleLabel) {
      // A module's own value nodes sit inside that module's menu rather than in a top-level
      // '<module> operations' one - created here if the module has no action nodes to host it.
      let host = actionCategories.get(category);
      if (!host) {
        host = {
          key: category,
          label: capitalize(manifests?.find((m: NodeManifest) => m.moduleName === category)?.displayName ?? category),
          options: [],
        };
        actionCategories.set(category, host);
      }
      (host.subcategories ??= []).push({ key: `operation:${category}`, label: moduleLabel, options: entries });
      continue;
    }
    addOptions(actionCategories, `operation:${category}`, category, entries);
  }

  // The Set * Value actions join the Get * Value operations they pair with: same store, same
  // keys, and nothing behind the split but how each node happens to be declared. Done after the
  // loop above so they land at the end of a Storage Operations menu that already exists, rather
  // than creating it ahead of the other operation categories.
  const coreActionCategory = actionCategories.get('core');
  if (coreActionCategory) {
    const isStorageSetter = (option: PaletteOption) =>
      option.moduleName === 'core' && STORAGE_ACTION_NODE_IDS.includes(option.nodeTypeId);
    const storageSetters = coreActionCategory.options.filter(isStorageSetter);
    if (storageSetters.length > 0) {
      coreActionCategory.options = coreActionCategory.options.filter(
        (option) => !isStorageSetter(option),
      );
      if (coreActionCategory.options.length === 0) {
        actionCategories.delete('core');
      }
      addOptions(actionCategories, STORAGE_CATEGORY_KEY, STORAGE_CATEGORY_LABEL, storageSetters);
    }
  }

  // Core's own action nodes sorted into what they are for, so the menu isn't one long list of
  // unrelated things. Whatever a group doesn't claim stays in the core list itself.
  const coreHost = actionCategories.get('core');
  if (coreHost) {
    for (const [groupLabel, nodeTypeIds] of Object.entries(CORE_ACTION_GROUPS)) {
      const grouped = coreHost.options.filter((option) => nodeTypeIds.includes(option.nodeTypeId));
      if (grouped.length === 0) {
        continue;
      }
      coreHost.options = coreHost.options.filter((option) => !grouped.includes(option));
      (coreHost.subcategories ??= []).push({
        key: `core-group:${groupLabel}`,
        label: groupLabel,
        options: grouped,
      });
    }
  }

  // Every core operation category (math, string, storage, ...) folds into one 'Operations'
  // submenu of core, rather than each being its own row of the Actions menu. Done after the
  // storage setters have joined theirs above, so that one moves with the rest.
  const operationCategories = [...actionCategories.values()].filter((c) => c.key.startsWith('operation:'));
  if (operationCategories.length > 0) {
    for (const category of operationCategories) {
      actionCategories.delete(category.key);
    }
    let core = actionCategories.get('core');
    if (!core) {
      core = { key: 'core', label: 'Core', options: [] };
      actionCategories.set('core', core);
    }
    (core.subcategories ??= []).push({
      key: 'operations',
      label: 'Operations',
      options: [],
      subcategories: operationCategories,
    });
  }

  // Timers menu: the node types with a blank name, then one submenu per timer already
  // used anywhere in the save file offering the same nodes pre-filled - so pointing a second
  // event at an existing timer needs no typing.
  const timerDefs = [
    ...(manifests ?? [])
      .filter((m: NodeManifest) => m.moduleName === 'core')
      .flatMap((m: NodeManifest) => [
        ...m.triggers.map((t: TriggerNodeDef) => ({ def: t, kind: 'callback' as const })),
        ...m.actions.map((a: ActionNodeDef) => ({ def: a, kind: 'action' as const })),
      ]),
    // Is Timer Active is an operation node (a query, no exec flow), so it comes from the
    // separate operationNodes list rather than a manifest's triggers/actions.
    ...(operationNodes ?? [])
      .filter((op: OperationNodeDef) => TIMER_OPERATION_NODES.includes(op.id))
      .map((op: OperationNodeDef) => ({ def: op, kind: 'operation' as const })),
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
