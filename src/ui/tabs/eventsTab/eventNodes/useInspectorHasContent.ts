import { useFormContext } from 'react-hook-form';
import useEvents from '../../../../app/hooks/useEvents';
import { EventGraph } from '../../../Types';
import { GRAPH_KEY } from '../FormKeys';
import { resolveNodeDef } from './nodeDefLookup';
import { checkNodeConflicts } from './softwareAction/SoftwareConflictCheck';

// Whether selecting this node should open the inspector at all.
//
// Every node's own fields are edited inline on its card, so the panel exists only for what a
// static form def can't express - arg naming, plugin/mod pickers, the script tester, a conflict
// warning. For most node types that leaves nothing but the node's name and a delete button, so
// the panel is kept shut rather than opened empty.
//
// Mirrors NodeInspector's editor switch: a node type gets an entry here exactly when it gets an
// editor there, and the two conditional editors are asked the same question their own render
// asks (Response draws nothing for a 'clear_recurring' script, OSC Send nothing without a
// conflicting address).
export default function useInspectorHasContent(eventName: string, nodeId: string): boolean {
  const { watch } = useFormContext();
  const { getNodeManifest, getOperationNodes } = useEvents();
  const { manifests } = getNodeManifest();
  const { operationNodes } = getOperationNodes();
  // The whole graphs subtree: the conflict check spans every event, and watching it also keeps
  // this in step as the values it reads are edited.
  const graphs: { [id: string]: EventGraph } = watch(GRAPH_KEY);

  const nodes = graphs?.[eventName]?.nodes ?? [];
  const nodeIndex = nodes.findIndex((n) => n.id === nodeId);
  const node = nodeIndex >= 0 ? nodes[nodeIndex] : undefined;
  if (!node) {
    return false;
  }
  if (!resolveNodeDef(node, manifests, operationNodes)) {
    // An unresolvable node type has no card controls either; the panel is the only place that
    // reports it.
    return true;
  }
  if (node.moduleName !== 'core') {
    return false;
  }
  switch (node.nodeTypeId) {
    case 'osc_trigger':
    case 'plugin':
    case 'mod':
      return true;
    case 'response':
      return node.values?.etype !== 'clear_recurring';
    case 'software':
      return checkNodeConflicts(graphs, eventName, nodeIndex).length > 0;
    default:
      return false;
  }
}
