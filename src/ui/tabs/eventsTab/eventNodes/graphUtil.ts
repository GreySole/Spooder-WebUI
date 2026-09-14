import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCommentDots, faNetworkWired, faPlug } from '@fortawesome/free-solid-svg-icons';
import { ModuleDefinition } from '@spooder/webui-module-sdk';
import { EventGraph, EventGraphNode } from '../../../Types';

// Chat and OSC are core triggers every install has regardless of which modules are attached;
// anything else is that callback node's own module (twitch, discord, obs, ...), so a module
// being installed/removed needs no case added or removed here.
export type GraphTriggerKind = string;

// A fresh Chat Command/Chat Message node from the palette is moduleName 'core', but one
// migrated from a legacy flat event is moduleName 'twitch' (see EventGraphMigration.ts's
// CHAT_TRIGGER_NODE_TYPES) - matched on nodeTypeId alone so both are recognized as 'chat'.
const CHAT_TRIGGER_NODE_TYPES = ['chat_command', 'chat_message'];

export function getGraphTriggerKinds(graph?: EventGraph): GraphTriggerKind[] {
  if (!graph) {
    return [];
  }
  const kinds = new Set<GraphTriggerKind>();
  for (const node of graph.nodes) {
    if (node.kind !== 'callback') {
      continue;
    }
    if (CHAT_TRIGGER_NODE_TYPES.includes(node.nodeTypeId)) {
      kinds.add('chat');
    } else if (node.moduleName === 'core' && node.nodeTypeId === 'osc_trigger') {
      kinds.add('osc');
    } else if (node.moduleName !== 'core') {
      kinds.add(node.moduleName);
    }
  }
  return [...kinds];
}

// Chat first (the most common trigger), then every module's own kind alphabetically, then OSC
// last - a stable order regardless of which node happened to be added to the graph first.
export function orderTriggerKinds(kinds: Iterable<GraphTriggerKind>): GraphTriggerKind[] {
  const remaining = new Set(kinds);
  const ordered: GraphTriggerKind[] = [];
  if (remaining.delete('chat')) {
    ordered.push('chat');
  }
  const hadOsc = remaining.delete('osc');
  ordered.push(...[...remaining].sort());
  if (hadOsc) {
    ordered.push('osc');
  }
  return ordered;
}

export interface TriggerKindIcon {
  icon: IconProp | string;
  tooltipText: string;
}

// Resolves a kind to its icon/tooltip. 'chat' and 'osc' are the two kinds no module owns;
// everything else is looked up by moduleName in the live module registry
// (webui/main/src/src/modules) - the same source the nav tabs use for a module's icon - so
// Twitch/Discord/OBS/any future module is picked up with no per-module case to add here.
export function triggerKindIcon(
  kind: GraphTriggerKind,
  modules: readonly ModuleDefinition[],
): TriggerKindIcon {
  if (kind === 'chat') {
    return { icon: faCommentDots, tooltipText: 'Has a chat command trigger' };
  }
  if (kind === 'osc') {
    return { icon: faNetworkWired, tooltipText: 'Has an OSC trigger' };
  }
  const module = modules.find((m) => m.key === kind);
  return {
    // A graph can reference a module that isn't currently installed/loaded (e.g. right after
    // it was removed) - falls back to a generic plug icon rather than showing nothing.
    icon: module?.tabConfig.icon ?? faPlug,
    tooltipText: `Has a ${module?.tabConfig.label ?? kind} trigger`,
  };
}

export function findChatCommandNode(graph?: EventGraph): EventGraphNode | undefined {
  return graph?.nodes.find((n) => n.nodeTypeId === 'chat_command');
}
