import { Box, Button, Stack, TypeFace, useDialog } from '@greysole/spooder-component-library';
import React from 'react';
import AutoShareSwitch from '../input/AutoShareSwitch';
import ShareDiscordForm from '../input/ShareDiscordForm';
import useShare from '../../../../app/hooks/useShare';
import { useFormContext } from 'react-hook-form';

interface ShareIntegrationTabProps {
  shareKey: string;
}

export default function ShareIntegrationTab(props: ShareIntegrationTabProps) {
  const { shareKey } = props;
  const { setValue } = useFormContext();
  const { openDialog, closeDialog } = useDialog();
  const { getCreateShareKey, getDeleteShareKey } = useShare();
  const { createShareKey, isLoading } = getCreateShareKey();
  const { deleteShareKey, isLoading: deleteLoading } = getDeleteShareKey();

  return (
    <Stack spacing='medium' padding='small'>
      <TypeFace fontSize='large'>Twitch</TypeFace>
      <Stack spacing='small' padding='small'>
        <AutoShareSwitch shareKey={shareKey} />
      </Stack>
      <Stack spacing='medium'>
        <TypeFace fontSize='large'>Share Key</TypeFace>
        <Box>
          <Button
            label='Regenerate Key'
            onClick={() => {
              createShareKey(shareKey).then((data) => {
                if (data.status === 'ok') {
                  setValue(`${shareKey}.shareKey`, data.shareKey);
                  openDialog('Share Key Created', <TypeFace>Share Key Regenerated!</TypeFace>, [
                    <Button label='Ok' onClick={() => closeDialog()} />,
                  ]);
                } else {
                  openDialog(
                    'Error',
                    <TypeFace>Something went wrong while creating the Share Key.</TypeFace>,
                    [<Button label='Ok' onClick={() => closeDialog()} />],
                  );
                }
              });
            }}
          />
        </Box>
        <Box>
          <Button
            label='Delete Key'
            onClick={() => {
              deleteShareKey(shareKey).then(() => {
                openDialog('Share Key Deleted', <TypeFace>Share Key Deleted.</TypeFace>, []);
              });
            }}
          />
        </Box>
      </Stack>
    </Stack>
  );
}
