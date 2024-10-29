import React from 'react';

interface BoxProps {
  classes?: string[];
  width?: string;
  height?: string;
  padding?: string;
  margin?: string;
  flexFlow?: 'row' | 'column';
  alignItems?: 'left' | 'center' | 'right';
  justifyContent?: 'center' | 'space-between' | 'space-around' | 'space-evenly' | 'unset';
  children: React.JSX.Element[] | React.JSX.Element;
}

export default function Box(props: BoxProps) {
  const {
    classes = [],
    width = 'unset',
    height = 'unset',
    padding = 0,
    margin = 0,
    flexFlow = 'row',
    alignItems = 'left',
    justifyContent = 'unset',
    children,
  } = props;
  return (
    <div
      className={'box ' + classes.join(' ')}
      style={{
        display: 'flex',
        width: width,
        height: height,
        padding: padding,
        margin: margin,
        flexFlow: flexFlow,
        justifyContent: justifyContent,
        alignItems: alignItems,
      }}
    >
      {children}
    </div>
  );
}
