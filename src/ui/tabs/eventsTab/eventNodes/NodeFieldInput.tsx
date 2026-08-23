import {
  FormBoolSwitch,
  FormColorInput,
  FormNumberInput,
  FormSelectDropdown,
  FormTextInput,
} from '@spooder/webui-component-library';
import React from 'react';
import FormAssetSelect from '../../../common/input/form/FormAssetSelect';
import FormAutoTextArea from '../../../common/input/form/FormAutoTextArea';
import FormCodeInput from '../../../common/input/form/FormCodeInput';
import { NodeFieldDef } from '../../../Types';
import { customFieldKey, getCustomFieldRenderer } from './fieldRenderers';

export interface NodeFieldInputProps {
  formKey: string;
  field: NodeFieldDef;
  // The owning module/plugin - used to resolve plugin assets and namespaced custom renderers.
  moduleName: string;
  label?: string;
  // Set when rendering inside a node card, where vertical space is fixed and the card draws
  // its own label row: currently trims the code editor down to a scrollable box.
  compact?: boolean;
}

// Maps one field definition to its control. The single place that decides which component a
// NodeFieldDef.type renders as, so the inspector pane and the node card can never drift.
export default function NodeFieldInput(props: NodeFieldInputProps) {
  const { formKey, field, moduleName, label, compact } = props;
  const fieldLabel = label ?? field.label;

  switch (field.type) {
    case 'boolean':
      return <FormBoolSwitch formKey={formKey} label={fieldLabel} />;
    case 'color':
      return <FormColorInput formKey={formKey} label={fieldLabel} />;
    case 'select': {
      const options = [{ label: 'None', value: '' }];
      for (const key in field.options?.selections ?? {}) {
        options.push({ label: field.options!.selections[key], value: key });
      }
      return <FormSelectDropdown formKey={formKey} label={fieldLabel} options={options} />;
    }
    case 'code':
      return <FormCodeInput formKey={formKey} label={fieldLabel} compact={compact} />;
    // Always reached from the inspector - fieldEditedInInspector keeps a paragraph of text off
    // the card, which has no row tall enough to write one in. Local rather than the library's
    // FormTextAreaInput so the caption sits above a pane-width, self-sizing box.
    case 'textarea':
      return <FormAutoTextArea formKey={formKey} label={fieldLabel} />;
    case 'asset':
      return (
        <FormAssetSelect
          formKey={formKey}
          label={fieldLabel}
          assetType={field.options?.assetType}
          assetFolderPath={field.options?.folder}
          pluginName={moduleName}
        />
      );
    case 'number':
      return <FormNumberInput formKey={formKey} label={fieldLabel} />;
    case 'custom': {
      const rendererKey = customFieldKey(moduleName, field);
      const renderer = getCustomFieldRenderer(rendererKey);
      if (!renderer) {
        return (
          <FormTextInput
            formKey={formKey}
            label={`${fieldLabel} (missing renderer '${rendererKey}')`}
          />
        );
      }
      const CustomRenderer = renderer.component;
      return <CustomRenderer formKey={formKey} label={fieldLabel} field={field} />;
    }
    case 'text':
    default:
      return <FormTextInput formKey={formKey} label={fieldLabel} />;
  }
}
