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
  const { setValue, reset } = useFormContext();
  const { openDialog, closeDialog } = useDialog();
  const { getCreateShareKey, getDeleteShareKey, getShares } = useShare();
  const { refetch } = getShares();
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
              openDialog(
                'Regenerate Share Key',
                <TypeFace>You will have to resend your share URL. Regenerate share key?</TypeFace>,
                [
                  <Button label='Cancel' onClick={() => closeDialog()} />,
                  <Button
                    label='Regenerate'
                    onClick={() => {
                      createShareKey(shareKey).then((response) => {
                        const data = response.data;
                        if (data.status === 'ok') {
                          setValue('shareKey', data.shareKey);
                          refetch();
                          closeDialog();
                        } else {
                          openDialog(
                            'Error',
                            <TypeFace>Something went wrong while creating the Share Key.</TypeFace>,
                            [<Button label='Ok' onClick={() => closeDialog()} />],
                          );
                        }
                      });
                    }}
                  />,
                ],
              );
            }}
          />
        </Box>
        <Box>
          <Button
            label='Delete Key'
            onClick={() => {
              openDialog(
                'Delete Share Key',
                <TypeFace>Are you sure you want to delete this share key?</TypeFace>,
                [
                  <Button label='Cancel' onClick={() => closeDialog()} />,
                  <Button
                    label='Delete'
                    onClick={() => {
                      deleteShareKey(shareKey).then(() => {
                        setValue('shareKey', '');
                        refetch();
                        closeDialog();
                      });
                    }}
                  />,
                ],
              );
            }}
          />
        </Box>
      </Stack>
    </Stack>
  );
}
