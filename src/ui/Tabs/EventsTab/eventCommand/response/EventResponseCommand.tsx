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
  Columns,
  Expandable,
  FormBoolSwitch,
  FormTextInput,
  Stack,
  TypeFace,
} from '@greysole/spooder-component-library';
import ResponseCommandCheatSheet from './ResponseCommandCheatSheet';
import FormCodeInput from '../../../../common/input/form/FormCodeInput';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import ResponseSearchAndMatchCheatSheet from './ResponseSearchAndMatchCheatSheet';

export default function EventResponseCommand(props: EventCommandProps) {
  const { eventName, commandIndex } = props;
  const { watch, getValues } = useFormContext();
  const { getVerifyResponseScript } = useEvents();
  const { verifyResponseScript } = getVerifyResponseScript();
  const [verifyScriptResponse, setVerifyScriptResponse] = useState(
    'Write your code in the above editor and click Verify Script. The result of the script will print here. Use the Input Message field to simulate a chat message and trigger the command.',
  );
  const [verifyScriptStatus, setVerifyScriptStatus] = useState('');
  const formKey = buildCommandKey(eventName, commandIndex);

  const messageFormKey = buildKey(formKey, 'message');
  const message = watch(messageFormKey, '');
  const delayFormKey = buildKey(formKey, 'delay');

  const [inputMessage, setInputMessage] = useState<string>('');
  const verifyBorderColor =
    verifyScriptStatus !== '' ? (verifyScriptStatus === 'error' ? 'red' : 'green') : undefined;

  return (
    <HotkeysProvider enter={() => verifyResponseScript(eventName, message, inputMessage)}>
      <Stack spacing='medium' padding='medium'>
        <Box flexFlow='column'>
          <FormCodeInput label='Script' formKey={messageFormKey} />
          <Box flexFlow='column' marginTop='medium'>
            <Stack spacing='medium'>
              <Border borderColor={verifyBorderColor}>
                <Box flexFlow='row' padding='medium'>
                  <TypeFace>{verifyScriptResponse}</TypeFace>
                </Box>
              </Border>
              <TextInput
                placeholder='Input Message'
                value={inputMessage}
                onInput={(value) => {
                  setInputMessage(value);
                }}
              />
              <Button
                label='Verify Script'
                onClick={() => {
                  const values = getValues();
                  verifyResponseScript(values.command, inputMessage, values.script).then((res) => {
                    setVerifyScriptResponse(res.data.response);
                    setVerifyScriptStatus(res.data.status);
                  });
                }}
              />
            </Stack>
          </Box>
        </Box>
      </Stack>

      <FormNumberInput label='Delay (Milliseconds):' formKey={delayFormKey} />
    </HotkeysProvider>
  );
}
