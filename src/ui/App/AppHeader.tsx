import { faTimes, faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import CustomSpooder from './navigation/CustomSpooder';
import useNavigation from '../../app/hooks/useNavigation';
import useToast from '../../app/hooks/useToast';

export default function AppHeader() {
  const { navigationOpen, toggleNavigation } = useNavigation();
  const { toastOpen, toastText, toastType } = useToast();
  return (
    <div className='App-header'>
      <div
        className={`top-header ${toastType} ${toastOpen ? 'toast-open' : ''}`}
        onClick={toggleNavigation}
      >
        <div className='navigation-open-button'>
          <FontAwesomeIcon icon={navigationOpen ? faTimes : faBars} size='2x' />
        </div>
        <div className='toast-text'>{toastText}</div>
        <CustomSpooder />
      </div>
    </div>
  );
}
