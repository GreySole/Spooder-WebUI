import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import SvgIcon from '../../../icons/SvgIcon';
import useTheme from '../../../../app/hooks/useTheme';

interface ButtonProps {
  className?: string;
  label?: string;
  width?: string;
  height?: string;
  disabled?: boolean;
  icon?: any;
  iconSize?: string;
  iconPosition?: 'left' | 'right' | 'top' | 'bottom';
  color?: string;
  colorOnHover?: boolean;
  onClick: () => void;
}

function getIcon(icon: any, isDarkTheme: boolean, size?: string) {
  size = size ? size : '100px';
  if (typeof icon === 'object' && 'icon' in icon) {
    // If icon is a FontAwesome icon prop
    return <FontAwesomeIcon icon={icon} size={size as SizeProp} />;
  } else if (typeof icon === 'string') {
    if (icon.endsWith('.svg')) {
      // If icon is a React component
      return (
        <SvgIcon fill={isDarkTheme ? 'white' : 'black'} width={size} height={size} src={icon} />
      );
    }
    // If icon is a string (URL)
    return <img src={icon} width={size} height={size} />;
  } else {
    return null; // or handle the error case as needed
  }
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
    case 'left':
      flexFlow = 'row';
      break;
    case 'right':
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
        gap: '16px',
        flexFlow,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colorOnHover ? (isHovered ? color : undefined) : color,
      }}
    >
      {label} {icon ? getIcon(icon, themeVariables.isDarkTheme, iconSize) : null}
    </button>
  );
}
