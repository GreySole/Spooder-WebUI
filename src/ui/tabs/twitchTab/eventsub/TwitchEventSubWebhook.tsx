import {
  BoolSwitch,
  Button,
  Stack,
  TypeFace,
  useDialog,
} from '@greysole/spooder-component-library';
import React from 'react';
import useTwitch from '../../../../app/hooks/useTwitch';
import useServer from '../../../../app/hooks/useServer';

export default function TwitchEventSubWebhook() {
  const { getUseWebhookTransport, getSetUseWebhookTransport } = useTwitch();
  const { getPublicUrl } = useServer();
  const { data: publicUrl, isLoading: publicUrlLoading } = getPublicUrl();
  const { data: useWebhookTransport, isLoading, error, refetch } = getUseWebhookTransport();
  const { setUseWebhookTransport } = getSetUseWebhookTransport();
  const { openDialog, closeDialog } = useDialog();

  const webhookSwitched = (value: boolean) => {
    setUseWebhookTransport(!useWebhookTransport).then(() => {
      refetch();
    });
  };

  if (isLoading || publicUrlLoading) {
    return null;
  }

  if (!publicUrl) {
    return (
      <TypeFace color='error'>
        Webhook Transport is available here, but you need public hosting set up.
      </TypeFace>
    );
  }
  return (
    <Stack spacing='small' width='100%' padding='medium'>
      <BoolSwitch
        label='Use Webhook Transport'
        onChange={() => {
          if (!useWebhookTransport) {
            openDialog(
              'Enable Webhook Transport',
              <TypeFace>
                Webhook Transport will use your public hosting method to create EventSubs. This is
                recommended for Spooders that run 24/7 and those that want to enable auto share to
                many users. Do you want to use Webhook Transport?
              </TypeFace>,
              [
                <Button label='Cancel' onClick={() => closeDialog()} />,
                <Button
                  label='Confirm'
                  onClick={() => {
                    webhookSwitched(true);
                    closeDialog();
                  }}
                />,
              ],
            );
          } else {
            webhookSwitched(false);
          }
        }}
        value={useWebhookTransport}
      />
    </Stack>
  );
}
