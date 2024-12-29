// filepath: /c:/Users/zasur/Documents/GitHub/Spooder-WebUI/src/context/FooterContext.tsx
import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';
import Box from '../common/layout/Box';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

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
      <Box ref={ref} classes={['footer']} width='100%' height='var(--footer-height)'>
        {children}
      </Box>
    </CSSTransition>
  );
}
