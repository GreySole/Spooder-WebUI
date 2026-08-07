import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlug, faSpider } from '@fortawesome/free-solid-svg-icons';
import { useFormContext } from 'react-hook-form';
import usePlugins from '../../../../app/hooks/usePlugins';
import { Box, Button, CircleLoader, useTheme } from '@spooder/webui-component-library';
import PageCircleLoader from '../../../common/input/general/PageCircleLoader';
import { SharedElement } from '../../../Types';

export default function PluginToggleGrid() {
  const { getPlugins } = usePlugins();
  const { data: plugins, isLoading, error } = getPlugins();
  const { watch, setValue } = useFormContext();
  const { themeColors } = useTheme();
  const pluginKey = `plugins`;

  const selected = watch(pluginKey, {} as SharedElement);

  if (isLoading || !plugins) {
    return <PageCircleLoader />;
  }

  const gridData = Object.keys(plugins).map((plugin: string) => plugin);

  const onToggleChange = (element: string, isSelected: boolean) => {
    let newSelected = { ...selected } as SharedElement;
    if (isSelected) {
      newSelected[element] = true;
    } else {
      delete newSelected[element];
    }
    setValue(pluginKey, newSelected, { shouldDirty: true });
  };

  const gridItems = gridData.map((element: string) => (
    <Box key={element} padding='small'>
      <Button
        width='large'
        label={plugins[element].name}
        icon={window.location.origin + '/icons/' + element + '.png'}
        fallbackIcon={faPlug}
        iconPosition='top'
        onClick={() => onToggleChange(element, !Object.keys(selected).includes(element))}
        color={
          Object.keys(selected).includes(element)
            ? themeColors.darkColorAnalogousCW
            : themeColors.buttonBackgroundColor
        }
        truncate
      />
    </Box>
  ));

  return <Box flexFlow='row wrap'>{gridItems}</Box>;
}
