import { EventGraph, EventGraphNode } from '../../../Types';

export type GraphTriggerKind = 'chat' | 'twitch' | 'osc';

export function getGraphTriggerKinds(graph?: EventGraph): GraphTriggerKind[] {
  if (!graph) {
    return [];
  }
  const kinds = new Set<GraphTriggerKind>();
  for (const node of graph.nodes) {
    if (node.kind !== 'callback') {
      continue;
    }
    if (node.moduleName === 'twitch' && node.nodeTypeId === 'chat_command') {
      kinds.add('chat');
    } else if (
      node.moduleName === 'twitch' &&
      (node.nodeTypeId === 'channel_point_redeem' || node.nodeTypeId === 'eventsub_event')
    ) {
      kinds.add('twitch');
    } else if (node.moduleName === 'core' && node.nodeTypeId === 'osc_trigger') {
      kinds.add('osc');
    }
  }
  return [...kinds];
}

export function findChatCommandNode(graph?: EventGraph): EventGraphNode | undefined {
  return graph?.nodes.find((n) => n.moduleName === 'twitch' && n.nodeTypeId === 'chat_command');
}
