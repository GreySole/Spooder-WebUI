import { faTimes, faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import useNavigation from '../../app/hooks/useNavigation';
import NavigationTabs from './navigation/NavigationTabs';
import { Box, useTheme, CustomSpooder, Icon } from '@spooder/webui-component-library';

export default function Header() {
  const { navigationOpen, toggleNavigation, setNavRailHovered } = useNavigation();
  const { isMobileDevice } = useTheme();
  return (
    // Box doesn't forward onMouseEnter/onMouseLeave to its underlying div (see BoxProps), so
    // this one container - the only one that needs hover - is a plain div styled to match what
    // Box would have rendered instead.
    <div
      className={`box nav-menu ${isMobileDevice ? (navigationOpen ? 'open' : '') : 'open'}`}
      // Desktop-only rail expansion. On mobile, navigationOpen already drives the full
      // slide-out via the hamburger toggle below, so hover has no separate role there.
      onMouseEnter={() => !isMobileDevice && setNavRailHovered(true)}
      onMouseLeave={() => !isMobileDevice && setNavRailHovered(false)}
      style={{
        display: 'flex',
        flexFlow: 'column',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        backgroundColor: 'var(--color-background-far)',
        borderRadius: 0,
      }}
    >
      {isMobileDevice ? (
        <Box
          className='nav-toggle'
          onClick={toggleNavigation}
          padding='medium'
          style={{ cursor: 'pointer' }}
        >
          {navigationOpen ? (
            <Icon icon={faTimes} iconSize='xlarge' />
          ) : (
            <Icon icon={faBars} iconSize='xlarge' />
          )}
        </Box>
      ) : null}

      <Box
        className='nav-buttons'
        width='100%'
        flexFlow='column'
        justifyContent='start'
        marginTop={isMobileDevice ? 'var(--header-height)' : '0'}
        paddingBottom='medium'
      >
        <NavigationTabs />
      </Box>
    </div>
  );
}
