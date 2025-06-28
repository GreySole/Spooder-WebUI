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
    <Box className={`top-header`} width='100%' flexFlow='column' justifyContent='center'>
      <Box
        className='navigation-bar'
        flexFlow='row nowrap'
        width='100%'
        justifyContent='space-between'
        alignItems='center'
        paddingLeft='small'
        paddingRight='small'
        onClick={toggleNavigation}
      >
        <div className='navigation-open-button'>
          <FontAwesomeIcon icon={navigationOpen ? faTimes : faBars} size='2x' />
        </div>
        <CustomSpooder />
      </Box>
      {!isMobileDevice ? <NavigationTabs /> : null}
    </Box>
  );
}
