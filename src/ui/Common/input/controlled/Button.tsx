import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import SvgIcon from '../../../icons/SvgIcon';
import TwitchIcon from '../../../icons/TwitchIcon';

interface ButtonProps {
  label?: string;
  width?: string;
  height?: string;
  disabled?: boolean;
  icon?: any;
  iconSize?: string;
  iconPosition?: 'left' | 'right' | 'top' | 'bottom';
  onClick: () => void;
}

function getIcon(icon: any, size?: string) {
  console.log('SIZE', size ? true : false, typeof icon);
  size = size ? size : '100px';
  if (React.isValidElement(icon)) {
    // If icon is a React component
    return (
      <SvgIcon fill='white' width={size} height={size}>
        {React.cloneElement(icon)}
      </SvgIcon>
    );
  } else if (typeof icon === 'object' && 'icon' in icon) {
    // If icon is a FontAwesome icon prop
    return <FontAwesomeIcon icon={icon} size={size as SizeProp} />;
  } else if (typeof icon === 'string') {
    // If icon is a string (URL)
    return <img src={icon} width={size} height={size} />;
  } else {
    return null; // or handle the error case as needed
  }
}

export default function Button(props: ButtonProps) {
  const { label, width, height, disabled, icon, iconSize, iconPosition, onClick } = props;

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
      onClick={onClick}
      disabled={disabled ?? false}
      style={{
        width,
        height,
        display: 'flex',
        gap: '10px',
        flexFlow,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {label} {icon ? getIcon(icon, iconSize) : null}
    </button>
  );
}
