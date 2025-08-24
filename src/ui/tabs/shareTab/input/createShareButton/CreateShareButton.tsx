import { Button, Stack, TextInput, TypeFace, useDialog } from '@greysole/spooder-component-library';
import React, { useState } from 'react';
import useShare from '../../../../../app/hooks/useShare';
import CreateShareButtonDialogContent from './CreateShareButtonDialogContent';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';

export default function CreateShareButton() {
  const { openDialog, closeDialog } = useDialog();
  const { getVerifyShareTarget, getCreateShare, getShares } = useShare();
  const { refetch } = getShares();
  const { createShare } = getCreateShare();
  const { verifyShareTarget } = getVerifyShareTarget();
  return (
    <Button
      label='Add Share'
      icon={faCirclePlus}
      onClick={() => {
        let latestValue = '';

        const handleValueChange = (value: string) => {
          latestValue = value;
        };
        openDialog(
          'Create Share',
          <CreateShareButtonDialogContent onValueChange={handleValueChange} />,
          [
            <Button label='Cancel' onClick={() => closeDialog()} />,
            <Button
              label='Create'
              onClick={() => {
                console.log('VERIFY USER', latestValue);
                verifyShareTarget(latestValue).then((response) => {
                  console.log('User verified', response);
                  if (response.data.status === 'ok') {
                    createShare({ twitch: response.data.info });
                    refetch();
                  }
                  closeDialog();
                });
              }}
            />,
          ],
        );
      }}
    />
  );
}
