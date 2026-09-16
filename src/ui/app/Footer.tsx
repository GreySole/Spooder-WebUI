// filepath: /c:/Users/zasur/Documents/GitHub/Spooder-WebUI/src/context/FooterContext.tsx
import { Box, useTheme } from '@spooder/webui-component-library';
import React, { ReactNode, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import useNavigation from '../../app/hooks/useNavigation';

interface FooterProps {
  showFooter: boolean;
  children: ReactNode;
}

export function Footer({ children, showFooter }: FooterProps) {
  const ref = useRef(null);
  const { isMobileDevice } = useTheme();
  const { navigationOpen, navRailHovered } = useNavigation();
  // Same width the sidebar itself is currently using (see App.tsx's grid columns), so the
  // footer's edge always lines up with the nav regardless of collapsed/expanded/mobile state.
  const menuWidth = isMobileDevice
    ? navigationOpen
      ? 'var(--menu-width)'
      : '0px'
    : navRailHovered
      ? 'var(--menu-width)'
      : 'var(--menu-width-rail)';
  return (
    <CSSTransition
      nodeRef={ref}
      classNames='slide'
      appear={showFooter}
      in={showFooter}
      timeout={300}
    >
      <Box
        ref={ref}
        className='footer'
        spacing='smedium'
        padding='smedium'
        justifyContent='end'
        width={`calc(100% - ${menuWidth})`}
        style={{
          left: `calc(${menuWidth} - 2px)`,
          borderTop: 'solid 2px var(--button-border-color)',
          backgroundColor: 'var(--color-background-far)',
          borderRadius: 0,
          zIndex: 3,
        }}
      >
        {children}
      </Box>
    </CSSTransition>
  );
}
