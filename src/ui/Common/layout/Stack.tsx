import React from 'react';
import { ReactNode } from 'react';
import { StyleSize, StyleSizeType } from '../../Types';
import { Properties } from 'csstype';

interface StackProps {
  children: ReactNode;
  spacing: StyleSizeType;
  width?: Properties['width'];
  height?: Properties['height'];
  dividers?: boolean;
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
}

export default function Stack(props: StackProps) {
  const { children, spacing, dividers, width, height, ...styles } = props;

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
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: StyleSize[spacing],
        width: width,
        height: height,
        ...paddingStyle,
        ...marginStyle,
      }}
    >
      {children}
    </div>
  );
}
