import React from 'react';

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
}
