import React, { useEffect, useState } from 'react';
import { faSync, faImage } from '@fortawesome/free-solid-svg-icons';
import { useRef } from 'react';
import {
  Box,
  TypeFace,
  Border,
  Stack,
  Columns,
  Button,
  BoolSwitch,
  useToast,
  ToastType,
} from '@greysole/spooder-component-library';
import usePlugins from '../../../app/hooks/usePlugins';
import { usePluginContext } from './context/PluginTabFormContext';

interface PluginInfoViewProps {
  pluginName: string;
}

export default function PluginInfoView(props: PluginInfoViewProps) {
  const { pluginName } = props;
  const { showToast } = useToast();
  const {
    getRefreshPlugin,
    getReinstallPlugin,
    getSetPluginEnabled,
    getSetPluginDevMode,
    getBuildPlugin,
  } = usePlugins();
  const { plugins, isReady, reloadPlugins } = usePluginContext();
  const { buildPlugin } = getBuildPlugin();
  const { refreshPlugin } = getRefreshPlugin();
  const { reinstallPlugin } = getReinstallPlugin();
  const { setPluginEnabled } = getSetPluginEnabled();
  const { setPluginDevMode } = getSetPluginDevMode();
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    setIsEnabled(plugins[pluginName].status !== 'disabled');
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  const plugin = plugins?.[pluginName];

  async function refreshSinglePluginClick(pluginName: string) {
    refreshPlugin(pluginName);
    showToast(`${pluginName} refreshed!`, ToastType.INFO);
  }

  const hiddenIconInput = useRef<HTMLInputElement>(null);
  function handleIconUploadClick() {
    if (hiddenIconInput.current) {
      hiddenIconInput.current.click();
    }
  }

  let dependenciesElements = null;
  let dependenciesElement = null;
  if (Object.keys(plugin.dependencies).length > 0) {
    dependenciesElements = Object.entries(plugin.dependencies).map(([key, value]) => (
      <Box key={key}>
        {key}: {value as string}
      </Box>
    ));
    dependenciesElement = (
      <Stack spacing='medium'>
        <TypeFace fontSize='large'>Dependencies</TypeFace>
        {dependenciesElements}
        <Box>
          <Button label='Reinstall Dependencies' onClick={() => reinstallPlugin(pluginName)} />
        </Box>
      </Stack>
    );
  } else {
    dependenciesElement = (
      <Box flexFlow='column'>
        <TypeFace fontSize='large'>Dependencies</TypeFace>
        <TypeFace fontSize='medium'>None</TypeFace>
      </Box>
    );
  }

  return (
    <Border borderWidth='2px' borderColor='gray'>
      <Stack spacing='medium' padding='medium'>
        <Stack spacing='small'>
          <TypeFace fontSize='large'>Plugin Mode</TypeFace>
          <TypeFace fontSize='medium'>{plugin.pluginMode}</TypeFace>
          <BoolSwitch
            label='Dev Mode'
            value={plugin.devMode}
            onChange={() => {
              setPluginDevMode(pluginName, !plugin.devMode).then(() => {
                reloadPlugins();
              });
            }}
          />
          {plugin.devMode ? (
            <Box>
              <Button
                label='Build Plugin'
                onClick={() =>
                  buildPlugin(pluginName).then(() => {
                    reloadPlugins();
                  })
                }
              />
            </Box>
          ) : null}
        </Stack>
        <Stack spacing='small'>
          <TypeFace fontSize='large'>Description</TypeFace>
          <TypeFace fontSize='medium'>{plugin.description}</TypeFace>
        </Stack>
        {dependenciesElement}
        <BoolSwitch
          label='Enabled'
          value={isEnabled}
          onChange={() => {
            setPluginEnabled(pluginName, !isEnabled).then(() => {
              setIsEnabled(!isEnabled);
            });
          }}
        />
        <Columns spacing='medium'>
          <Button
            label='Reload Plugin'
            icon={faSync}
            iconSize='lg'
            onClick={() => refreshSinglePluginClick(pluginName)}
          />
          <Button
            label='Replace Icon'
            icon={faImage}
            iconSize='lg'
            onClick={handleIconUploadClick}
          />
        </Columns>
      </Stack>
    </Border>
  );
}
