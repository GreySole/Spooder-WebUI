import React from 'react';
import { useFormContext } from 'react-hook-form';
import { EventGraph } from '../../../../Types';
import { GRAPH_KEY } from '../../FormKeys';

interface SoftwareConflictCheckProps {
  eventName: string;
  nodeIndex: number;
}

// Split from the component so the check can be run without rendering it - the panel itself is
// always worth opening now (it holds the UDP server manager too), so this is only asked to
// decide whether the warning below has anything to say.
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
          ' send to this address. Whichever runs last wins - use OSC Claim/OSC Release instead' +
          ' to decide the overlap by priority'}
      </label>
      <label>Conflicts: {conflicts.join(', ')}</label>
    </div>
  ) : null;
}
