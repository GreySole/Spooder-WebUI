import { LinkButton } from '@greysole/spooder-component-library';
import React from 'react';
import { config } from 'react-transition-group';
import useTwitch from '../../../../app/hooks/useTwitch';
import useConfig from '../../../../app/hooks/useConfig';

export default function BotAuthButton() {
  const { getConfig } = useConfig();
  const { getTwitchConfig, getAvailableScopes } = useTwitch();
  const { data: config, isLoading: configLoading } = getConfig();
  const { data: twitchConfig, isLoading: twitchConfigLoading } = getTwitchConfig();
  const { data: scopes, isLoading: scopesLoading } = getAvailableScopes();

  if (twitchConfigLoading || scopesLoading || configLoading) {
    return null;
  }

  return (
    <LinkButton
      label={twitchConfig['token'] != null ? 'Replace' : 'Authorize'}
      link={
        'https://id.twitch.tv/oauth2/authorize?client_id=' +
        twitchConfig['client-id'] +
        '&redirect_uri=http://localhost:' +
        config.host_port +
        '/twitch/authorize/bot&response_type=code&scope=' +
        scopes.join('%20')
      }
      mode='newtab'
    />
  );
}
