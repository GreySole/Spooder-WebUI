import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faSpider } from '@fortawesome/free-solid-svg-icons';
import { useFormContext } from 'react-hook-form';
import useEvents from '../../../../app/hooks/useEvents';
import CircleLoader from '../../../common/loader/CircleLoader';
import { KeyedObject } from '../../../Types';
import usePlugins from '../../../../app/hooks/usePlugins';

interface ToggleGridProps {
  formKey: string;
}

export default function PluginToggleGrid(props: ToggleGridProps) {
  const { formKey } = props;
  const { getPlugins } = usePlugins();
  const { data: plugins, isLoading, error } = getPlugins();
  const { watch, setValue } = useFormContext();
  const selected = watch(`${formKey}.plugins`, []);

  if (isLoading || !plugins) {
    return <CircleLoader />;
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
    <div
      className={'toggle-grid-element ' + (selected.includes(element) ? 'selected' : '')}
      onClick={() => onToggleChange(element, !selected.includes(element))}
    >
      <FontAwesomeIcon icon={faSpider} size='2x' />
      <label>{element}</label>
    </div>
  ));

  return <div className='toggle-grid'>{gridItems}</div>;
}
