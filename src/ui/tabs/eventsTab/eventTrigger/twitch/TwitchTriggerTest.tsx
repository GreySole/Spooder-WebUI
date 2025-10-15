import { Box, TypeFace, TextInput, Button, FormLoader } from '@greysole/spooder-component-library';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import useTwitch from '../../../../../app/hooks/useTwitch';
import { buildKey, buildTriggerKey } from '../../FormKeys';

interface TwitchTriggerTestProps {
  twitchTriggerType: string;
}

export default function TwitchTriggerTest(props: TwitchTriggerTestProps) {
  const { twitchTriggerType } = props;
  const [testArgs, setTestArgs] = useState<string>('');
  const { getTestEventsub, getCliInstalled, getInstallCli } = useTwitch();
  const { data: cliInstalled, isLoading: isCliLoading, refetch } = getCliInstalled();
  const { installCli } = getInstallCli();
  const { testEventsub } = getTestEventsub();

  const installCliClick = () => {
    installCli().then(() => {
      refetch();
    });
  };

  if (isCliLoading) {
    return <FormLoader numRows={1} />;
  }

  if (!cliInstalled.installed) {
    return (
      <Box flexFlow='column' marginTop='small'>
        <TypeFace>To test Twitch Eventsubs, the Twitch CLI must be installed.</TypeFace>
        <Box>
          <Button label='Install Twitch CLI' onClick={installCliClick} />
        </Box>
      </Box>
    );
  }

  return (
    <Box flexFlow='column' marginTop='small'>
      {twitchTriggerType === 'redeem' ? (
        <TypeFace>Better to test this with your actual redeem.</TypeFace>
      ) : (
        <TypeFace>
          You can add extra arguments to the test by using the input below. You can find available
          args{' '}
          <a
            target='_blank'
            href='https://dev.twitch.tv/docs/cli/event-command#flags-to-use-when-triggering-events'
          >
            here
          </a>
          .
        </TypeFace>
      )}
      {twitchTriggerType !== 'redeem' ? (
        <Box spacing='small' marginTop='small'>
          <TextInput
            value={testArgs}
            onChange={(value) => setTestArgs(value)}
            placeholder='Test Args'
          />
          <Button
            label='Test Trigger'
            onClick={() => {
              testEventsub(twitchTriggerType, testArgs);
            }}
          />
        </Box>
      ) : null}
    </Box>
  );
}
