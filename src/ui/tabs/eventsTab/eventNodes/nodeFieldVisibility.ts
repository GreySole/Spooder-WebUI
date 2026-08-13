// Evaluates a field's `showif` against a node's current values. Kept in its own module (free
// of React/component imports) because both the inspector form and the canvas layout math need
// it: NodeFieldInput/GenericNodeForm to decide what to draw, nodeLayout to decide row heights
// and socket offsets. If those two ever disagreed, sockets would drift from their rows.
export function fieldSatisfiesShowif(showif: any, values: { [key: string]: any }) {
  if (!showif) {
    return true;
  }
  const currentValue = values?.[showif.variable];
  switch (showif.condition) {
    case 'equals':
      return currentValue === showif.value;
    default:
      return true;
  }
}
