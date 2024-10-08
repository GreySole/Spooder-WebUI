import React from 'react';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';

interface ButtonProps {
  label: string;
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
  const { label, icon, iconSize, onClick } = props;

  return (
    <button onClick={onClick}>
      {label} {icon ? getIcon(icon, iconSize) : null}
    </button>
  );
}
