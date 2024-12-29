import React from 'react';
import { ReactSVG } from 'react-svg';

interface SvgIconProps {
  fill: string;
  width?: string;
  height?: string;
  src: string;
}

export default function SvgIcon(props: SvgIconProps) {
  const { fill, width, height, src } = props;

  return (
    <ReactSVG
      src={src}
      beforeInjection={(svg) => {
        svg.setAttribute('width', width?.toString() || '100%');
        svg.setAttribute('height', height?.toString() || '100%');
        if (fill) {
          svg.setAttribute('fill', fill);
        }
      }}
    />
  );
}
