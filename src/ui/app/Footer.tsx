// filepath: /c:/Users/zasur/Documents/GitHub/Spooder-WebUI/src/context/FooterContext.tsx
import { Box } from '@greysole/spooder-component-library';
import React, { ReactNode, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

interface FooterProps {
  showFooter: boolean;
  children: ReactNode;
}

export function Footer({ children, showFooter }: FooterProps) {
  const ref = useRef(null);
  return (
    <CSSTransition
      nodeRef={ref}
      classNames='slide'
      appear={showFooter}
      in={showFooter}
      timeout={300}
    >
      <Box ref={ref} className='footer' spacing='smedium' padding='smedium' justifyContent='end' width='calc(100% - var(--menu-width))' style={{ left: 'calc(var(--menu-width) - 2px)', borderTop: 'solid 2px var(--button-border-color)', backgroundColor: 'var(--color-background-far)', borderRadius: 0, zIndex: 3}}>
        {children}
      </Box>
    </CSSTransition>
  );
}
