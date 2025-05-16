import React from 'react';
import useNavigation from '../../../app/hooks/useNavigation';

interface TabButtonProps {
  tabName: string;
  tabLable: string;
}

export default function TabButton(props: TabButtonProps) {
  const { tabName, tabLable } = props;
  const { setTab, currentTab, setNavigation } = useNavigation();
  return (
    <button
      type='button'
      className={'tab-button' + (currentTab == tabName ? ' selected' : '')}
      onClick={() => {
        setTab(tabName);
        setNavigation(false);
      }}
    >
      {tabLable}
    </button>
  );
}
