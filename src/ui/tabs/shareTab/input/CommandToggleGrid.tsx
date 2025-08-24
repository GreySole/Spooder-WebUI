import React from 'react';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { useFormContext } from 'react-hook-form';
import useEvents from '../../../../app/hooks/useEvents';
import { Box, Button, CircleLoader, useTheme } from '@greysole/spooder-component-library';
import PageCircleLoader from '../../../common/input/general/PageCircleLoader';
import { SharedElement } from '../../../Types';

export default function CommandToggleGrid() {
  const { getChatCommands } = useEvents();
  const { data: chatCommands, isLoading, error } = getChatCommands();
  const { watch, setValue } = useFormContext();
  const commandKey = `commands`;
  const selected = watch(commandKey, {} as SharedElement);
  const { themeColors } = useTheme();

  if (isLoading) {
    return <PageCircleLoader />;
  }

  const onToggleChange = (element: string, isSelected: boolean) => {
    let newSelected = { ...selected } as SharedElement;
    if (isSelected) {
      newSelected[element] = true;
    } else {
      delete newSelected[element];
    }
    setValue(commandKey, newSelected, { shouldDirty: true });
  };

  const gridItems = Object.keys(chatCommands).map((element: string) => (
    <Box key={element} padding='small'>
      <Button
        width='large'
        label={chatCommands[element].command}
        icon={faCommentDots}
        iconPosition='top'
        onClick={() => onToggleChange(element, !Object.keys(selected).includes(element))}
        color={
          Object.keys(selected).includes(element)
            ? themeColors.colorAnalogousCW
            : themeColors.buttonBackgroundColor
        }
        truncate
      />
    </Box>
  ));

  return <Box flexFlow='row wrap'>{gridItems}</Box>;
}
