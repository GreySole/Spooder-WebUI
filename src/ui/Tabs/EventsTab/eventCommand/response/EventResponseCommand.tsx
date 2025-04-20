import React from 'react';
import { useFormContext } from 'react-hook-form';
import { buildCommandKey, buildKey } from '../../FormKeys';
import { EventCommandProps } from '../../../../Types';
import {
  FormNumberInput,
  Box,
  Stack,
  FormSelectDropdown,
} from '@greysole/spooder-component-library';
import FormCodeInput from '../../../../common/input/form/FormCodeInput';
import ResponseScriptTest from './ResponseScriptTest';

export default function EventResponseCommand(props: EventCommandProps) {
  const { eventName, commandIndex } = props;
  const { watch } = useFormContext();

  const formKey = buildCommandKey(eventName, commandIndex);

  const eTypeFormKey = buildKey(formKey, 'etype');
  const messageFormKey = buildKey(formKey, 'message');
  const delayFormKey = buildKey(formKey, 'delay');
  const intervalFormKey = buildKey(formKey, 'interval');

  const eType = watch(eTypeFormKey, 'oneshot');

  return (
    <Stack spacing='medium'>
      <FormSelectDropdown
        formKey={eTypeFormKey}
        label='Type'
        options={[
          { value: 'oneshot', label: 'One Shot' },
          { value: 'recurring', label: 'Recurring' },
        ]}
      />
      <Box flexFlow='column'>
        <FormCodeInput label='Script' formKey={messageFormKey} />
      </Box>
      <ResponseScriptTest eventName={eventName} commandIndex={commandIndex} />
      <FormNumberInput label='Delay (Milliseconds):' formKey={delayFormKey} />
      {eType === 'recurring' ? (
        <FormNumberInput label='Interval (Seconds):' formKey={intervalFormKey} />
      ) : null}
    </Stack>
  );
}
