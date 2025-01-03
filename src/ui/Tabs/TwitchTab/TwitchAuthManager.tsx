import React from 'react';
import useTwitch from '../../../app/hooks/useTwitch';
import { FormLoader, LinkButton, Button } from '@greysole/spooder-component-library';
import useConfig from '../../../app/hooks/useConfig';

export default function TwitchAuthManager() {
  const { getConfig } = useConfig();
  const { getTwitchConfig, getRevokeToken, getAvailableScopes, getLinkedAccounts } = useTwitch();
  const { data: config, isLoading: configLoading } = getConfig();
  const { data: twitchConfig, isLoading: twitchConfigLoading } = getTwitchConfig();
  const { data: linkedAccounts, isLoading: accountsLoading } = getLinkedAccounts();
  const { data: scopes, isLoading: scopesLoading } = getAvailableScopes();
  const { revokeToken } = getRevokeToken();

  if (twitchConfigLoading || scopesLoading || configLoading || accountsLoading) {
    return <FormLoader numRows={4} />;
  }

  const chatAuthButton = (
    <LinkButton
      label={twitchConfig['token'] != null ? 'Replace' : 'Authorize'}
      link={
        'https://id.twitch.tv/oauth2/authorize?client_id=' +
        twitchConfig['client-id'] +
        '&redirect_uri=http://localhost:' +
        config.host_port +
        '/twitch/authorize&response_type=code&scope=' +
        scopes.join(' ')
      }
      mode='newtab'
    />
  );

  return linkedAccounts.botUser != null ? (
    <div key='twitchmanage' className='twitchmanage-form'>
      <div className='twitch-bot'>
        <label>CHAT BOT</label>
        <div className='twitch-pfp'>
          <img
            height='150px'
            src={linkedAccounts.botUser != null ? linkedAccounts.botUser.profile_image_url : null}
          />
        </div>
        <div className='twitch-username'>
          {linkedAccounts.botUser != null ? linkedAccounts.botUser.display_name : ''}
        </div>

        {chatAuthButton}
      </div>
      <div className='twitch-broadcaster'>
        <label>BROADCASTER</label>
        <div className='twitch-pfp'>
          <img
            height='150px'
            src={
              linkedAccounts?.broadcasterUser != null
                ? linkedAccounts.broadcasterUser.profile_image_url
                : null
            }
          />
        </div>
        <div className='twitch-username'>
          {linkedAccounts.broadcasterUser != null
            ? linkedAccounts.broadcasterUser.display_name
            : ''}
        </div>

        <Button label='Copy from Chat Bot' onClick={() => {}} />
      </div>
      {<Button label='Revoke' onClick={() => revokeToken()} />}
    </div>
  ) : (
    <div>
      <h1>You own this bot :3</h1>
      <span>
        You'll need developer credentials from
        <a href='https://dev.twitch.tv' target='_blank'>
          dev.twitch.tv
        </a>
        to use Spooder's Twitch module. Sign up and create an app. Paste and save the cliend ID and
        secret.
      </span>
      {chatAuthButton}
    </div>
  );
}
