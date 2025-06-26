import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import CommandToggleGrid from './CommandToggleGrid';
import useShare from '../../../../app/hooks/useShare';
import React from 'react';
import { SaveButton, Button, Stack, TypeFace, Box } from '@greysole/spooder-component-library';

interface ShareEntrySettingsProps {
  shareKey: string;
}

export default function ShareEntryCommandSettings(props: ShareEntrySettingsProps) {
  const { shareKey } = props;
  const { getSaveShares } = useShare();
  const { saveShares } = getSaveShares();
  const { watch, getValues } = useFormContext();
  const share = watch(shareKey);
  const [openSettings, setOpenSettings] = useState(false);

  const saveAndCloseShare = () => {
    saveShares(getValues());
    setOpenSettings(false);
  };

  let shareContent = null;
  if (openSettings) {
    shareContent = (
      <Stack spacing='medium'>
        <CommandToggleGrid formKey={shareKey} />
        <SaveButton saveFunction={saveAndCloseShare} />
      </Stack>
    );
  } else {
    shareContent = (
      <Stack spacing='medium'>
        <Stack spacing='medium'>
          <TypeFace fontSize='large'>Commands</TypeFace>
          <Box>
            <Button label='Set' onClick={() => setOpenSettings(true)} />
          </Box>
        </Stack>
        {Object.keys(share.commands).join(', ')}
      </Stack>
    );
  }

  return shareContent;
}
