import {
  KeyedObject,
  NodeFieldDef,
  SelectOption,
  TriggerTestDef,
  NodePortDataType,
  TriggerTestParam,
} from '@spooder/webui-module-sdk';

// Defined in the module SDK, since modules describe their fields with them too. Re-exported
// here so the ~100 host files importing from ui/Types keep their familiar path.
export type {
  KeyedObject,
  NodeFieldDef,
  NodePortDataType,
  SelectOption,
  TriggerTestDef,
  TriggerTestParam,
};

export interface FilterProps {
  label: string;
  icon: any;
  value: string;
}

export enum OSCConditionType {
  equal = '==',
  notEqual = '!=',
  greaterThanOrEqual = '>=',
  lessThanOrEqual = '<=',
  greaterThan = '>',
  lessThan = '<',
  searchAndMatch = 'search_and_match',
}

export interface PluginsObject {
  [key: string]: any;
}


export interface PluginComponentProps {
  pluginName: string;
  setRef?: (pluginName: string, ref: any) => void;
}


export interface ThemeColors {
  baseColor: string;
  backgroundColorFar: string;
  backgroundColorNear: string;
  buttonFontColor: string;
  buttonBackgroundColor: string;
  buttonBorderColor: string;
  colorAnalogousCW: string;
  colorAnalogousCCW: string;
  darkColorAnalogousCW: string;
  darkColorAnalogousCCW: string;
  buttonFontColorAnalogousCW: string;
  buttonFontColorAnalogousCCW: string;
  inputTextColor: string;
  inputBackgroundColor: string;
}

export interface ThemeVariables {
  hue: number;
  saturation: number;
  isDarkTheme: boolean;
}

export enum StyleSize {
  none = '0rem',
  xsmall = '0.25rem',
  small = '0.5rem',
  medium = '1rem',
  large = '1.5rem',
  xlarge = '2rem',
}

export type StyleSizeType = 'none' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

export interface NewPlugin {
  [key: string]: {
    name: string;
    author: string;
    description: string;
    status: string;
    message: string;
  };
}

export interface PluginPages {
  overlay: boolean;
  utility: boolean;
  public: boolean;
}

export interface SharedElement {
  [key: string]: boolean;
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
  category: 'math' | 'string' | 'logic' | 'random' | 'storage' | 'array' | 'timer';
  // See TriggerNodeDef.nodeWidth.
  nodeWidth?: number;
  form: NodeForm;
  defaults: KeyedObject;
  outputs: NodePortDef[];
}

export interface NodeManifest {
  moduleName: string;
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
