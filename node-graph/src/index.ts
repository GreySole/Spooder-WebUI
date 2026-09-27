import './styles/nodeGraph.scss';

// The editor itself: renders one event's graph, inside a react-hook-form context holding the
// event graphs form (see the module SDK's form keys) and a NodeGraphHostProvider.
export { default as EventNodes } from './EventNodes';

// What an app supplies to embed it.
export { NodeGraphHostProvider, useNodeGraphHost } from './host';
export type {
  NodeGraphComponents,
  NodeGraphHost,
  NodeGraphHostEvents,
  NodeGraphHostPlugins,
} from './host';
export { setModuleSource, useModules } from './moduleSource';
export type { ModuleSource } from './moduleSource';

// Graph types and helpers the rest of an app shares with the editor.
export * from './types';
export { renameEventInGraphs } from './eventUsage';
export { getGraphTriggerKinds, orderTriggerKinds, triggerKindIcon } from './graphUtil';
export type { GraphTriggerKind } from './graphUtil';

// Pieces other screens borrow from the editor.
export { default as GraphSidePanel, useGraphPanelWidth } from './GraphSidePanel';
export { CascadeMenuButton } from './palette/CascadeMenu';
export type { MenuCategory, MenuOption } from './palette/CascadeMenu';
export { default as FormCodeInput } from './components/FormCodeInput';
