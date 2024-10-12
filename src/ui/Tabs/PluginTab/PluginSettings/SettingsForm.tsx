import React from 'react';
import PluginSubform from './PluginSubform';
import PluginInput from './PluginInput';
import { useForm, FormProvider } from 'react-hook-form';
import { KeyedObject, PluginComponentProps } from '../../../Types';
import { usePluginContext } from '../context/PluginTabFormContext';
import PluginSettingsSaveButton from './PluginSettingsSaveButton';

export default function SettingsForm(props: PluginComponentProps) {
  const { pluginName } = props;
  const { plugins } = usePluginContext();
  const plugin = plugins[pluginName];

  const values = plugin['settings'];
  const form = plugin['settings-form'].form;
  const defaults = plugin['settings-form'].defaults;

  for (let d in defaults) {
    if (values[d] == null) {
      if (typeof defaults[d] == 'object' && !Array.isArray(defaults[d])) {
        values[d] = {};
      } else if (typeof defaults[d] == 'object' && Array.isArray(defaults[d])) {
        values[d] = [];
      } else {
        values[d] = defaults[d];
      }
    }
    if (Array.isArray(defaults[d]) && !Array.isArray(values[d])) {
      values[d] = [values[d]];
    } else if (!Array.isArray(defaults[d]) && Array.isArray(values[d])) {
      values[d] = values[d][0];
    }
  }

  const SettingsFormContext = useForm({
    defaultValues: values,
  });

  function translateCondition(condition: string) {
    let newCondition = condition;
    switch (condition.toLowerCase()) {
      case 'equals':
        newCondition = '==';
        break;
      case 'not equal':
        newCondition = '!=';
        break;
      case 'less than':
        newCondition = '<';
        break;
      case 'greater than':
        newCondition = '>';
        break;
      case 'less than or equal to':
        newCondition = '<=';
        break;
      case 'greater than or equal to':
        newCondition = '>=';
        break;
    }
    return newCondition;
  }

  let inputTable = [];
  for (let e in form) {
    if (form[e].type == 'subform') {
      inputTable.push(
        <PluginSubform
          formkey={e}
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
      <div className='settings-form-element'>
        {inputTable}
        <PluginSettingsSaveButton />
      </div>
    </FormProvider>
  );
}
