import { ActionNodeDef, TriggerNodeDef } from '../../../Types';

// The backend's 'core' manifest (see NodeRegistryService/CoreNodeManifest) covers most core
// node types generically now. These are just the exceptions it doesn't declare: nodes whose
// forms are edited by bespoke inspector panels rather than the generic NodeForm renderer, so
// the `form` here only needs to be non-empty for typing purposes - `defaults`/`label` are what
// the palette and new-node creation actually use. findTriggerDef/findActionDef in
// nodeDefLookup.ts only fall back to these when the backend manifest doesn't have the node.

export const CORE_ACTION_DEFS: ActionNodeDef[] = [
  {
    id: 'response',
    label: 'Response',
    description: 'Runs a response script (chat message, recurring message, etc).',
    form: {},
    defaults: { etype: 'oneshot', message: '', delay: 0, interval_key: '', interval: 5 },
  },
  {
    id: 'plugin',
    label: 'Plugin Event',
    description: 'Sends a start/stop event to an installed plugin.',
    form: {},
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
    form: {},
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
    form: {},
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
