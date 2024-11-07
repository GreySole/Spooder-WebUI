import React from 'react';
import Box from '../../../../common/layout/Box';
import { KeyedObject } from '../../../../Types';
import PluginInput from '../../../pluginTab/PluginSettings/PluginInput';
import PluginSubform from '../../../pluginTab/PluginSettings/PluginSubform';
import { useFormContext } from 'react-hook-form';
import { translateCondition } from '../../../../util/ScriptUtil';
import FormSelectDropdown from '../../../../common/input/form/FormSelectDropdown';

interface CustomEventPluginCommandProps {
  formKey: string;
  pluginName: string;
  eventForm: KeyedObject;
}

export default function CustomEventPluginCommand(props: CustomEventPluginCommandProps) {
  const { formKey, pluginName, eventForm } = props;
  const { watch } = useFormContext();
  const eventName = watch(`${formKey}.event.name`, '');
  const values = watch(`${formKey}.event.values`, {});
  const eventOptions = [{ label: 'None', value: '' }];
  for (let e in eventForm) {
    eventOptions.push({ label: eventForm[e].label, value: e });
  }

  console.log(eventForm, eventName);

  if (eventName == '') {
    return (
      <FormSelectDropdown formKey={`${formKey}.event.name`} label='Event:' options={eventOptions} />
    );
  }

  const form = eventForm[eventName].form;
  const defaults = eventForm[eventName].defaults;

  let inputTable = [];
  for (let e in form) {
    if (form[e].type == 'subform') {
      inputTable.push(
        <PluginSubform
          formKey={`${formKey}.event.values.${e}`}
          pluginName={pluginName}
          label={form[e].label}
          form={form[e].form}
          defaults={defaults[e]}
        />,
      );
    } else {
      if (form[e].showif) {
        console.log('SHOW IF', form[e].showif, values[form[e].showif.variable]);
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
        } else {
          continue;
        }
      }

      console.log(e, form[e]);

      inputTable.push(
        <PluginInput
          key={e}
          formKey={`${formKey}.event.values.${e}`}
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
    <>
      <FormSelectDropdown formKey={`${formKey}.event.name`} label='Event:' options={eventOptions} />
      {inputTable}
    </>
  );
}
