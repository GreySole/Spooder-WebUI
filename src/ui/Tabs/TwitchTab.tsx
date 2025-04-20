import React from 'react';
import useTwitch from '../../app/hooks/useTwitch';
import TwitchTabFormContextProvider from './twitchTab/context/TwitchFormContext';
import TwitchCredentials from './twitchTab/TwitchCredentials';
import TwitchAuthManager from './twitchTab/TwitchAuthManager';
import { CircleLoader, Button, TypeFace, Stack } from '@greysole/spooder-component-library';
import TwitchEventSubList from './twitchTab/TwitchEventSubList';

export default function TwitchTab() {
  const { getTwitchConfig } = useTwitch();

  const { data: twitchConfig, isLoading: isLoadingTwitchConfig } = getTwitchConfig();

  if (isLoadingTwitchConfig) {
    return <CircleLoader />;
  }

  return (
    <Stack spacing='medium'>
      <TwitchTabFormContextProvider
        twitchConfig={{
          'client-id': twitchConfig['client-id'],
          'client-secret': twitchConfig['client-secret'],
        }}
      >
        <TwitchCredentials />
      </TwitchTabFormContextProvider>
      <TwitchAuthManager />
      <TwitchEventSubList />
    </Stack>
  );
}
