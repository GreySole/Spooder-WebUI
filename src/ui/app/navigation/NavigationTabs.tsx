import React from 'react';
import TabButton from './TabButton';
import useNavigation from '../../../app/hooks/useNavigation';
import { Box } from '@greysole/spooder-component-library';
import FolderTabButton from './FolderTabButton';

export default function NavigationTabs() {
  const { tabOptions, deckTabOptions } = useNavigation();

  const allTabs = { ...tabOptions, ...deckTabOptions };

  const tabButtons = Object.entries(allTabs).map(([key, data], index) => {
    return 'subTabs' in data ? (
      <>
        {index === Object.keys(tabOptions).length && <hr />}
        <FolderTabButton
          key={`tab-button-${key}`}
          tabName={key}
          tabLabel={data.label}
          index={index}
          icon={data.icon}
          subTabs={data.subTabs}
        />
      </>
    ) : (
      <>
        {index === Object.keys(tabOptions).length && <hr />}
        <TabButton
          key={`tab-button-${key}`}
          tabName={key}
          tabLabel={data.label}
          index={index}
          icon={data.icon}
        />
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
