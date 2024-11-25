import React from 'react';
import { ReactNode } from 'react';
import TwitchIcon from './twitch.svg';

interface SvgIconProps {
  fill: string;
  width?: string;
  height?: string;
  children: ReactNode;
}

export default function SvgIcon(props: SvgIconProps) {
  const { fill, width, height, children } = props;

  return <div style={{ width: width, height: height, fill: fill }}>{children}</div>;
}
