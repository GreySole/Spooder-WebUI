import React, { useEffect } from 'react';
import { KeyedObject } from '../../../../Types';
import { useFormContext } from 'react-hook-form';
import { Box, FormSelectDropdown, Stack } from '@greysole/spooder-component-library';
import PluginSettingsContextProvider from '../../../pluginTab/pluginSettings/context/PluginSettingsContext';
import PluginInputsList from '../../../pluginTab/pluginSettings/pluginInput/PluginInputsList';

interface CustomEventPluginCommandProps {
  formKey: string;
  pluginName: string;
  eventForm: KeyedObject;
}

export default function CustomEventPluginCommand(props: CustomEventPluginCommandProps) {
  const { formKey, pluginName, eventForm } = props;
  const { watch, setValue, getValues, unregister } = useFormContext();
  const eventName = watch(`${formKey}.event.name`, '');

  useEffect(() => {
    console.log('EFFECT', eventName);
    if (!eventName) {
      return;
    }

    const currentValues = getValues(`${formKey}.event.values`);
    for (let c in currentValues) {
      unregister(`${formKey}.event.values.${c}`);
    }

    const form = eventForm[eventName].form;
    const defaults = eventForm[eventName].defaults;
    console.log('DEFAULTS', form, defaults);
    for (let f in form) {
      if (form[f].type === 'code') {
        if (form[f].options?.use_response_processor) {
          setValue(`${formKey}.event.values._${f}`, {
            use_response_processor: form[f].options?.use_response_processor === true,
          });
        }
      }
    }
    for (let d in defaults) {
      console.log('DEFAULTS', d, defaults[d]);
      setValue(`${formKey}.event.values.${d}`, defaults[d]);
    }
  }, [eventForm, eventName]);

  const eventOptions = [{ label: 'None', value: '' }];
  for (let e in eventForm) {
    eventOptions.push({ label: eventForm[e].label, value: e });
  }

  if (eventName == '') {
    return (
      <FormSelectDropdown formKey={`${formKey}.event.name`} label='Event:' options={eventOptions} />
    );
  }

  const form = eventForm[eventName].form;
  const defaults = eventForm[eventName].defaults;

  return (
    <PluginSettingsContextProvider pluginName={pluginName} form={form} defaults={defaults}>
      <FormSelectDropdown formKey={`${formKey}.event.name`} label='Event:' options={eventOptions} />
      <Box flexFlow='column' padding='medium'>
        <Stack spacing='medium'>
          <PluginInputsList baseFormKey={`${formKey}.event.values`} />
        </Stack>
      </Box>
    </PluginSettingsContextProvider>
  );
}
