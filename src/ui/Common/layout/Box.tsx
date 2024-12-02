import { Properties } from 'csstype';
import React, { ReactNode } from 'react';
import { StyleSize, StyleSizeType } from '../../Types';

interface BoxProps {
  children: ReactNode;
  classes?: string[];
  width?: Properties['width'];
  height?: Properties['height'];
  flexFlow?: Properties['flexFlow'];
  alignItems?: Properties['alignItems'];
  justifyContent?: Properties['justifyContent'];
  padding?: StyleSizeType;
  paddingTop?: StyleSizeType;
  paddingRight?: StyleSizeType;
  paddingBottom?: StyleSizeType;
  paddingLeft?: StyleSizeType;
  margin?: StyleSizeType;
  marginTop?: StyleSizeType;
  marginRight?: StyleSizeType;
  marginBottom?: StyleSizeType;
  marginLeft?: StyleSizeType;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function Box({
  children,
  classes,
  onClick,
  width,
  height,
  flexFlow,
  alignItems,
  justifyContent,
  ...styles
}: BoxProps) {
  const paddingStyle = styles.padding
    ? {
        paddingTop: StyleSize[styles.padding],
        paddingRight: StyleSize[styles.padding],
        paddingBottom: StyleSize[styles.padding],
        paddingLeft: StyleSize[styles.padding],
      }
    : {
        paddingTop: styles.paddingTop ? StyleSize[styles.paddingTop] : undefined,
        paddingRight: styles.paddingRight ? StyleSize[styles.paddingRight] : undefined,
        paddingBottom: styles.paddingBottom ? StyleSize[styles.paddingBottom] : undefined,
        paddingLeft: styles.paddingLeft ? StyleSize[styles.paddingLeft] : undefined,
      };

  const marginStyle = styles.margin
    ? {
        marginTop: StyleSize[styles.margin],
        marginRight: StyleSize[styles.margin],
        marginBottom: StyleSize[styles.margin],
        marginLeft: StyleSize[styles.margin],
      }
    : {
        marginTop: styles.marginTop ? StyleSize[styles.marginTop] : undefined,
        marginRight: styles.marginRight ? StyleSize[styles.marginRight] : undefined,
        marginBottom: styles.marginBottom ? StyleSize[styles.marginBottom] : undefined,
        marginLeft: styles.marginLeft ? StyleSize[styles.marginLeft] : undefined,
      };

  return (
    <div
      className={'box ' + (classes ? classes.join(' ') : '')}
      onClick={onClick}
      style={{
        display: 'flex',
        flexFlow: flexFlow || undefined,
        alignItems: alignItems || undefined,
        justifyContent: justifyContent || undefined,
        width: width || undefined,
        height: height || undefined,
        boxSizing: 'border-box',
        overflow: 'auto',
        ...paddingStyle,
        ...marginStyle,
      }}
    >
      {children}
    </div>
  );
}
