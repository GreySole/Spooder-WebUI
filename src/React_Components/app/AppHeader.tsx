import { faTimes, faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import CustomSpooder from './CustomSpooder';
import useTheme from '../../app/hooks/useTheme';
import useNavigation from '../../app/hooks/useNavigation';
import useToast from '../../app/hooks/useToast';

export default function AppHeader() {
  const { setThemeColor, themeColor } = useTheme();
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
        <label>
          Theme Color:
          <input
            type='color'
            value={themeColor}
            onChange={(e) => setThemeColor(e.target.value)}
            title='Change Theme Color'
            onClick={(e) => e.stopPropagation()}
          />
          {/* {(luma(this.state.themeColor) < .01) && <FontAwesomeIcon icon={faWarning} size="1x" />} */}
        </label>
        <CustomSpooder />
      </div>
    </div>
  );
}
