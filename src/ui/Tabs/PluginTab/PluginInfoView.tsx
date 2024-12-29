import React from 'react';
import { faSync, faImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef } from 'react';
import useToast from '../../../app/hooks/useToast';
import { ToastType } from '../../Types';
import usePlugins from '../../../app/hooks/usePlugins';
import { usePluginContext } from './context/PluginTabFormContext';
import Border from '../../common/layout/Border';
import useTheme from '../../../app/hooks/useTheme';
import Button from '../../common/input/controlled/Button';
import Columns from '../../common/layout/Columns';
import Stack from '../../common/layout/Stack';
import Box from '../../common/layout/Box';
import TypeFace from '../../common/layout/TypeFace';

interface PluginInfoViewProps {
  pluginName: string;
}

export default function PluginInfoView(props: PluginInfoViewProps) {
  const { pluginName } = props;
  const { showToast } = useToast();
  const { getRefreshPlugin, getReinstallPlugin } = usePlugins();
  const { plugins, isReady } = usePluginContext();
  const { refreshPlugin } = getRefreshPlugin();
  const { reinstallPlugin } = getReinstallPlugin();

  if (!isReady) {
    return null;
  }

  const plugin = plugins?.[pluginName];

  async function refreshSinglePluginClick(pluginName: string) {
    refreshPlugin(pluginName);
    showToast(`${pluginName} refreshed!`, ToastType.REFRESH);
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
    dependenciesElements = plugin.dependencies.map((d: any) => (
      <Box>
        {d}:{plugin.dependencies[d]}
      </Box>
    ));
    dependenciesElement = (
      <Box flexFlow='column'>
        <TypeFace fontSize='large'>Dependencies</TypeFace>
        {dependenciesElements}
        <div>
          <label>
            <button
              type='button'
              className='add-button'
              onClick={() => reinstallPlugin(pluginName)}
            >
              Reinstall Dependencies
            </button>
          </label>
        </div>
      </Box>
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
      <Stack spacing='medium' padding='small'>
        <Stack spacing='small'>
          <TypeFace fontSize='large'>Description</TypeFace>
          <TypeFace fontSize='medium'>{plugin.description}</TypeFace>
        </Stack>
        {dependenciesElement}
        <Columns spacing='small' padding='small'>
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
