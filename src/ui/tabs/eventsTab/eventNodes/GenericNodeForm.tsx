import {
  FormBoolSwitch,
  FormColorInput,
  FormNumberInput,
  FormSelectDropdown,
  FormTextInput,
} from '@spooder/webui-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import FormAssetSelect from '../../../common/input/form/FormAssetSelect';
import FormCodeInput from '../../../common/input/form/FormCodeInput';
import { NodeForm } from '../../../Types';
import { buildNodeValueKey } from '../FormKeys';
import { modules } from '../../../../modules/registry';
import { CustomFieldRendererProps } from './customFieldRenderer';

const fieldRendererRegistry: { [key: string]: React.ComponentType<CustomFieldRendererProps> } = {};
for (const m of modules) {
  for (const [componentKey, Component] of Object.entries(m.fieldRenderers ?? {})) {
    fieldRendererRegistry[`${m.key}.${componentKey}`] = Component;
  }
}

interface GenericNodeFormProps {
  eventName: string;
  nodeIndex: number;
  moduleName: string;
  form: NodeForm;
}

function fieldSatisfiesShowif(showif: any, values: { [key: string]: any }) {
  if (!showif) {
    return true;
  }
  const currentValue = values?.[showif.variable];
  switch (showif.condition) {
    case 'equals':
      return currentValue === showif.value;
    default:
      return true;
  }
}

export default function GenericNodeForm(props: GenericNodeFormProps) {
  const { eventName, nodeIndex, moduleName, form } = props;
  const { watch } = useFormContext();
  const values = watch(buildNodeValueKey(eventName, nodeIndex)) ?? {};

  return (
    <>
      {Object.entries(form).map(([fieldName, field]) => {
        if (!fieldSatisfiesShowif(field.showif, values)) {
          return null;
        }
        const formKey = buildNodeValueKey(eventName, nodeIndex, fieldName);
        switch (field.type) {
          case 'boolean':
            return <FormBoolSwitch key={fieldName} formKey={formKey} label={field.label} />;
          case 'color':
            return <FormColorInput key={fieldName} formKey={formKey} label={field.label} />;
          case 'select': {
            const options = [{ label: 'None', value: '' }];
            for (const key in field.options?.selections ?? {}) {
              options.push({ label: field.options!.selections[key], value: key });
            }
            return (
              <FormSelectDropdown key={fieldName} formKey={formKey} label={field.label} options={options} />
            );
          }
          case 'code':
            return <FormCodeInput key={fieldName} formKey={formKey} label={field.label} />;
          case 'asset':
            return (
              <FormAssetSelect
                key={fieldName}
                formKey={formKey}
                label={field.label}
                assetType={field.options?.assetType}
                assetFolderPath={field.options?.folder}
                pluginName={moduleName}
              />
            );
          case 'number':
            return <FormNumberInput key={fieldName} formKey={formKey} label={field.label} />;
          case 'custom': {
            const rendererKey = `${moduleName}.${field.options?.component}`;
            const CustomRenderer = fieldRendererRegistry[rendererKey];
            if (!CustomRenderer) {
              return (
                <FormTextInput
                  key={fieldName}
                  formKey={formKey}
                  label={`${field.label} (missing renderer '${rendererKey}')`}
                />
              );
            }
            return <CustomRenderer key={fieldName} formKey={formKey} label={field.label} field={field} />;
          }
          case 'text':
          default:
            return <FormTextInput key={fieldName} formKey={formKey} label={field.label} />;
        }
      })}
    </>
  );
}
