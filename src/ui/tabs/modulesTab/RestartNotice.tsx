import { Border, Box, Button, Columns, Stack, TypeFace } from '@spooder/webui-component-library';
import React, { useState } from 'react';
import { RestartVia, useRestartSpooderMutation } from '../../../app/api/registrySlice';

// A module only becomes real on the next start - its code is compiled into dist, and this
// process is still running what was there before. What matters here is being straight about
// what happens next, which depends entirely on how Spooder was launched.
export default function RestartNotice({
  what,
  via,
  onDismiss,
}: {
  what: string;
  via: RestartVia;
  onDismiss: () => void;
}) {
  const [restart] = useRestartSpooderMutation();
  const [restarting, setRestarting] = useState(false);

  const go = async () => {
    setRestarting(true);
    await restart({ reason: `finish installing ${what}` });
  };

  if (restarting) {
    return (
      <Border>
        <Box padding="small" width="100%">
          <TypeFace fontSize="large">
            Restarting Spooder. This page will reconnect on its own in a few seconds.
          </TypeFace>
        </Box>
      </Border>
    );
  }

  return (
    <Border>
      <Box padding="small" width="100%">
        <Stack spacing="small" width="100%">
          <TypeFace fontSize="large">{what} is ready.</TypeFace>
          {via === 'manual' ? (
            <>
              <TypeFace fontSize="medium">
                Spooder was started from a terminal, so it can't restart itself. Stop it and
                start it again to load {what}.
              </TypeFace>
              <Button label="Got it" onClick={onDismiss} />
            </>
          ) : (
            <>
              <TypeFace fontSize="medium">
                {via === 'app'
                  ? 'The Spooder app will restart it for you.'
                  : 'Spooder will close, and your process manager will start it again.'}
              </TypeFace>
              <Columns spacing="small">
                <Button label="Restart now" onClick={go} />
                <Button label="Later" onClick={onDismiss} />
              </Columns>
            </>
          )}
        </Stack>
      </Box>
    </Border>
  );
}
