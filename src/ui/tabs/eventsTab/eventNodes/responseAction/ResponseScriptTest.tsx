import {
  Box,
  Stack,
  Border,
  TypeFace,
  TextInput,
  Button,
  Columns,
} from '@spooder/webui-component-library';
import React, { useState } from 'react';
import useEvents from '../../../../../app/hooks/useEvents';
import { buildGraphKey, buildNodeValueKey } from '../../FormKeys';
import { useFormContext } from 'react-hook-form';
import { findChatCommandNode } from '../graphUtil';

interface ResponseScriptTestProps {
  eventName: string;
  nodeIndex: number;
}

export default function ResponseScriptTest(props: ResponseScriptTestProps) {
  const { eventName, nodeIndex } = props;
  const { watch } = useFormContext();
  const { getVerifyResponseScript } = useEvents();
  const { verifyResponseScript } = getVerifyResponseScript();
  const [verifyScriptResponse, setVerifyScriptResponse] = useState(
    'Write your code in the above editor and click Verify Script. The result of the script will print here. Use the Input Message field to simulate a chat message and trigger the command.',
  );
  const [verifyScriptStatus, setVerifyScriptStatus] = useState('');
  const [inputMessage, setInputMessage] = useState<string>('');

  const graph = watch(buildGraphKey(eventName));
  const chatCommandNode = findChatCommandNode(graph);
  const command = chatCommandNode?.values?.command;

  const messageKey = buildNodeValueKey(eventName, nodeIndex, 'message');
  const message = watch(messageKey, '');

  if (command === undefined) {
    return <TypeFace>A Chat trigger node is needed to verify scripts</TypeFace>;
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
        <Columns spacing='small'>
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
              verifyResponseScript(command, inputMessage, message).then((res: any) => {
                setVerifyScriptResponse(
                  typeof res.data.response == 'string'
                    ? res.data.response
                    : JSON.stringify(res.data.response, null, 2),
                );
                setVerifyScriptStatus(res.data.status);
              });
            }}
          />
        </Columns>
      </Stack>
    </Box>
  );
}
