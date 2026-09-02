import {
  Border,
  Box,
  Button,
  Columns,
  Stack,
  TextInput,
  TypeFace,
  useToast,
} from '@spooder/webui-component-library';
import React, { useState } from 'react';
import { useInstallPluginFromRepoMutation } from '../../../app/api/pluginSlice';

// The escape hatch. A registry is a convenience, not a gate - anyone can point Spooder at a
// repository directly, and someone testing their own plugin needs to before it is listed
// anywhere. Worth being plain that nothing has reviewed what this installs.
export default function InstallFromUrl({ onInstalled }: { onInstalled: () => void }) {
  const [url, setUrl] = useState('');
  const [installFromRepo, { isLoading }] = useInstallPluginFromRepoMutation();
  const { showSuccess, showError } = useToast();

  const install = async () => {
    if (url.trim().length === 0) {
      return;
    }
    const result: any = await installFromRepo({ url: url.trim(), mode: 'release' });
    if (result?.error) {
      showError(result.error.data?.message ?? 'Could not install from that repository.');
      return;
    }
    showSuccess(`Installed ${result.data?.pluginName ?? 'plugin'}.`);
    setUrl('');
    onInstalled();
  };

  return (
    <Border>
      <Box padding="small" width="100%">
        <Stack spacing="small" width="100%">
          <TypeFace fontSize="large">Install from a repository</TypeFace>
          <TypeFace fontSize="medium">
            For a plugin no registry lists — your own, or one someone sent you. Nothing has
            reviewed it, and it runs on this machine with the same access every plugin has.
          </TypeFace>
          <Columns spacing="small">
            <TextInput
              value={url}
              onChange={(value: string) => setUrl(value)}
              placeholder="https://github.com/owner/plugin"
            />
            <Button
              label={isLoading ? 'Installing…' : 'Install'}
              onClick={install}
              disabled={isLoading}
            />
          </Columns>
        </Stack>
      </Box>
    </Border>
  );
}
