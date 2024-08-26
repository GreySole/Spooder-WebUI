export const EVENT_KEY = 'events';
export const GROUP_KEY = 'groups';

export function buildKey(...keys: string[]) {
  return keys.join('.');
}

export function buildEventKey(eventName: string) {
  return `${EVENT_KEY}.${eventName}`;
}

export function buildTriggerKey(eventName: string, triggerName: string) {
  return `${EVENT_KEY}.${eventName}.triggers.${triggerName}`;
}

export function buildCommandKey(eventName: string, commandIndex: number) {
  return `${EVENT_KEY}.${eventName}.commands.${commandIndex}`;
}
