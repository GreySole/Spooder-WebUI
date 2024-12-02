import React from 'react';
import { ReactNode } from 'react';
import { StyleSize, StyleSizeType } from '../../Types';

interface ColumnsProps {
  children: ReactNode;
  spacing: StyleSizeType;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
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

export default function Columns(props: ColumnsProps) {
  const { children, spacing, onClick, ...styles } = props;
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
        flexDirection: 'row',
        alignItems: 'center',
        gap: StyleSize[spacing],
        width: 'inherit',
        height: 'inherit',
        overflow: 'auto',
        ...paddingStyle,
        ...marginStyle,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
