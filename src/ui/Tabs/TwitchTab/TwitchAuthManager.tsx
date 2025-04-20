import React from 'react';
import useTwitch from '../../../app/hooks/useTwitch';
import {
  FormLoader,
  LinkButton,
  Button,
  Stack,
  TypeFace,
  ImageFile,
  Icon,
  Box,
  Border,
} from '@greysole/spooder-component-library';
import useConfig from '../../../app/hooks/useConfig';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import BotAuthButton from './authManager/BotAuthButton';
import BroadcasterAuthButton from './authManager/BotAuthButton copy';

export default function TwitchAuthManager() {
  const { getRevokeToken, getLinkedAccounts, getTwitchConfig } = useTwitch();
  const { data: twitchConfig, isLoading: twitchConfigLoading } = getTwitchConfig();
  const { data: linkedAccounts, isLoading: accountsLoading } = getLinkedAccounts();
  const { revokeToken } = getRevokeToken();

  if (accountsLoading || twitchConfigLoading) {
    return <FormLoader numRows={4} />;
  }

  return (
    <>
      <TypeFace fontSize='xlarge'>Linked Accounts</TypeFace>
      <Border borderBottom>
        {twitchConfig['client-id'] && twitchConfig['client-secret'] ? (
          <Box width='100%' justifyContent='space-evenly' padding='small'>
            <Stack spacing='small' align='center' margin='medium'>
              <TypeFace>Chat Bot</TypeFace>
              <Box>
                <Icon
                  iconSize='150px'
                  icon={
                    linkedAccounts.botUser != null ? linkedAccounts.botUser.profile_image_url : null
                  }
                  fallbackIcon={faUser}
                />
              </Box>
              <TypeFace>
                {linkedAccounts.botUser != null ? linkedAccounts.botUser.display_name : ''}
              </TypeFace>
              <BotAuthButton />
              <Button label='Revoke' onClick={() => revokeToken()} />
            </Stack>
            <Stack spacing='small' align='center' margin='medium'>
              <TypeFace>Broadcaster</TypeFace>
              <Box>
                <Icon
                  iconSize='150px'
                  icon={
                    linkedAccounts?.broadcasterUser != null
                      ? linkedAccounts.broadcasterUser.profile_image_url
                      : null
                  }
                  fallbackIcon={faUser}
                />
              </Box>
              <TypeFace>
                {linkedAccounts.broadcasterUser != null
                  ? linkedAccounts.broadcasterUser.display_name
                  : ''}
              </TypeFace>
              <BroadcasterAuthButton />
              <Button label='Revoke' onClick={() => revokeToken()} />
            </Stack>
          </Box>
        ) : (
          <Stack spacing='small' padding='small'>
            <TypeFace fontSize='xlarge'>You own this bot :3</TypeFace>
            <TypeFace fontSize='large'>
              You'll need developer credentials from{' '}
              <a href='https://dev.twitch.tv' target='_blank'>
                dev.twitch.tv
              </a>{' '}
              to use Spooder's Twitch module. Sign up and create an app. Paste and save the cliend
              ID and secret.
            </TypeFace>
          </Stack>
        )}
      </Border>
    </>
  );
}
