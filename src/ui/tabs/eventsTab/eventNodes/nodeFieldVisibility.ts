import { NodeFieldDef, NodeForm } from '../../../Types';

// Evaluates a field's `showif` against a node's current values. Kept in its own module (free
// of React/component imports) because both the inspector form and the canvas layout math need
// it: NodeFieldInput to decide what to draw, nodeLayout to decide row heights
// and socket offsets. If those two ever disagreed, sockets would drift from their rows.
export function fieldSatisfiesShowif(showif: any, values: { [key: string]: any }) {
  if (!showif) {
    return true;
  }
  const currentValue = values?.[showif.variable];
  switch (showif.condition) {
    case 'equals':
      return currentValue === showif.value;
    case 'notEquals':
      return currentValue !== showif.value;
    default:
      return true;
  }
}

// Whether a field holds anything: either the user typed a value into it, or another node's
// output is wired to its port (in which case the value only exists at run time).
export function isFieldFilled(
  fieldName: string,
  values: { [key: string]: any } | undefined,
  connectedInputPorts?: Set<string>,
): boolean {
  if (connectedInputPorts?.has(fieldName)) {
    return true;
  }
  const value = values?.[fieldName];
  return value !== undefined && value !== null && String(value) !== '';
}

// `growable` fields (see NodeFieldDef) form a list that extends itself as it's used: the slot
// appears once everything before it is filled, so the node always offers exactly one empty
// slot and no more. A slot that already holds something stays visible whatever precedes it -
// otherwise clearing an earlier slot would hide a filled one, which would keep feeding the
// node's result with nothing on the card to show it.
export function growableFieldVisible(
  fieldName: string,
  field: NodeFieldDef,
  form: NodeForm | undefined,
  values: { [key: string]: any } | undefined,
  connectedInputPorts?: Set<string>,
): boolean {
  if (!field.growable) {
    return true;
  }
  if (isFieldFilled(fieldName, values, connectedInputPorts)) {
    return true;
  }
  const fieldNames = Object.keys(form ?? {});
  return fieldNames
    .slice(0, fieldNames.indexOf(fieldName))
    .every((name) => isFieldFilled(name, values, connectedInputPorts));
}
