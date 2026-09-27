import React, { useEffect, useState } from 'react';
import { KeyedObject } from '../types';
import { useFormContext } from 'react-hook-form';
import { Box, FormSelectDropdown, Stack } from '@spooder/webui-component-library';
import { PluginEventInputsField } from '../components/HostFields';

interface CustomEventPluginNodeCommandProps {
  formKey: string;
  pluginName: string;
  eventForm: KeyedObject;
}

export default function CustomEventPluginNodeCommand(props: CustomEventPluginNodeCommandProps) {
  const { formKey, pluginName, eventForm } = props;
  const { watch, setValue, getValues } = useFormContext();
  const eventName = watch(`${formKey}.event.name`, '');
  const [currentEventName, setCurrentEventName] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!eventName) {
      return;
    }

    const currentValues = getValues(`${formKey}.event.values`);

    if (!currentEventName) {
      setCurrentEventName(eventName);
    } else if (eventName !== currentEventName) {
      for (let c in currentValues) {
        setValue(`${formKey}.event.values.${c}`, undefined);
      }
      setCurrentEventName(eventName);
    }

    const form = eventForm[eventName].form;
    const defaults = eventForm[eventName].defaults;
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
      if (!currentValues?.[d]) {
        setValue(`${formKey}.event.values.${d}`, defaults[d]);
      }
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
    <>
      <FormSelectDropdown formKey={`${formKey}.event.name`} label='Event:' options={eventOptions} />
      <Box flexFlow='column' padding='medium'>
        <Stack spacing='medium'>
          <PluginEventInputsField
            pluginName={pluginName}
            form={form}
            defaults={defaults}
            baseFormKey={`${formKey}.event.values`}
          />
        </Stack>
      </Box>
    </>
  );
}
