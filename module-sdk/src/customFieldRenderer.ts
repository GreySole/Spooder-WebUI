import type React from 'react';
import { NodeFieldDef } from './types';

export interface CustomFieldRendererProps {
  formKey: string;
  label?: string;
  field: NodeFieldDef;
}

export interface CustomFieldRenderer {
  component: React.ComponentType<CustomFieldRendererProps>;
  // Rendered height in px, declared at registration. The node card computes every socket
  // offset analytically from these heights (see canvas/nodeLayout.ts), so a custom renderer
  // has to state how much room it needs rather than sizing itself.
  height: number;
}

// Registry key for a custom field: the owning module plus the component it names. Kept here,
// in a module with no runtime imports, so the pure layout math can build the same key.
export function customFieldKey(moduleName: string, field: { options?: { component?: string } }) {
  return `${moduleName}.${field.options?.component}`;
}
