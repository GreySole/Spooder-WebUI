import React from 'react';
import type { DragHandleProps } from './SortableItem';
import { faGrip } from '@fortawesome/free-solid-svg-icons';
import { Icon, useTooltip } from '@greysole/spooder-component-library';

interface DragHandleButtonProps {
  dragHandleProps: DragHandleProps;
  tooltipText?: string;
  style?: React.CSSProperties;
}

const DragHandleButton: React.FC<DragHandleButtonProps> = ({
  dragHandleProps,
  tooltipText = '',
  style,
}) => {
  const { showTip, hideTip } = useTooltip();

  const showTooltip = () => {
    showTip(tooltipText);
  };

  const hideTooltip = () => {
    hideTip();
  };

  return (
    <button
      {...dragHandleProps}
      type='button'
      className='drag-handle-button minimal'
      onPointerEnter={tooltipText ? showTooltip : undefined}
      onPointerLeave={tooltipText ? hideTooltip : undefined}
      style={{
        cursor: 'move',
        background: 'transparent',
        border: 'none',
        padding: 0,
        opacity: 0.5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      <Icon icon={faGrip} iconSize='medium' />
    </button>
  );
};

export default DragHandleButton;
