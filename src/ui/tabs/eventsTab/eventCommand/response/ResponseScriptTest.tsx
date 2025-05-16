import {
  Box,
  Stack,
  Border,
  TypeFace,
  TextInput,
  Button,
} from '@greysole/spooder-component-library';
import React, { useState } from 'react';
import useEvents from '../../../../../app/hooks/useEvents';
import { buildCommandKey, buildKey, buildTriggerKey } from '../../FormKeys';
import { useFormContext } from 'react-hook-form';

interface ResponseScriptTestProps {
  eventName: string;
  commandIndex: number;
}

export default function ResponseScriptTest(props: ResponseScriptTestProps) {
  const { eventName, commandIndex } = props;
  const { watch } = useFormContext();
  const { getVerifyResponseScript } = useEvents();
  const { verifyResponseScript } = getVerifyResponseScript();
  const [verifyScriptResponse, setVerifyScriptResponse] = useState(
    'Write your code in the above editor and click Verify Script. The result of the script will print here. Use the Input Message field to simulate a chat message and trigger the command.',
  );
  const [verifyScriptStatus, setVerifyScriptStatus] = useState('');
  const [inputMessage, setInputMessage] = useState<string>('');
  const commandKey = buildKey(buildTriggerKey(eventName, 'chat'), 'command');
  const command = watch(commandKey, undefined);
  const messageKey = buildKey(buildCommandKey(eventName, commandIndex), 'message');
  const message = watch(messageKey, '');

  if (command === undefined) {
    return <TypeFace>Chat trigger needed to verify scripts</TypeFace>;
  }

  const verifyBorderColor =
    verifyScriptStatus !== '' ? (verifyScriptStatus === 'error' ? 'red' : 'green') : undefined;

  return (
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
            verifyResponseScript(command, inputMessage, message).then((res) => {
              setVerifyScriptResponse(
                typeof res.data.response == 'string'
                  ? res.data.response
                  : JSON.stringify(res.data.response, null, 2),
              );
              setVerifyScriptStatus(res.data.status);
            });
          }}
        />
      </Stack>
    </Box>
  );
}
