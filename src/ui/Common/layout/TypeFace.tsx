import { Properties } from 'csstype';
import React, { ReactNode } from 'react';
import { StyleSize, StyleSizeType } from '../../Types';

interface TypeFaceProps {
  children: ReactNode;
  color?: Properties['color'];
  fontSize?: StyleSizeType;
  fontWeight?: Properties['fontWeight'];
  textAlign?: Properties['textAlign'];
  fontFamily?: Properties['fontFamily'];
  lineHeight?: Properties['lineHeight'];
  letterSpacing?: Properties['letterSpacing'];
  textTransform?: Properties['textTransform'];
  textDecoration?: Properties['textDecoration'];
  whiteSpace?: Properties['whiteSpace'];
  wordBreak?: Properties['wordBreak'];
  wordSpacing?: Properties['wordSpacing'];
  textShadow?: Properties['textShadow'];
  textOverflow?: Properties['textOverflow'];
  userSelect?: Properties['userSelect'];
}

export default function TypeFace({ children, ...styles }: TypeFaceProps) {
  const fontSize = styles.fontSize ? StyleSize[styles.fontSize] : '1rem';
  return (
    <div
      style={{
        ...styles,
        fontSize,
      }}
    >
      {children}
    </div>
  );
}
