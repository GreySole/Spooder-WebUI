import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import useShare from '../../../../app/hooks/useShare';
import usePlugins from '../../../../app/hooks/usePlugins';
import PluginToggleGrid from './PluginToggleGrid';
import React from 'react';
import {
  FormLoader,
  SaveButton,
  Button,
  Stack,
  TypeFace,
  Box,
} from '@greysole/spooder-component-library';

interface ShareEntrySettingsProps {
  shareKey: string;
}

export default function ShareEntryPluginSettings(props: ShareEntrySettingsProps) {
  const { shareKey } = props;
  const { getPlugins } = usePlugins();
  const { data: plugins, isLoading, error } = getPlugins();
  const { getSaveShares } = useShare();
  const { saveShares } = getSaveShares();
  const { watch, getValues } = useFormContext();
  const share = watch(shareKey);
  const [openSettings, setOpenSettings] = useState(false);

  if (isLoading || !plugins) {
    return <FormLoader numRows={4} />;
  }

  const saveAndCloseShare = () => {
    saveShares(getValues());
    setOpenSettings(false);
  };

  let shareContent = null;
  if (openSettings) {
    shareContent = (
      <Stack spacing='medium'>
        <PluginToggleGrid formKey={shareKey} />
        <SaveButton saveFunction={saveAndCloseShare} />
      </Stack>
    );
  } else {
    shareContent = (
      <Stack spacing='medium'>
        <Stack spacing='medium'>
          <TypeFace fontSize='large'>Plugins</TypeFace>
          <Box>
            <Button label='Set' onClick={() => setOpenSettings(true)} />
          </Box>
        </Stack>
        {Object.keys(share.plugins)
          .map((plugin: string) => (plugins[plugin] ? plugins[plugin].name : plugin))
          .join(', ')}
      </Stack>
    );
  }

  return shareContent;
}
