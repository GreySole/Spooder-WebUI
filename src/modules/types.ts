import React from 'react';
import { CustomFieldRenderer } from '../ui/tabs/eventsTab/eventNodes/customFieldRenderer';
import { TriggerTestDef } from '../ui/Types';

export interface ModuleTabConfig {
  label: string;
  icon: any;
  // Where the tab lands in the navigation menu. Modules default to the deck section
  // below the divider, alongside OSC Monitor and Mod UI; 'main' opts into the top list
  // with Dashboard/Events/etc. 'module' is legacy (the Modules folder is gone) and is
  // treated as the default.
  parentTab?: 'deck' | 'main' | 'module';
}

export interface PluginFormInputProps {
  formKey: string;
  label?: string;
}

export interface PluginControlledInputProps {
  label: string;
  value: any;
  onChange: (value: any) => void;
}

// A plugin-settings field type a module contributes, keyed by the `type` string a plugin's
// settings manifest asks for ('obs', 'discord'). `form` is used inside a react-hook-form
// context; `controlled` is the value/onChange variant multi-inputs need.
export interface ModulePluginInput {
  form: React.ComponentType<PluginFormInputProps>;
  controlled?: React.ComponentType<PluginControlledInputProps>;
}

export interface ModuleApi {
  reducerPath: string;
  reducer: any;
  middleware: any;
}

export interface ModuleDefinition {
  key: string;
  tabConfig: ModuleTabConfig;
  Component: React.ComponentType;
  // One RTK Query api, or several when the module's backend spans multiple route prefixes.
  api: ModuleApi | ModuleApi[];
  // Field types this module contributes to plugin settings forms, keyed by manifest `type`.
  // Looked up through the registry so a plugin asking for a type whose module isn't installed
  // degrades to a message instead of breaking the build (see pluginInput/modulePluginInputs.ts).
  pluginInputs?: { [type: string]: ModulePluginInput };
  // Named field-renderer components this module contributes to the node graph, for
  // NodeFieldDef.type === 'custom' fields whose options.component matches a key here.
  // Each declares its rendered height so the card can size the field's row.
  fieldRenderers?: { [componentKey: string]: CustomFieldRenderer };
  // Inspector panels this module contributes, keyed by the node type they belong to. The
  // panel is for what a static form def can't express - live remote state a node points at,
  // and the actions that change it. Core's own panels stay hardwired in NodeInspector; this
  // is the same idea opened up to modules, so a Twitch/OBS node type doesn't need an edit
  // there. Selecting a node with an entry here opens the panel (see useInspectorHasContent).
  nodeInspectors?: { [nodeTypeId: string]: React.ComponentType<ModuleNodeInspectorProps> };
  // One panel for every trigger node of this module whose def carries `test`. Which nodes are
  // testable is declared by the backend alongside the node itself, so a module that adds a
  // trigger gets its test UI without touching the WebUI - the panel reads the def's params
  // and posts back to the module's own route.
  nodeTestPanel?: React.ComponentType<ModuleNodeTestPanelProps>;
}

// Same props the core inspector editors take: the node's slot in the event form, so a panel
// can watch and write the node's own values.
export interface ModuleNodeInspectorProps {
  eventName: string;
  nodeIndex: number;
}

export interface ModuleNodeTestPanelProps extends ModuleNodeInspectorProps {
  // The node being tested, and what its test accepts. `nodeTypeId` is what the panel sends
  // back - the module's route maps it to a real event, so the client never names one.
  nodeTypeId: string;
  test: TriggerTestDef;
}
