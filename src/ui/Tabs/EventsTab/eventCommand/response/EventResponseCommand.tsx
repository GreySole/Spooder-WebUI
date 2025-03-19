import React from 'react';
import { useFormContext } from 'react-hook-form';
import { buildCommandKey, buildKey, buildTriggerKey } from '../../FormKeys';
import useEvents from '../../../../../app/hooks/useEvents';
import { useState } from 'react';
import { EventCommandProps } from '../../../../Types';
import { HotkeysProvider } from '../../../../../app/hooks/useHotkeys';
import {
  TextInput,
  Button,
  FormNumberInput,
  Border,
  Box,
  Stack,
  TypeFace,
} from '@greysole/spooder-component-library';
import FormCodeInput from '../../../../common/input/form/FormCodeInput';
import ResponseScriptTest from './ResponseScriptTest';

export default function EventResponseCommand(props: EventCommandProps) {
  const { eventName, commandIndex } = props;

  const formKey = buildCommandKey(eventName, commandIndex);

  const messageFormKey = buildKey(formKey, 'message');
  const delayFormKey = buildKey(formKey, 'delay');

  return (
    <Stack spacing='medium' padding='medium'>
      <Box flexFlow='column'>
        <FormCodeInput label='Script' formKey={messageFormKey} />
      </Box>
      <ResponseScriptTest eventName={eventName} commandIndex={commandIndex} />
      <FormNumberInput label='Delay (Milliseconds):' formKey={delayFormKey} />
    </Stack>
  );
}
