import React from 'react';
import { useFormContext } from 'react-hook-form';
import { EventGraph } from '../../../../Types';
import { GRAPH_KEY } from '../../FormKeys';

interface SoftwareConflictCheckProps {
  eventName: string;
  nodeIndex: number;
}

// Exported so the inspector can ask whether this node has a warning to show *before* opening
// its panel: a conflict check is all an OSC Send node's panel contains, so with no conflict
// there is nothing to open. See useInspectorHasContent.
export function checkNodeConflicts(
  graphs: { [id: string]: EventGraph },
  eventName: string,
  nodeIndex: number,
) {
  const conflicts: string[] = [];
  const thisNode = graphs[eventName]?.nodes[nodeIndex];
  const checkAddress = thisNode?.values?.address;
  const checkValue = thisNode?.values?.valueOn;
  if (checkAddress == null || checkValue == null) {
    return conflicts;
  }

  for (const e in graphs) {
    for (let n = 0; n < graphs[e].nodes.length; n++) {
      if (e === eventName && n === nodeIndex) {
        continue;
      }
      const node = graphs[e].nodes[n];
      if (node.moduleName !== 'core' || node.nodeTypeId !== 'software') {
        continue;
      }
      if (node.values?.address !== checkAddress) {
        continue;
      }
      if (isNaN(checkValue) && isNaN(node.values?.valueOn)) {
        if (String(checkValue).includes(',')) {
          if (String(node.values?.valueOn).includes(',')) {
            if (String(node.values?.valueOn).split(',')[0] === String(checkValue).split(',')[0]) {
              conflicts.push(`${e}[${n}]`);
            }
          }
        } else {
          conflicts.push(`${e}[${n}]`);
        }
      }
    }
  }

  return conflicts;
}

export default function SoftwareConflictCheck(props: SoftwareConflictCheckProps) {
  const { eventName, nodeIndex } = props;
  const { watch } = useFormContext();
  const graphs = watch(GRAPH_KEY);
  const conflicts = checkNodeConflicts(graphs, eventName, nodeIndex);

  return conflicts.length > 0 ? (
    <div className='type-label-conflicts'>
      <label>
        {conflicts.length +
          ' event' +
          (conflicts.length == 1 ? '' : 's') +
          " share this address. Use 'priority' to handle the overlap"}
      </label>
      <label>Conflicts: {conflicts.join(', ')}</label>
    </div>
  ) : null;
}
