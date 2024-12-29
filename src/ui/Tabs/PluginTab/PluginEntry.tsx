import React from 'react';
import { faTriangleExclamation, faPlug } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LinkButton from '../../common/input/general/LinkButton';
import { PluginComponentProps, ToastType } from '../../Types';
import PluginInfoView from './PluginInfoView';
import PluginSettings from './input/PluginSettings';
import { usePluginContext } from './context/PluginTabFormContext';
import PluginAssetManager from './PluginAssetManager';
import TypeFace from '../../common/layout/TypeFace';
import Columns from '../../common/layout/Columns';
import Box from '../../common/layout/Box';
import Stack from '../../common/layout/Stack';
import ImageFile from '../../common/input/general/ImageFile';
import PluginButtonRow from './input/PluginButtonRow';
import useTheme from '../../../app/hooks/useTheme';
import Border from '../../common/layout/Border';

interface Plugin {
  name: string;
  version: string;
  status: string;
  author: string;
  message: string;
  hasOverlay: boolean;
  hasUtility: boolean;
  hasExternalSettingsPage: boolean;
}

export default function PluginEntry(props: PluginComponentProps) {
  const { pluginName } = props;

  const { plugins, isReady, pluginInfoOpen, pluginSettingsOpen, pluginAssetsOpen } =
    usePluginContext();

  const { isMobileDevice } = useTheme();

  if (!isReady) {
    return null;
  }

  const plugin = plugins?.[pluginName];

  let pluginLinks = [];
  if (plugin.hasOverlay) {
    pluginLinks.push(
      <LinkButton
        name={pluginName + '-overlay'}
        label={'Overlay'}
        mode='copy'
        link={window.location.origin + '/overlay/' + pluginName}
      />,
    );
  }
  if (plugin.hasUtility) {
    pluginLinks.push(
      <LinkButton
        name={pluginName + '-utility'}
        label={'Utility'}
        mode='newtab'
        link={window.location.origin + '/utility/' + pluginName}
      />,
    );
  }

  return (
    <Border borderColor='grey' borderWidth='2px' borderBottom>
      <Stack spacing='small'>
        <Box
          flexFlow={isMobileDevice ? 'column' : 'row'}
          alignItems='center'
          justifyContent='space-between'
          padding='small'
        >
          <Columns spacing='medium' padding='small'>
            {plugin.status === 'ok' ? (
              <ImageFile
                src={window.location.origin + '/icons/' + pluginName + '.png'}
                fallbackIcon={faPlug}
              />
            ) : (
              <FontAwesomeIcon
                className='plugin-status-icon'
                icon={faTriangleExclamation}
                size='lg'
              />
            )}

            <Stack spacing='medium'>
              <Stack spacing='none'>
                <TypeFace fontSize='xlarge'>{plugin.name}</TypeFace>
                <TypeFace fontSize='medium'>{plugin.version + ' by ' + plugin.author}</TypeFace>
              </Stack>
              <div className='plugin-entry-links'>{pluginLinks}</div>
            </Stack>
          </Columns>
          <PluginButtonRow pluginName={pluginName} status={plugin.status} />
        </Box>
        {pluginInfoOpen === pluginName ? <PluginInfoView pluginName={pluginName} /> : null}
        {plugin.status === 'ok' && pluginSettingsOpen === pluginName ? (
          <PluginSettings pluginName={pluginName} />
        ) : null}
        {plugin.status === 'ok' && pluginAssetsOpen === pluginName ? (
          <PluginAssetManager pluginName={pluginName} />
        ) : null}
      </Stack>
    </Border>
  );
}
