export const GRAPH_KEY = 'graphs';
export const GROUP_KEY = 'groups';
export const DISABLED_GROUP_KEY = 'disabledGroups';

export function buildKey(...keys: string[]) {
  return keys.join('.');
}

export function buildGraphKey(eventName: string) {
  return `${GRAPH_KEY}.${eventName}`;
}

export function buildNodeKey(eventName: string, nodeIndex: number) {
  return buildKey(buildGraphKey(eventName), 'nodes', `${nodeIndex}`);
}

export function buildNodeValueKey(eventName: string, nodeIndex: number, ...fields: string[]) {
  return buildKey(buildNodeKey(eventName, nodeIndex), 'values', ...fields);
}
