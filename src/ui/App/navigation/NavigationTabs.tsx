import React from 'react';
import TabButton from './TabButton';
import useNavigation from '../../../app/hooks/useNavigation';
import Columns from '../../common/layout/Columns';
import Box from '../../common/layout/Box';

export default function NavigationTabs() {
  const { tabOptions } = useNavigation();

  const tabButtons = Object.entries(tabOptions).map(([key, label]) => (
    <TabButton tabName={key} tabLable={label} />
  ));

  return <Box classes={['navigation-tabs']}>{tabButtons}</Box>;
}
