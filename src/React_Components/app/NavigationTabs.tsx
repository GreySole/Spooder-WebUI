import React from 'react';
import TabButton from '../UI/TabButton';
import useNavigation from '../../app/hooks/useNavigation';

export default function NavigationTabs() {
  const {tabOptions, setTab, currentTab} = useNavigation();
  
  

  return <div className='navigation-tabs'>
    {Object.entries(tabOptions).forEach(([key, label]) => (
        <TabButton
            tabName={key}
            tabLable={label}
          />
      ))!}
  </div>;
}
