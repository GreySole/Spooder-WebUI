import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faSpider } from '@fortawesome/free-solid-svg-icons';
import { useFormContext } from 'react-hook-form';
import useEvents from '../../../../app/hooks/useEvents';
import CircleLoader from '../../../common/loader/CircleLoader';
import { KeyedObject } from '../../../Types';

interface ToggleGridProps {
  formKey: string;
}

export default function CommandToggleGrid(props: ToggleGridProps) {
  const { formKey } = props;
  const { getChatCommands } = useEvents();
  const { data: chatCommands, isLoading, error } = getChatCommands();
  const { watch, setValue } = useFormContext();
  const selected = watch(`${formKey}.commands`, []);

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
    setValue(formKey, newSelected);
  };

  const gridItems = Object.keys(chatCommands).map((element: string) => (
    <div
      className={'toggle-grid-element ' + (selected.includes(element) ? 'selected' : '')}
      onClick={() => onToggleChange(element, !selected.includes(element))}
    >
      <FontAwesomeIcon icon={faCommentDots} size='2x' />
      <label>{chatCommands[element].command}</label>
    </div>
  ));

  return <div className='toggle-grid'>{gridItems}</div>;
}
