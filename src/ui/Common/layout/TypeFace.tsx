import { Properties } from 'csstype';
import React from 'react';

interface TypeFaceProps {
  children: React.JSX.Element[] | React.JSX.Element;
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
}

export default function TypeFace({ children, ...styles }: TypeFaceProps) {
  return <div style={styles}>{children}</div>;
}
