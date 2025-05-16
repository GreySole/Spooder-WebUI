import React from 'react';
import { KeyedObject } from '../../../../Types';
import PluginInput from '../../../pluginTab/pluginSettings/pluginInput/PluginInput';
import PluginSubform from '../../../pluginTab/pluginSettings/PluginSubform';
import { useFormContext } from 'react-hook-form';
import {
  Box,
  FormSelectDropdown,
  Stack,
  translateCondition,
} from '@greysole/spooder-component-library';
import PluginMultiInput from '../../../pluginTab/pluginSettings/pluginInput/PluginMultiInput';
import PluginSettingsContextProvider from '../../../pluginTab/pluginSettings/context/PluginSettingsContext';
import PluginInputsList from '../../../pluginTab/pluginSettings/pluginInput/PluginInputsList';

interface CustomEventPluginCommandProps {
  formKey: string;
  pluginName: string;
  eventForm: KeyedObject;
}

export default function CustomEventPluginCommand(props: CustomEventPluginCommandProps) {
  const { formKey, pluginName, eventForm } = props;
  const { watch } = useFormContext();
  const eventName = watch(`${formKey}.event.name`, '');
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
