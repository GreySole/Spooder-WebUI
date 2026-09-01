// The ModuleDefinition contract now lives in the module SDK, so a module repo can compile
// against it without the host. Re-exported here for the host's own imports.
export type {
  ModuleApi,
  ModuleDefinition,
  ModuleNodeInspectorProps,
  ModuleNodeTestPanelProps,
  ModulePluginInput,
  ModuleTabConfig,
  PluginControlledInputProps,
  PluginFormInputProps,
} from '@spooder/webui-module-sdk';
