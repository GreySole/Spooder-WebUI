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

// Core nodes whose fields are drawn by a bespoke inspector panel (see NodeInspector's
// switch). The node card must NOT also render inline controls for these: both bind the same
// form key, and the shared Form* components emit `<label htmlFor={id}><input id={id}>` with an
// id derived from that key - so rendering both puts duplicate ids in the document and the
// inspector's label focuses the card's input instead of its own, making the field look dead.
// Only 'plugin' and 'mod' remain: plugin's form is generated per plugin event (cascading
// plugin -> event -> that event's own fields) and mod needs dynamic target pickers, so
// neither can be described by a static form def. 'osc_trigger', 'software' and 'response'
// all draw their fields on the card; their panels keep only the extras.
export const BESPOKE_EDITOR_CORE_NODES = ['plugin', 'mod'];

export const CORE_ACTION_DEFS: ActionNodeDef[] = [
  {
    id: 'response',
    label: 'Response',
    description: 'Runs a response script (chat message, recurring message, etc).',
    form: {
      etype: {
        label: 'Type',
        type: 'select',
        portType: 'string',
        options: {
          selections: {
            oneshot: 'One Shot',
            recurring: 'Recurring',
            clear_recurring: 'Clear Recurring Message',
          },
        },
      },
      message: {
        label: 'Script',
        // Still a code editor while this node is: Response is the legacy path, and its value is
        // a response script rather than the plain text the graph's own string nodes produce.
        type: 'code',
        portType: 'string',
        showif: { variable: 'etype', condition: 'notEquals', value: 'clear_recurring' },
      },
      interval_key: {
        label: 'Interval Key',
        type: 'text',
        portType: 'string',
        showif: { variable: 'etype', condition: 'notEquals', value: 'oneshot' },
      },
      interval: {
        label: 'Interval (Minutes)',
        type: 'number',
        portType: 'number',
        showif: { variable: 'etype', condition: 'equals', value: 'recurring' },
      },
      // What the script reads as extra[]. Unwired it falls back to whatever the trigger
      // supplied, which is how every existing event behaves; wiring it is the way graph data
      // (a Search & Match result, say) reaches a script, since scripts take no other input.
      extra: {
        label: 'Extra',
        type: 'port',
        portType: 'any',
        showif: { variable: 'etype', condition: 'notEquals', value: 'clear_recurring' },
      },
    },
    defaults: { etype: 'oneshot', message: '', interval_key: '', interval: 5 },
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
    },
  },
  {
    // The id stays 'software' - it's what saved graphs and EventGraphExecutor dispatch on;
    // only the display name changes.
    id: 'software',
    label: 'OSC Send',
    description: 'Sends an OSC message to a configured UDP destination.',
    form: {
      // The destination list comes from the user's configured UDP servers at runtime, so a
      // static `select` can't describe it - it resolves to FormUdpSelectDropdown through the
      // custom renderer registry (fieldRenderers.ts).
      dest_udp: {
        label: 'Destination',
        type: 'custom',
        portType: 'string',
        options: { component: 'udpSelect' },
      },
      address: { label: 'Address', type: 'text', portType: 'string' },
      valueOn: { label: 'Value On', type: 'text', portType: 'string' },
      valueOff: { label: 'Value Off', type: 'text', portType: 'string' },
      etype: {
        label: 'Event Type',
        type: 'select',
        portType: 'string',
        options: {
          selections: { timed: 'Timed', 'button-press': 'Button Press', oneshot: 'One Shot' },
        },
      },
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
      priority: 0,
    },
  },
];

export const CORE_TRIGGER_DEFS: TriggerNodeDef[] = [
  {
    // Likewise, the id stays 'osc_trigger' so existing events keep resolving.
    id: 'osc_trigger',
    label: 'OSC Receive',
    description: 'Fires on an OSC address and exposes the message payload as wireable outputs.',
    // Neither field declares a portType, so both render as inline controls on the node card
    // with no input socket - the address is the node's one built-in condition, and everything
    // else is expressed with logic nodes wired off the arg outputs.
    form: {
      address: { label: 'Address', type: 'text' },
      argCount: { label: 'Arg Count', type: 'number' },
    },
    defaults: {
      handletype: 'trigger',
      address: '/',
      argCount: 0,
      // Display-only, index-aligned to the arg outputs. Port ids stay arg0..argN-1 so
      // renaming a label never invalidates an existing edge.
      argLabels: [],
      argTypes: [],
      condition_groups_on: [],
      condition_groups_off: [],
      search: { arg: 0, command: '' },
    },
    // Real outputs are synthesized per node from argCount/argLabels/argTypes - see
    // buildOscTriggerOutputs in nodeDefLookup.ts.
    outputs: [],
  },
];

export function findCoreActionDef(nodeTypeId: string): ActionNodeDef | undefined {
  return CORE_ACTION_DEFS.find((d) => d.id === nodeTypeId);
}

export function findCoreTriggerDef(nodeTypeId: string): TriggerNodeDef | undefined {
  return CORE_TRIGGER_DEFS.find((d) => d.id === nodeTypeId);
}
