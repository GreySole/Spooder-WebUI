import { EventGraph } from '../../../Types';

// Rewrites an event's key on every node referencing it by that key, across all events -
// the 'Trigger Event' node (free-text eventName) and a 'mod' node's event target (dropdown,
// but a graph saved before this rename and not reopened would still hold the old key).
// Returns the node lists that actually changed, keyed by event id, so the caller can setValue
// only those. Mirrors renameTimerInGraphs in timerUsage.ts.
export function renameEventInGraphs(
  graphs: { [eventId: string]: EventGraph },
  from: string,
  to: string,
): { [eventId: string]: EventGraph['nodes'] } {
  const changed: { [eventId: string]: EventGraph['nodes'] } = {};

  for (const eventId in graphs) {
    const graph = graphs[eventId];
    let touched = false;
    const nodes = (graph?.nodes ?? []).map((node) => {
      if (node.moduleName !== 'core') {
        return node;
      }
      if (node.nodeTypeId === 'trigger_event' && node.values?.eventName === from) {
        touched = true;
        return { ...node, values: { ...node.values, eventName: to } };
      }
      if (node.nodeTypeId === 'mod' && node.values?.targettype === 'event' && node.values?.target === from) {
        touched = true;
        return { ...node, values: { ...node.values, target: to } };
      }
      return node;
    });
    if (touched) {
      changed[eventId] = nodes;
    }
  }
  return changed;
}
