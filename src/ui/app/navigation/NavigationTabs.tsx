import React from 'react';
import TabButton from './TabButton';
import useNavigation from '../../../app/hooks/useNavigation';

export default function NavigationTabs() {
  const { tabOptions } = useNavigation();

  const tabButtons = Object.entries(tabOptions).map(([key, label]) => (
    <TabButton tabName={key} tabLable={label} />
  ));

  return <div className='navigation-tabs'>{tabButtons}</div>;
}
