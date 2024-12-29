import { faTimes, faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import CustomSpooder from './navigation/CustomSpooder';
import useNavigation from '../../app/hooks/useNavigation';
import useToast from '../../app/hooks/useToast';
import NavigationTabs from './navigation/NavigationTabs';
import Box from '../common/layout/Box';
import useTheme from '../../app/hooks/useTheme';

export default function Header() {
  const { navigationOpen, toggleNavigation } = useNavigation();
  const { toastOpen, toastText, toastType } = useToast();
  const { isMobileDevice } = useTheme();
  return (
    <Box
      classes={[`top-header ${toastType} ${toastOpen ? 'toast-open' : ''}`]}
      width='100%'
      flexFlow='column'
      justifyContent='center'
    >
      <Box
        classes={['navigation-bar']}
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
        <div className='toast-text'>{toastText}</div>
        <CustomSpooder />
      </Box>
      {!isMobileDevice ? <NavigationTabs /> : null}
    </Box>
  );
}
