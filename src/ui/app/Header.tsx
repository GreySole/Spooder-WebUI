import { faTimes, faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import useNavigation from '../../app/hooks/useNavigation';
import NavigationTabs from './navigation/NavigationTabs';
import { Box, useTheme, CustomSpooder } from '@greysole/spooder-component-library';

export default function Header() {
  const { navigationOpen, toggleNavigation } = useNavigation();
  const { isMobileDevice } = useTheme();
  return (
    <Box flexFlow='column' justifyContent='start' paddingBottom='medium' backgroundColor='var(--color-background-far)' width='100%' style={{ borderRadius: 0, borderRight: '2px solid var(--button-border-color)' }}>
      {/* <Box
        className='navigation-bar'
        flexFlow='column'
        justifyContent='space-between'
        alignItems='start'
        padding='medium'
        onClick={toggleNavigation}
      >
        <div className='navigation-open-button' style={{ zIndex: 11}}>
          <FontAwesomeIcon icon={navigationOpen ? faTimes : faBars} size='2x' />
        </div>
      </Box> */}
      <NavigationTabs />
      {/* {!isMobileDevice && <NavigationTabs />} */}
    </Box>
  );
}
