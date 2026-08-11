import React from 'react';
import { CustomFieldRendererProps } from '../ui/tabs/eventsTab/eventNodes/customFieldRenderer';

export interface ModuleTabConfig {
  label: string;
  icon: any;
  parentTab?: string;
}

export interface ModuleDefinition {
  key: string;
  tabConfig: ModuleTabConfig;
  Component: React.ComponentType;
  api: {
    reducerPath: string;
    reducer: any;
    middleware: any;
  };
  // Named field-renderer components this module contributes to the node-graph editor's
  // GenericNodeForm, for NodeFieldDef.type === 'custom' fields whose options.component
  // matches a key here.
  fieldRenderers?: { [componentKey: string]: React.ComponentType<CustomFieldRendererProps> };
}
