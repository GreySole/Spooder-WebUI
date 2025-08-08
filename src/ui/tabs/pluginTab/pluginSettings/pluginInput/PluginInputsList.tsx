import { Expandable, KeyedObject } from '@greysole/spooder-component-library';
import React from 'react';
import PluginInput from './PluginInput';
import PluginMultiInput from './PluginMultiInput';
import { usePluginSettingsContext } from '../context/PluginSettingsContext';
import PluginSubform from '../PluginSubform';
import PluginInputProcessor from './PluginInputProcessor';
import PluginSection from '../PluginSection';

interface PluginInputsListProps {
  baseFormKey?: string;
}

export default function PluginInputsList({ baseFormKey }: PluginInputsListProps) {
  const { form } = usePluginSettingsContext();

  return Object.keys(form).map((key) => {
    if (form[key].type === 'section') {
      console.log(form[key]);
      return (
        <Expandable key={`section-${key}`} label={form[key].label}>
          <PluginSection
            key={`section-${key}`}
            formKey={baseFormKey ? `${baseFormKey}.${key}` : key}
          />
        </Expandable>
      );
    }
    return form[key].type == 'subform' ? (
      <PluginSubform key={`overform-${key}`} formKey={key} />
    ) : (
      <PluginInputProcessor
        key={key}
        formKey={baseFormKey ? `${baseFormKey}.${key}` : key}
        type={form[key].type}
        label={form[key].label}
        options={form[key].options}
        description={form[key].description}
        showif={form[key].showif}
        multi-select={form[key]['multi-select']}
      />
    );
  });
}
