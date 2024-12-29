import React, { useState } from 'react';
import useTheme from '../../../../app/hooks/useTheme';
import { getIcon } from '../../../util/MediaUtil';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface ButtonProps {
  className?: string;
  label?: string;
  width?: string;
  height?: string;
  disabled?: boolean;
  icon?: IconProp | string;
  iconSize?: string;
  iconPosition?: 'left' | 'right' | 'top' | 'bottom';
  color?: string;
  colorOnHover?: boolean;
  onClick: () => void;
}

export default function Button(props: ButtonProps) {
  const {
    className,
    label,
    width,
    height,
    disabled,
    icon,
    iconSize,
    iconPosition,
    onClick,
    color,
    colorOnHover,
  } = props;
  const { themeVariables } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  let flexFlow = 'left';

  switch (iconPosition) {
    case 'right':
      flexFlow = 'row';
      break;
    case 'left':
      flexFlow = 'row-reverse';
      break;
    case 'top':
      flexFlow = 'column';
      break;
    case 'bottom':
      flexFlow = 'column-reverse';
      break;
  }

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled ?? false}
      onMouseOver={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
      style={{
        width,
        height,
        display: 'flex',
        gap: '1rem',
        flexFlow,
        fontSize: '1rem',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colorOnHover ? (isHovered ? color : undefined) : color,
      }}
    >
      {label} {icon ? getIcon(icon, themeVariables.isDarkTheme, iconSize) : null}
    </button>
  );
}
