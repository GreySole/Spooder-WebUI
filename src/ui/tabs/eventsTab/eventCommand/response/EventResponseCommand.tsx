import React from 'react';
import { useFormContext } from 'react-hook-form';
import { buildCommandKey, buildKey } from '../../FormKeys';
import { EventCommandProps } from '../../../../Types';
import {
  FormNumberInput,
  Box,
  Stack,
  FormSelectDropdown,
  FormTextInput,
  TypeFace,
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
  const intervalKeyFormKey = buildKey(formKey, 'interval_key');
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
          { value: 'clear_recurring', label: 'Clear Recurring Message' },
        ]}
      />
      {eType !== 'clear_recurring' ? (
        <>
          {eType === 'recurring' ? (
            <FormTextInput
              label='Interval Key (used to stop recurring)'
              formKey={intervalKeyFormKey}
            />
          ) : null}
          <Box flexFlow='column'>
            {eType === 'recurring' ? (
              <TypeFace fontWeight='bold'>
                Note: You can get the count of recurrences with 'extra.count'.
              </TypeFace>
            ) : null}
            <FormCodeInput label='Script' formKey={messageFormKey} />
          </Box>
          <ResponseScriptTest eventName={eventName} commandIndex={commandIndex} />
          <FormNumberInput label='Delay (Milliseconds):' formKey={delayFormKey} />
          {eType === 'recurring' ? (
            <FormNumberInput label='Interval (Minutes):' formKey={intervalFormKey} />
          ) : null}
        </>
      ) : (
        <FormTextInput label='Interval Key' formKey={intervalKeyFormKey} />
      )}
    </Stack>
  );
}
