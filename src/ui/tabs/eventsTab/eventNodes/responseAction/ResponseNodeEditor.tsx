import React from 'react';
import { useFormContext } from 'react-hook-form';
import { buildKey, buildNodeValueKey } from '../../FormKeys';
import {
  FormNumberInput,
  Box,
  Stack,
  FormSelectDropdown,
  FormTextInput,
  TypeFace,
} from '@spooder/webui-component-library';
import FormCodeInput from '../../../../common/input/form/FormCodeInput';
import ResponseScriptTest from './ResponseScriptTest';

interface ResponseNodeEditorProps {
  eventName: string;
  nodeIndex: number;
}

export default function ResponseNodeEditor(props: ResponseNodeEditorProps) {
  const { eventName, nodeIndex } = props;
  const { watch } = useFormContext();

  const nodeValueKey = buildNodeValueKey(eventName, nodeIndex);

  const eTypeFormKey = buildKey(nodeValueKey, 'etype');
  const messageFormKey = buildKey(nodeValueKey, 'message');
  const intervalKeyFormKey = buildKey(nodeValueKey, 'interval_key');
  const intervalFormKey = buildKey(nodeValueKey, 'interval');

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
          <ResponseScriptTest eventName={eventName} nodeIndex={nodeIndex} />
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
