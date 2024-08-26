import React from 'react';
import PluginSubform from './PluginSubform';
import PluginInput from './PluginInput.js';
import { useForm, FormProvider } from 'react-hook-form';
import { PluginComponentProps } from '../Types';
import { usePluginContext } from '../UI/PluginTab/context/PluginTabFormContext';
import PluginSettingsSaveButton from './PluginSettingsSaveButton';

export default function SettingsForm(props: PluginComponentProps) {
  const { pluginName } = props;
  const { plugins } = usePluginContext();
  const plugin = plugins[pluginName];

  let values = plugin.sform.values;
  const defaults = plugin.sform.defaults;
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
  for (let e in values) {
    if (values[e].type == 'subform') {
      inputTable.push(<PluginSubform keyname={e} />);
    } else {
      if (values[e].showif) {
        if (values[values[e].showif.variable] != null) {
          if (
            !eval(
              '' +
                values[values[e].showif.variable] +
                translateCondition(values[e].showif.condition) +
                values[e].showif.value,
            )
          ) {
            continue;
          }
        }
      }

      inputTable.push(<PluginInput formKey={e} label={values[e].label} type={values[e].type} isMulti={values[e].multi} options={values[e].options} defaultValue={defaults[e]} />);
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
