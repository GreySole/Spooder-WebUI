import React from 'react';
import { Expandable, Stack } from '@spooder/webui-component-library';
import { usePluginSettingsContext } from './context/PluginSettingsContext';
import PluginInputProcessor from './pluginInput/PluginInputProcessor';

interface PluginSectionProps {
  formKey: string;
}

export default function PluginSection({ formKey }: PluginSectionProps) {
  const { form } = usePluginSettingsContext();
  const section = form[formKey];

  console.log('SECTION', formKey, section, form);

  if (!section || !section.fields) {
    return null;
  }

  const { label, fields } = section;

  // Generate inputs for each field in the section
  const sectionInputs = [];
  for (const fieldKey in fields) {
    const field = fields[fieldKey];
    sectionInputs.push(
      <PluginInputProcessor
        key={`section-input-${formKey}.${fieldKey}`}
        formKey={`${formKey}.${fieldKey}`}
        type={field.type}
        label={field.label}
        options={field.options}
        description={field.description}
        showif={field.showif}
        multi-select={field['multi-select']}
      />,
    );
  }

  return (
    <Stack width='100%' spacing='medium' padding='small'>
      {sectionInputs}
    </Stack>
  );
}
