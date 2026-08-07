import { faTimes, faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import useNavigation from '../../app/hooks/useNavigation';
import NavigationTabs from './navigation/NavigationTabs';
import { Box, useTheme, CustomSpooder, Icon } from '@spooder/webui-component-library';

export default function Header() {
  const { navigationOpen, toggleNavigation } = useNavigation();
  const { isMobileDevice } = useTheme();
  return (
    <Box
      className={`nav-menu ${isMobileDevice ? (navigationOpen ? 'open' : '') : 'open'}`}
      width='100%'
      height='100%'
      flexFlow='column'
      backgroundColor='var(--color-background-far)'
      style={{
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
    </Box>
  );
}
