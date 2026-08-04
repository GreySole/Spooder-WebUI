import { Stack, TypeFace } from '@spooder/webui-component-library';
import React from 'react';

export default function DiscordAuthTutorial() {
  return (
    <Stack width='100%' spacing='medium'>
      <TypeFace fontSize='large'>You own this bot :3</TypeFace>
      <TypeFace fontSize='large'>
        - Go to{' '}
        <a href='https://discord.com/developers/applications' target='_blank'>
          https://discord.com/developers/applications
        </a>{' '}
      </TypeFace>
      <TypeFace fontSize='large'>- Create a new Application</TypeFace>
      <TypeFace fontSize='large'>- Click Bot section</TypeFace>
      <TypeFace fontSize='large'>- Enable Message Content Intent.</TypeFace>
      <TypeFace fontSize='large'>- Click OAuth2 section</TypeFace>
      <TypeFace fontSize='large'>
        - Under OAuth2 URL Generator, enable bot. Permissions needed depend on what plugins you’ll
        use for your bot. If you’re unsure, click Administrator
      </TypeFace>
      <TypeFace fontSize='large'>
        - Copy the generated URL as Guild Install and navigate to it in your browser. This should
        allow you to add your bot into your server.
      </TypeFace>
      <TypeFace fontSize='large'>
        - In OAuth2, copy the Client ID and paste into the field above
      </TypeFace>
      <TypeFace fontSize='large'>
        - Click the Bot section on the left and click Reset Token
      </TypeFace>
      <TypeFace fontSize='large'>- Copy the token and paste it into the Token field above</TypeFace>
      <TypeFace fontSize='large'>
        - Enable developer mode on Discord Settings → Advanced → Developer Mode
      </TypeFace>
      <TypeFace fontSize='large'>
        - Right click your profile pic on any chat and click Copy User ID
      </TypeFace>
      <TypeFace fontSize='large'>- Paste that ID into the Master field in Spooder Discord</TypeFace>

      <TypeFace fontSize='large'>- Save the config</TypeFace>
    </Stack>
  );
}
