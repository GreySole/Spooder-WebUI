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
import BroadcasterAuthButton from './authManager/BroadcasterAuthButton';
import TwitchAuthTutorial from './TwitchAuthTutorial';

export default function TwitchAuthManager() {
  const { getRevokeToken, getLinkedAccounts, getTwitchConfig } = useTwitch();
  const { data: twitchConfig, isLoading: twitchConfigLoading } = getTwitchConfig();
  const { data: linkedAccounts, isLoading: accountsLoading } = getLinkedAccounts();
  const { revokeToken } = getRevokeToken();
  const isLocalhost = window.location.hostname === 'localhost';

  if (accountsLoading || twitchConfigLoading) {
    return <FormLoader numRows={4} />;
  }

  return (
    <Box flexFlow='column' width='100%'>
      <TypeFace fontSize='xlarge'>Linked Accounts</TypeFace>
      {linkedAccounts.error !== 'nologin' ? (
        <TypeFace>
          If you want a separate account for chat bot, then log out of Twitch and back in as the bot
          account. Then click Authorize for the Chat Bot section.
        </TypeFace>
      ) : null}
      <Border borderBottom>
        {twitchConfig['client-id'] && twitchConfig['client-secret'] ? (
          <Box width='100%' justifyContent='space-evenly' padding='small'>
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
              <Button label='Revoke' onClick={() => revokeToken()} className='delete-button' />
            </Stack>
            {linkedAccounts.error !== 'nologin' ? (
              <Stack spacing='small' align='center' margin='medium'>
                <TypeFace>Chat Bot</TypeFace>
                <Box flexFlow='column' alignItems='center'>
                  <Icon
                    iconSize='150px'
                    icon={
                      linkedAccounts.botUser != null
                        ? linkedAccounts.botUser.profile_image_url
                        : null
                    }
                    fallbackIcon={faUser}
                  />
                </Box>
                <TypeFace>
                  {linkedAccounts.botUser != null ? linkedAccounts.botUser.display_name : ''}
                </TypeFace>
                <BotAuthButton />
                <Button label='Revoke' onClick={() => revokeToken()} className='delete-button' />
              </Stack>
            ) : null}
          </Box>
        ) : isLocalhost ? (
          <Stack spacing='small' padding='small'>
            <TypeFace fontSize='xlarge'>You own this bot :3</TypeFace>
            <TwitchAuthTutorial />
          </Stack>
        ) : (
          <Stack spacing='medium' width='100%' paddingBottom='medium'>
            <TypeFace fontSize='large'>You're not on localhost! D:</TypeFace>
            <TypeFace>
              Authorization will only work on the localhost, the same machine Spooder is running.
              Don't worry, you'll only need to do this once.
            </TypeFace>
          </Stack>
        )}
      </Border>
    </Box>
  );
}
