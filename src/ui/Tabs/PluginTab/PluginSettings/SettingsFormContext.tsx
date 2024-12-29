import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { KeyedObject } from '../../../Types';
import PluginInput from './PluginInput';
import PluginSettingsSaveButton from './PluginSettingsSaveButton';
import PluginSubform from './PluginSubform';
import { translateCondition } from '../../../util/ScriptUtil';
import Stack from '../../../common/layout/Stack';
import Expandable from '../../../common/layout/Expandable';
import Border from '../../../common/layout/Border';
import useTheme from '../../../../app/hooks/useTheme';

interface SettingsFormContextProps {
  pluginName: string;
  values: KeyedObject;
  form: KeyedObject;
  defaults: KeyedObject;
}

export default function SettingsFormContext(props: SettingsFormContextProps) {
  const { pluginName, values, form, defaults } = props;
  const { themeConstants } = useTheme();

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
      <Border borderWidth='2px' borderColor={themeConstants.settings}>
        <Stack spacing='medium' padding='medium'>
          {inputTable}
          <PluginSettingsSaveButton />
        </Stack>
      </Border>
    </FormProvider>
  );
}
