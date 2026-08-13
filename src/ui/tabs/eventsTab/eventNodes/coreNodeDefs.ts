import { ActionNodeDef, TriggerNodeDef } from '../../../Types';

// The backend's 'core' manifest (see NodeRegistryService/CoreNodeManifest) covers most core
// node types generically now. These are just the exceptions it doesn't declare: nodes whose
// forms are edited by bespoke inspector panels (ResponseNodeEditor, PluginNodeEditor, etc.)
// rather than the generic NodeForm renderer - `defaults`/`label` are what the palette and
// new-node creation actually use, and the bespoke editors read/write values directly rather
// than iterating `form`. `form` still matters though: computeNodePortLayout reads it to
// decide which fields get a wireable input socket on the node card (any field with a
// `portType`), regardless of which editor draws the field itself. findTriggerDef/
// findActionDef in nodeDefLookup.ts only fall back to these when the backend manifest
// doesn't have the node.

// Core actions that stay fully supported (findActionDef still resolves them, and their
// bespoke inspector editors still open) but are no longer offered when adding a new node.
// 'plugin' is the legacy generic "pick a plugin + type an event name" node, superseded by
// the dedicated per-event nodes under the palette's Plugins submenu; events saved with it
// keep working and keep opening in PluginNodeEditor.
export const PALETTE_HIDDEN_CORE_ACTIONS = ['plugin'];

export const CORE_ACTION_DEFS: ActionNodeDef[] = [
  {
    id: 'response',
    label: 'Response',
    description: 'Runs a response script (chat message, recurring message, etc).',
    form: {
      etype: { label: 'Type', type: 'select', portType: 'string' },
      message: { label: 'Script', type: 'code', portType: 'string' },
      interval_key: { label: 'Interval Key', type: 'text', portType: 'string' },
      interval: { label: 'Interval (Minutes)', type: 'number', portType: 'number' },
    },
    defaults: { etype: 'oneshot', message: '', delay: 0, interval_key: '', interval: 5 },
  },
  {
    id: 'plugin',
    label: 'Plugin Event',
    description: 'Sends a start/stop event to an installed plugin.',
    form: {
      pluginname: { label: 'Plugin', type: 'text', portType: 'string' },
      eventname: { label: 'Event Name', type: 'text', portType: 'string' },
      stop_eventname: { label: 'End Event Name', type: 'text', portType: 'string' },
      etype: { label: 'Event Type', type: 'select', portType: 'string' },
      duration: { label: 'Duration (Seconds)', type: 'number', portType: 'number' },
    },
    defaults: {
      pluginname: '',
      eventname: '',
      stop_eventname: '',
      etype: 'oneshot',
      duration: 60,
      delay: 0,
    },
  },
  {
    id: 'mod',
    label: 'Mod Action',
    description: 'Locks/unlocks, spam-guards, or stops another event.',
    form: {
      function: { label: 'Function', type: 'select', portType: 'string' },
      targettype: { label: 'Target Type', type: 'select', portType: 'string' },
      target: { label: 'Target', type: 'text', portType: 'string' },
      etype: { label: 'Handle Type', type: 'select', portType: 'string' },
      duration: { label: 'Duration (Seconds)', type: 'number', portType: 'number' },
    },
    defaults: {
      function: 'lock',
      targettype: 'event',
      target: '',
      etype: 'toggle',
      duration: 60,
      delay: 0,
    },
  },
  {
    id: 'software',
    label: 'Software (UDP)',
    description: 'Sends a value to a UDP-connected device/software.',
    form: {
      dest_udp: { label: 'Destination', type: 'text', portType: 'string' },
      address: { label: 'Address', type: 'text', portType: 'string' },
      valueOn: { label: 'Value On', type: 'text', portType: 'string' },
      valueOff: { label: 'Value Off', type: 'text', portType: 'string' },
      etype: { label: 'Event Type', type: 'select', portType: 'string' },
      duration: { label: 'Duration (Seconds)', type: 'number', portType: 'number' },
      priority: { label: 'Priority', type: 'number', portType: 'number' },
    },
    defaults: {
      dest_udp: '-1',
      address: '',
      valueOn: '1',
      valueOff: '0',
      etype: 'timed',
      duration: 60,
      delay: 0,
      priority: 0,
    },
  },
];

export const CORE_TRIGGER_DEFS: TriggerNodeDef[] = [
  {
    id: 'osc_trigger',
    label: 'OSC',
    description: 'Fires when an OSC address matches the configured condition(s).',
    form: {},
    defaults: {
      handletype: 'trigger',
      address: '/',
      condition_groups_on: [],
      condition_groups_off: [],
      search: { arg: 0, command: '' },
    },
    outputs: [],
  },
];

export function findCoreActionDef(nodeTypeId: string): ActionNodeDef | undefined {
  return CORE_ACTION_DEFS.find((d) => d.id === nodeTypeId);
}

export function findCoreTriggerDef(nodeTypeId: string): TriggerNodeDef | undefined {
  return CORE_TRIGGER_DEFS.find((d) => d.id === nodeTypeId);
}
