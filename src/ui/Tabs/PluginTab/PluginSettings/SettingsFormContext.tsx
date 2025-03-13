import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { KeyedObject } from '../../../Types';
import {
  translateCondition,
  Border,
  Stack,
  useTheme,
  Box,
  Modal,
} from '@greysole/spooder-component-library';
import PluginInput from './PluginInput';
import PluginSettingsSaveButton from './PluginSettingsSaveButton';
import PluginSubform from './PluginSubform';
import { usePluginContext } from '../context/PluginTabFormContext';

interface SettingsFormContextProps {
  pluginName: string;
  values: KeyedObject;
  form: KeyedObject;
  defaults: KeyedObject;
}

export default function SettingsFormContext(props: SettingsFormContextProps) {
  const { pluginName, values, form, defaults } = props;
  const { setPluginSettingsOpen } = usePluginContext();

  console.log('Settings Values', values);

  const SettingsFormContext = useForm({
    defaultValues: values,
  });

  let inputTable = [];
  for (let e in form) {
    if (form[e].type == 'subform') {
      inputTable.push(
        <PluginSubform
          formKey={e}
          pluginName={pluginName}
          label={form[e].label}
          form={form[e].form}
          defaults={defaults[e]}
        />,
      );
    } else {
      if (form[e].showif) {
        if (values[form[e].showif.variable] != null) {
          if (
            !eval(
              '' +
                values[form[e].showif.variable] +
                translateCondition(form[e].showif.condition) +
                form[e].showif.value,
            )
          ) {
            continue;
          }
        }
      }

      inputTable.push(
        <PluginInput
          formKey={e}
          pluginName={pluginName}
          defaultValue={defaults[e]}
          label={form[e].label}
          type={form[e].type}
          options={form[e].options}
        />,
      );
    }
  }

  return (
    <FormProvider {...SettingsFormContext}>
      <Modal
        isOpen={true}
        onClose={() => {
          setPluginSettingsOpen('');
        }}
        title={pluginName}
        content={
          <Box flexFlow='column' padding='medium'>
            <Stack spacing='medium'>{inputTable}</Stack>
          </Box>
        }
        footerContent={<PluginSettingsSaveButton />}
      />
    </FormProvider>
  );
}
