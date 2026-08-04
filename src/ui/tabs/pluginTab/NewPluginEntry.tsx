import { faPlug, faBan, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Border,
  Stack,
  Box,
  Columns,
  Icon,
  TypeFace,
  CircleLoader,
  useTheme,
} from '@spooder/webui-component-library';
import React, { useRef, useEffect } from 'react';
import { PluginComponentProps } from '../../Types';
import PluginButtonRow from './input/PluginButtonRow';
import { usePluginContext } from './context/PluginTabFormContext';

export default function NewPluginEntry(props: PluginComponentProps) {
  const { pluginName, setRef } = props;
  const { newPlugins } = usePluginContext();
  const { isMobileDevice } = useTheme();
  const plugin = newPlugins?.[pluginName];

  const entryRef = useRef(null);

  useEffect(() => {
    if (setRef) {
      setRef(pluginName, entryRef.current);
    }
  }, [pluginName, setRef]);

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
            <Box width='100px' height='100px'>
              <CircleLoader />
            </Box>

            <Stack spacing='medium'>
              <Stack spacing='none'>
                <TypeFace fontSize='xlarge'>{plugin.name}</TypeFace>
                <TypeFace fontSize='medium'>{plugin.status + ' : ' + plugin.message}</TypeFace>
              </Stack>
            </Stack>
          </Columns>
          <PluginButtonRow pluginName={pluginName} status={plugin.status} />
        </Box>
      </Stack>
    </Border>
  );
}
