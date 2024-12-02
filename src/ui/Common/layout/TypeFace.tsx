import { Properties } from 'csstype';
import React, { ReactNode } from 'react';

interface TypeFaceProps {
  children: ReactNode;
  color?: Properties['color'];
  fontSize?: Properties['fontSize'];
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
  return <div style={styles}>{children}</div>;
}
