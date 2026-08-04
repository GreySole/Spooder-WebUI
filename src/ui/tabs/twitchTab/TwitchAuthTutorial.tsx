import React from 'react';
import { Box, LinkButton, Stack, TypeFace } from '@spooder/webui-component-library';
import useConfig from '../../../app/hooks/useConfig';
import useServer from '../../../app/hooks/useServer';

export default function TwitchAuthTutorial() {
  const { getPublicUrl } = useServer();
  const { data: publicUrls, isLoading: publicUrlLoading } = getPublicUrl();
  if (publicUrlLoading) {
    return null;
  }

  return (
    <Stack spacing='medium' width='100%' paddingBottom='medium'>
      <TypeFace fontSize='large'>
        - Go to{' '}
        <a href='https://dev.twitch.tv' target='_blank'>
          dev.twitch.tv
        </a>{' '}
      </TypeFace>
      <TypeFace fontSize='large'>- Log into your broadcaster account</TypeFace>
      <TypeFace fontSize='large'>- Set the redirect URLs</TypeFace>
      <Box>
        <LinkButton
          label={window.location.origin + '/twitch/authorize/bot'}
          link={window.location.origin + '/twitch/authorize/bot'}
          mode='copy'
        />
      </Box>
      <Box>
        <LinkButton
          label={window.location.origin + '/twitch/authorize/broadcaster'}
          link={window.location.origin + '/twitch/authorize/broadcaster'}
          mode='copy'
        />
      </Box>
      {!publicUrlLoading && publicUrls.http ? (
        <Box flexFlow='column'>
          <TypeFace>- This one is for viewers to login for public features</TypeFace>
          <Box padding='small'>
            <LinkButton label={publicUrls.http} link={publicUrls.http} mode='copy' />
          </Box>
        </Box>
      ) : null}
      <TypeFace fontSize='large'>- Click New Secret button</TypeFace>
      <TypeFace fontSize='large'>
        - Copy Client ID and Secret and paste to the fields above
      </TypeFace>
      <TypeFace fontSize='large'>- Save the config</TypeFace>
    </Stack>
  );
}
