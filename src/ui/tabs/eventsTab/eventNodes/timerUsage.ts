import { EventGraph } from '../../../Types';

// The four timer node types. Kept here so the palette can route them out of the generic
// 'core' category and the manager can find every node referencing a timer.
export const TIMER_ACTION_NODES = ['start_timer', 'stop_timer'];
export const TIMER_TRIGGER_NODES = ['timer_elapsed', 'timer_tick'];
// Operation nodes (a pure query, no exec flow) that take a timer name - currently just the one
// that reads a timer's live running state.
export const TIMER_OPERATION_NODES = ['is_timer_active'];
export const TIMER_NODE_IDS = [
  ...TIMER_ACTION_NODES,
  ...TIMER_TRIGGER_NODES,
  ...TIMER_OPERATION_NODES,
];

// What the Timers menu offers. 'delay' is grouped here because it's the lightweight
// alternative to a named timer, but it's deliberately not a TIMER_NODE_ID: it has no name and
// nothing to manage, so the manager must not pick it up.
export const TIMER_MENU_NODE_IDS = [...TIMER_NODE_IDS, 'delay'];

export function isTimerNode(moduleName: string, nodeTypeId: string) {
  return moduleName === 'core' && TIMER_NODE_IDS.includes(nodeTypeId);
}

export interface TimerReference {
  eventId: string;
  eventName: string;
  nodeId: string;
  nodeTypeId: string;
}

export interface TimerUsage {
  name: string;
  references: TimerReference[];
}

// Collects every named timer across the *whole* save file, not just the open event: timer
// names are global, so a Start Timer in one event drives a Timer Elapsed in another. The
// events form holds all graphs under one key, so this needs no API call.
export function collectTimerUsage(graphs: { [eventId: string]: EventGraph } | undefined): TimerUsage[] {
  const byName = new Map<string, TimerReference[]>();

  for (const eventId in graphs ?? {}) {
    const graph = graphs![eventId];
    for (const node of graph?.nodes ?? []) {
      if (!isTimerNode(node.moduleName, node.nodeTypeId)) {
        continue;
      }
      const name = node.values?.name;
      if (!name) {
        // An unnamed timer node is still being authored; nothing to group it under.
        continue;
      }
      if (!byName.has(name)) {
        byName.set(name, []);
      }
      byName.get(name)!.push({
        eventId,
        eventName: graph.name ?? eventId,
        nodeId: node.id,
        nodeTypeId: node.nodeTypeId,
      });
    }
  }

  return [...byName.entries()]
    .map(([name, references]) => ({ name, references }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Rewrites a timer's name on every node referencing it, across all events. Returns the graphs
// that actually changed, keyed by event id, so the caller can setValue only those.
export function renameTimerInGraphs(
  graphs: { [eventId: string]: EventGraph },
  from: string,
  to: string,
): { [eventId: string]: EventGraph['nodes'] } {
  const changed: { [eventId: string]: EventGraph['nodes'] } = {};

  for (const eventId in graphs) {
    const graph = graphs[eventId];
    let touched = false;
    const nodes = (graph?.nodes ?? []).map((node) => {
      if (!isTimerNode(node.moduleName, node.nodeTypeId) || node.values?.name !== from) {
        return node;
      }
      touched = true;
      return { ...node, values: { ...node.values, name: to } };
    });
    if (touched) {
      changed[eventId] = nodes;
    }
  }
  return changed;
}

// Removes every node referencing a timer, plus any edge attached to those nodes - the same
// node+edge cleanup a single-node delete performs, applied across events.
export function deleteTimerFromGraphs(
  graphs: { [eventId: string]: EventGraph },
  name: string,
): { [eventId: string]: { nodes: EventGraph['nodes']; edges: EventGraph['edges'] } } {
  const changed: { [eventId: string]: { nodes: EventGraph['nodes']; edges: EventGraph['edges'] } } = {};

  for (const eventId in graphs) {
    const graph = graphs[eventId];
    const doomed = new Set(
      (graph?.nodes ?? [])
        .filter((node) => isTimerNode(node.moduleName, node.nodeTypeId) && node.values?.name === name)
        .map((node) => node.id),
    );
    if (doomed.size === 0) {
      continue;
    }
    changed[eventId] = {
      nodes: (graph.nodes ?? []).filter((node) => !doomed.has(node.id)),
      edges: (graph.edges ?? []).filter((e) => !doomed.has(e.fromNode) && !doomed.has(e.toNode)),
    };
  }
  return changed;
}
