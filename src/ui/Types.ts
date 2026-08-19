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

export interface KeyedObject {
  [key: string]: any;
}

export interface PluginComponentProps {
  pluginName: string;
  setRef?: (pluginName: string, ref: any) => void;
}

export interface SelectOption {
  label: string;
  value: string | number;
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

export type NodePortDataType = 'string' | 'number' | 'boolean' | 'any';

export interface NodePortDef {
  id: string;
  label: string;
  dataType: NodePortDataType;
}

export interface NodeFieldDef {
  label: string;
  description?: string;
  // 'custom' renders a module-provided component: options.component must name a
  // renderer registered by the owning module via ModuleDefinition.fieldRenderers.
  // 'port' is a wire-only input: it draws a labelled socket and nothing else, for values that
  // can only sensibly come from another node (an array, an object) and have no typeable form.
  type: 'asset' | 'boolean' | 'color' | 'code' | 'select' | 'text' | 'number' | 'custom' | 'port';
  options?: KeyedObject;
  showif?: { variable: string; condition: string; value: any };
  // When set, this field is also a connectable input port of the given data type: the
  // frontend renders it as an inline editable value when unwired, or as a socket fed by
  // another node's output when a data edge targets it.
  portType?: NodePortDataType;
  // One slot of a self-extending list (e.g. Concat's C..H inputs): hidden until every field
  // before it is filled or wired, so the node offers exactly one empty slot at a time. See
  // growableFieldVisible in nodeFieldVisibility.ts.
  growable?: boolean;
}

export interface NodeForm {
  [fieldName: string]: NodeFieldDef;
}

export interface TriggerNodeDef {
  id: string;
  label: string;
  description?: string;
  form: NodeForm;
  defaults: KeyedObject;
  outputs: NodePortDef[];
}

export interface ActionNodeDef {
  id: string;
  label: string;
  description?: string;
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
  category: 'math' | 'string' | 'logic' | 'random' | 'storage' | 'array';
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
