import type {
  KeyedObject,
  NodeFieldDef,
  NodePortDataType,
  SelectOption,
  TriggerTestDef,
  TriggerTestParam,
} from '@spooder/webui-module-sdk';

// The node contract is defined in the module SDK, since modules describe their fields with it.
export type {
  KeyedObject,
  NodeFieldDef,
  NodePortDataType,
  SelectOption,
  TriggerTestDef,
  TriggerTestParam,
};

export enum OSCConditionType {
  equal = '==',
  notEqual = '!=',
  greaterThanOrEqual = '>=',
  lessThanOrEqual = '<=',
  greaterThan = '>',
  lessThan = '<',
  searchAndMatch = 'search_and_match',
}

export interface NodePortDef {
  id: string;
  label: string;
  dataType: NodePortDataType;
}


export interface NodeForm {
  [fieldName: string]: NodeFieldDef;
}

export interface TriggerNodeDef {
  id: string;
  label: string;
  description?: string;
  // How wide this node's card should be by default, in graph units. Omit to take NODE_WIDTH -
  // only worth setting for a node whose controls need the room (an asset picker with a preview,
  // a code editor). A card the user has resized keeps their width instead.
  nodeWidth?: number;
  form: NodeForm;
  defaults: KeyedObject;
  outputs: NodePortDef[];
  // Set by the owning module when it can fire this trigger on demand. Its presence is what
  // puts a test panel in the inspector; the panel itself comes from the module (see
  // ModuleDefinition.nodeTestPanel), since only the module knows how to run the test.
  test?: TriggerTestDef;
}



export interface ActionNodeDef {
  id: string;
  label: string;
  description?: string;
  // See TriggerNodeDef.nodeWidth. A plugin sets this per event in its events-form.json.
  nodeWidth?: number;
  form: NodeForm;
  defaults: KeyedObject;
  outputs?: NodePortDef[];
  // Named execution-flow output ports for branching actions (e.g. an 'if' node's
  // 'then'/'else'). Omitted/empty => the node has the usual single unlabeled 'exec' output.
  execOutputs?: { id: string; label: string }[];
  supportsTimed?: boolean;
}

export interface OperationNodeDef {
  id: string;
  label: string;
  description?: string;
  category: 'math' | 'string' | 'logic' | 'storage' | 'array' | 'timer' | 'discord';
  // See TriggerNodeDef.nodeWidth.
  nodeWidth?: number;
  form: NodeForm;
  defaults: KeyedObject;
  outputs: NodePortDef[];
}

export interface NodeManifest {
  moduleName: string;
  // How menus show the module, from `spooder_module.displayName` in its package.json.
  displayName?: string;
  triggers: TriggerNodeDef[];
  actions: ActionNodeDef[];
  // Set for manifests generated from a plugin's events-form.json, so the node palette can
  // group them under a single 'Plugins' submenu instead of one top-level entry per plugin.
  isPlugin?: boolean;
}

export type EventGraphNodeKind = 'callback' | 'action' | 'operation';

export interface EventGraphNode {
  id: string;
  kind: EventGraphNodeKind;
  moduleName: string;
  nodeTypeId: string;
  // Manual/literal values for fields not fed by an incoming data edge.
  values: KeyedObject;
  delay?: number;
  position: { x: number; y: number };
  // A width the user dragged this card to, overriding the node type's own `nodeWidth` and
  // NODE_WIDTH. Absent on every node nobody has resized, which is most of them.
  width?: number;
}

export interface EventGraphEdge {
  id: string;
  fromNode: string;
  // 'exec' for execution-flow edges (this node runs next); an output port id for data edges.
  fromPort: string;
  toNode: string;
  // 'exec' for execution-flow edges; an input field/port id for data edges.
  toPort: string;
}

export interface EventGraph {
  name: string;
  description: string;
  group: string;
  cooldown: number;
  chatnotification: boolean;
  cooldownnotification: boolean;
  nodes: EventGraphNode[];
  edges: EventGraphEdge[];
}

export interface EventGraphFile {
  graphs: { [eventId: string]: EventGraph };
  groups: string[];
  disabledGroups: string[];
}
