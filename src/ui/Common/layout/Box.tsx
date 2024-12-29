import { Properties } from 'csstype';
import React, { forwardRef, ReactNode } from 'react';
import { StyleSize, StyleSizeType } from '../../Types';

interface BoxProps {
  children: ReactNode;
  classes?: string[];
  width?: Properties['width'];
  height?: Properties['height'];
  flexFlow?: Properties['flexFlow'];
  alignItems?: Properties['alignItems'];
  justifyContent?: Properties['justifyContent'];
  overflow?: Properties['overflow'];
  padding?: StyleSizeType | string;
  paddingTop?: StyleSizeType | string;
  paddingRight?: StyleSizeType | string;
  paddingBottom?: StyleSizeType | string;
  paddingLeft?: StyleSizeType | string;
  margin?: StyleSizeType | string;
  marginTop?: StyleSizeType | string;
  marginRight?: StyleSizeType | string;
  marginBottom?: StyleSizeType | string;
  marginLeft?: StyleSizeType | string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default forwardRef<HTMLDivElement, BoxProps>(function Box(
  {
    children,
    classes,
    onClick,
    width,
    height,
    flexFlow,
    alignItems,
    justifyContent,
    overflow,
    ...styles
  },
  ref,
) {
  const resolveStyleSize = (value: StyleSizeType | string | undefined) => {
    return value && value in StyleSize ? StyleSize[value as StyleSizeType] : value;
  };

  const paddingStyle = styles.padding
    ? {
        paddingTop: resolveStyleSize(styles.padding),
        paddingRight: resolveStyleSize(styles.padding),
        paddingBottom: resolveStyleSize(styles.padding),
        paddingLeft: resolveStyleSize(styles.padding),
      }
    : {
        paddingTop: resolveStyleSize(styles.paddingTop),
        paddingRight: resolveStyleSize(styles.paddingRight),
        paddingBottom: resolveStyleSize(styles.paddingBottom),
        paddingLeft: resolveStyleSize(styles.paddingLeft),
      };

  const marginStyle = styles.margin
    ? {
        marginTop: resolveStyleSize(styles.margin),
        marginRight: resolveStyleSize(styles.margin),
        marginBottom: resolveStyleSize(styles.margin),
        marginLeft: resolveStyleSize(styles.margin),
      }
    : {
        marginTop: resolveStyleSize(styles.marginTop),
        marginRight: resolveStyleSize(styles.marginRight),
        marginBottom: resolveStyleSize(styles.marginBottom),
        marginLeft: resolveStyleSize(styles.marginLeft),
      };

  return (
    <div
      className={'box ' + (classes ? classes.join(' ') : '')}
      ref={ref}
      onClick={onClick}
      style={{
        display: 'flex',
        flexFlow: flexFlow || undefined,
        alignItems: alignItems || undefined,
        justifyContent: justifyContent || undefined,
        width: width || undefined,
        height: height || undefined,
        boxSizing: 'border-box',
        overflow: overflow || undefined,
        ...paddingStyle,
        ...marginStyle,
      }}
    >
      {children}
    </div>
  );
});
