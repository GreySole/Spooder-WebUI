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

// The node graph's own types live with the editor package.
export {
  OSCConditionType,
} from '@spooder/webui-node-graph';
export type {
  ActionNodeDef,
  EventGraph,
  EventGraphEdge,
  EventGraphFile,
  EventGraphNode,
  EventGraphNodeKind,
  NodeForm,
  NodeManifest,
  NodePortDef,
  OperationNodeDef,
  TriggerNodeDef,
} from '@spooder/webui-node-graph';
