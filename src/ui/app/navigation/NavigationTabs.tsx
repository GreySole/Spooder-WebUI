import React from 'react';
import TabButton from './TabButton';
import useNavigation from '../../../app/hooks/useNavigation';
import { Box } from '@greysole/spooder-component-library';

export default function NavigationTabs() {
  const { tabOptions, deckTabOptions } = useNavigation();

  const allTabs = { ...tabOptions, ...deckTabOptions };

  const tabButtons = Object.entries(allTabs).map(([key, label], index) => {
      return (
        <>
          {index === Object.keys(tabOptions).length && <hr />}
          <TabButton key={`tab-button-${key}`} tabName={key} tabLabel={label} index={index} />
        </>
      );
  });

  return (
    <Box
      flexFlow='column'
      justifyContent='center'
      alignItems='stretch'
      padding='small'
      spacing='none'
    >
      {tabButtons}
    </Box>
  );
}
