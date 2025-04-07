import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots } from '@fortawesome/free-solid-svg-icons';
import { useFormContext } from 'react-hook-form';
import useEvents from '../../../../app/hooks/useEvents';
import { Box, Button, CircleLoader, useTheme } from '@greysole/spooder-component-library';

interface ToggleGridProps {
  formKey: string;
}

export default function CommandToggleGrid(props: ToggleGridProps) {
  const { formKey } = props;
  const { getChatCommands } = useEvents();
  const { data: chatCommands, isLoading, error } = getChatCommands();
  const { watch, setValue } = useFormContext();
  const commandKey = `${formKey}.commands`;
  const selected = watch(commandKey, []);
  const { themeColors } = useTheme();

  if (isLoading) {
    return <CircleLoader />;
  }

  const onToggleChange = (element: string, isSelected: boolean) => {
    let newSelected = [...selected];
    if (isSelected) {
      newSelected.push(element);
    } else {
      newSelected = newSelected.filter((value: string) => value !== element);
    }
    setValue(commandKey, newSelected);
  };

  const gridItems = Object.keys(chatCommands).map((element: string) => (
    <Box key={element} padding='small'>
      <Button
        width='large'
        label={chatCommands[element].command}
        icon={faCommentDots}
        iconPosition='top'
        onClick={() => onToggleChange(element, !selected.includes(element))}
        color={
          selected.includes(element)
            ? themeColors.colorAnalogousCW
            : themeColors.buttonBackgroundColor
        }
        truncate
      />
    </Box>
  ));

  return <Box flexFlow='row wrap'>{gridItems}</Box>;
}
