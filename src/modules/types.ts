import React from 'react';
import { CustomFieldRenderer } from '../ui/tabs/eventsTab/eventNodes/customFieldRenderer';

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
  // Named field-renderer components this module contributes to the node graph, for
  // NodeFieldDef.type === 'custom' fields whose options.component matches a key here.
  // Each declares its rendered height so the card can size the field's row.
  fieldRenderers?: { [componentKey: string]: CustomFieldRenderer };
}
