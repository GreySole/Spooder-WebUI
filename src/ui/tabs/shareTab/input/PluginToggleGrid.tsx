import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlug, faSpider } from '@fortawesome/free-solid-svg-icons';
import { useFormContext } from 'react-hook-form';
import usePlugins from '../../../../app/hooks/usePlugins';
import { Box, Button, CircleLoader, useTheme } from '@greysole/spooder-component-library';
import PageCircleLoader from '../../../common/input/general/PageCircleLoader';

interface ToggleGridProps {
  formKey: string;
}

export default function PluginToggleGrid(props: ToggleGridProps) {
  const { formKey } = props;
  const { getPlugins } = usePlugins();
  const { data: plugins, isLoading, error } = getPlugins();
  const { watch, setValue } = useFormContext();
  const { themeColors } = useTheme();
  const pluginKey = `${formKey}.plugins`;

  const selected = watch(pluginKey, []);

  if (isLoading || !plugins) {
    return <PageCircleLoader />;
  }

  const gridData = Object.keys(plugins).map((plugin: string) => plugin);

  const onToggleChange = (element: string, isSelected: boolean) => {
    let newSelected = [...selected];
    if (isSelected) {
      newSelected.push(element);
    } else {
      newSelected = newSelected.filter((value: string) => value !== element);
    }
    setValue(formKey, newSelected);
  };

  const gridItems = gridData.map((element: string) => (
    <Box key={element} padding='small'>
      <Button
        width='large'
        label={plugins[element].name}
        icon={window.location.origin + '/icons/' + element + '.png'}
        fallbackIcon={faPlug}
        iconPosition='top'
        onClick={() => onToggleChange(element, !selected.includes(element))}
        color={
          selected.includes(element)
            ? themeColors.darkColorAnalogousCW
            : themeColors.buttonBackgroundColor
        }
        truncate
      />
    </Box>
  ));

  return <Box flexFlow='row wrap'>{gridItems}</Box>;
}
