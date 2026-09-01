// Defined in the module SDK - a module writing into the event form has to build the same keys
// the host does, or its values land somewhere the form never reads.
export {
  buildGraphKey,
  buildKey,
  buildNodeKey,
  buildNodeValueKey,
  DISABLED_GROUP_KEY,
  GRAPH_KEY,
  GROUP_KEY,
} from '@spooder/webui-module-sdk';
