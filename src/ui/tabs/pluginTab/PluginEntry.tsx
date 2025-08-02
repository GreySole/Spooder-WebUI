import React, { useEffect, useRef, useState } from 'react';
import {
  faTriangleExclamation,
  faPlug,
  faStopCircle,
  faBan,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  LinkButton,
  Border,
  Stack,
  Box,
  Columns,
  ImageFile,
  TypeFace,
  useTheme,
  Modal,
  Icon,
} from '@greysole/spooder-component-library';
import { PluginComponentProps } from '../../Types';
import { usePluginContext } from './context/PluginTabFormContext';
import PluginButtonRow from './input/PluginButtonRow';

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
  const { pluginName, setRef } = props;

  const { plugins, isReady, pluginInfoOpen } = usePluginContext();

  const [iconCacheBuster, setIconCacheBuster] = useState(Date.now());

  useEffect(() => {
    setIconCacheBuster(Date.now());
  }, [pluginInfoOpen]);

  const entryRef = useRef(null);

  useEffect(() => {
    if (setRef) {
      setRef(pluginName, entryRef.current);
    }
  }, [pluginName, setRef]);

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
    <Border borderWidth='2px' borderBottom>
      <Stack spacing='small'>
        <Box
          ref={entryRef}
          flexFlow={isMobileDevice ? 'column' : 'row'}
          alignItems='center'
          justifyContent='space-between'
          padding='small'
        >
          <Columns spacing='medium' padding='small'>
            {plugin.status === 'ok' ? (
              <Icon
                icon={window.location.origin + '/icons/' + pluginName + '.png?v=' + iconCacheBuster}
                fallbackIcon={faPlug}
                iconSize='100px'
              />
            ) : (
              <FontAwesomeIcon
                className='plugin-status-icon'
                icon={plugin.status === 'disabled' ? faBan : faTriangleExclamation}
                style={{ width: '100px', height: '100px' }}
              />
            )}

            <Stack spacing='medium'>
              <Stack spacing='none'>
                <TypeFace fontSize='xlarge'>{plugin.name}</TypeFace>
                <TypeFace fontSize='medium'>{plugin.version + ' by ' + plugin.author}</TypeFace>
              </Stack>
              <Columns spacing='medium'>{pluginLinks}</Columns>
            </Stack>
          </Columns>
          <PluginButtonRow pluginName={pluginName} status={plugin.status} />
        </Box>
      </Stack>
    </Border>
  );
}
