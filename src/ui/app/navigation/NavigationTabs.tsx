import React from 'react';
import TabButton from './TabButton';
import useNavigation from '../../../app/hooks/useNavigation';
import { Box } from '@greysole/spooder-component-library';

export default function NavigationTabs() {
  const { tabOptions } = useNavigation();

  const tabButtons = Object.entries(tabOptions).map(([key, label], index) => (
    <TabButton key={`tab-button-${key}`} tabName={key} tabLabel={label} index={index} />
  ));



  return (
    <Box flexFlow='column' justifyContent='center' alignItems='stretch' padding='small' spacing='xsmall'>
      {tabButtons}
    </Box>
  )
}
