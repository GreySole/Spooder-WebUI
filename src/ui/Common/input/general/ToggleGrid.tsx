import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentDots, faSpider } from '@fortawesome/free-solid-svg-icons';

interface ToggleGridProps {
  type: string;
  data: string[];
  selected: string[];
  onToggleChange: (type: String, key: String, value: Boolean) => void;
}

export default function ToggleGrid(props: ToggleGridProps) {
  const { type, data, selected, onToggleChange } = props;

  const gridItems = data.map((element) => {
    <div
      className={'toggle-grid-element ' + (selected.includes(element) ? 'selected' : '')}
      onClick={() => onToggleChange(type, element, !selected.includes(element))}
    >
      <FontAwesomeIcon icon={type == 'commands' ? faCommentDots : faSpider} size='2x' />
      <label>{element}</label>
    </div>;

    return <div className='toggle-grid'>{gridItems}</div>;
  });
}
