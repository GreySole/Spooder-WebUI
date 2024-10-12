import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';

interface ButtonProps {
  label: string;
  disabled?: boolean;
  icon?: any;
  iconSize?: string;
  onClick: () => void;
}

function getIcon(icon: any, size?: string) {
  size = size ? '100px' : size;
  return 'icon' in icon ? (
    <FontAwesomeIcon icon={icon} size={size as SizeProp} />
  ) : (
    <img src={icon} />
  );
}

export default function Button(props: ButtonProps) {
  const { label, disabled, icon, iconSize, onClick } = props;

  return (
    <button onClick={onClick} disabled={disabled ?? false}>
      {label} {icon ? getIcon(icon, iconSize) : null}
    </button>
  );
}
