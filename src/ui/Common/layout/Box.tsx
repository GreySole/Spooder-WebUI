import { Properties } from 'csstype';
import React from 'react';

interface BoxProps {
  classes?: string[];
  width?: Properties['width'];
  height?: Properties['height'];
  padding?: Properties['padding'];
  margin?: Properties['margin'];
  flexFlow?: Properties['flexFlow'];
  alignItems?: Properties['alignItems'];
  justifyContent?: Properties['justifyContent'];
  children: React.JSX.Element[] | React.JSX.Element;
}

export default function Box({ children, classes, ...styles }: BoxProps) {
  return (
    <div
      className={'box ' + classes?.join(' ')}
      style={{
        display: 'flex',
        ...styles,
      }}
    >
      {children}
    </div>
  );
}
