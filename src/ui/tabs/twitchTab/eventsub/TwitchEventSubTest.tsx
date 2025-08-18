import React from 'react';
import {
  Box,
  Button,
  NumberInput,
  Stack,
  TextInput,
  TypeFace,
} from '@greysole/spooder-component-library';
import { useState } from 'react';
import useTwitch from '../../../../app/hooks/useTwitch';

export default function TwitchEventSubTest() {
  const [host, setHost] = useState<string>('');
  const [port, setPort] = useState<number>(0);

  const { getEnableTestEventsub, getDisableTestEventsub, getEventsubTestStatus } = useTwitch();

  const {
    data: testStatusData,
    isLoading: isTestStatusLoading,
    error: testStatusError,
    refetch: refetchTestStatus,
  } = getEventsubTestStatus();

  const { triggerEnableTestEventsub, isLoading, isSuccess, error } = getEnableTestEventsub(
    host,
    port,
  );
  const { triggerDisableTestEventsub } = getDisableTestEventsub();

  const [connectError, setConnectError] = useState<boolean>(false);

  if (isTestStatusLoading) {
    return null;
  }

  return !testStatusData.testMode ? (
    <Stack spacing='small' width='100%' padding='medium'>
      <TypeFace>
        To start testing eventsubs, you need the{' '}
        <a target='_blank' href='https://github.com/twitchdev/twitch-cli'>
          Twitch CLI
        </a>{' '}
        and follow the instructions on{' '}
        <a target='_blank' href='https://dev.twitch.tv/docs/cli/websocket-event-command/'>
          Twitch Websockets
        </a>
      </TypeFace>
      {connectError && (
        <TypeFace color='red'>
          There was an error connecting to the test server. Check your host and port.
        </TypeFace>
      )}
      <Box justifyContent='space-between'>
        <Stack spacing='small'>
          <TextInput label='Host' value={host} onChange={(value) => setHost(value)} />
          <NumberInput label='Port' value={port} onInput={(value) => setPort(value)} />
        </Stack>
        <Box>
          <Button
            label='Enable Test EventSub'
            onClick={() => {
              triggerEnableTestEventsub().then((response) => {
                console.log(response);
                if (response.data.status === 'error') {
                  setConnectError(true);
                } else {
                  setConnectError(false);
                }
                refetchTestStatus();
              });
            }}
          />
        </Box>
      </Box>
    </Stack>
  ) : (
    <Stack spacing='small' width='100%' padding='medium'>
      <Box justifyContent='space-between'>
        <Stack spacing='small'>
          <TypeFace fontWeight='bold'>Test EventSub is enabled</TypeFace>
          <TypeFace>Host: Test EventSub is enabled</TypeFace>
          <TypeFace>Test EventSub is enabled</TypeFace>
          <TypeFace>Host: {host}</TypeFace>
          <TypeFace>Port: {port}</TypeFace>
        </Stack>
        <Box>
          <Button
            label='Disable Test EventSub'
            onClick={() => {
              triggerDisableTestEventsub().then(() => {
                refetchTestStatus();
              });
            }}
          />
        </Box>
      </Box>
    </Stack>
  );
}
