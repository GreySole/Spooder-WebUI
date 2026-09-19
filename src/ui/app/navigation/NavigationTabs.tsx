import React from 'react';
import TabButton from './TabButton';
import useNavigation from '../../../app/hooks/useNavigation';
import { Box } from '@spooder/webui-component-library';
import FolderTabButton from './FolderTabButton';
import { CORE_DECK_TABS } from '../../../app/slice/navigationSlice';

export default function NavigationTabs() {
  const { tabOptions, deckTabOptions } = useNavigation();

  const allTabs = { ...tabOptions, ...deckTabOptions };

  // Two dividers: one between the main settings and the deck section (modules + tools), and one
  // within the deck section between its module tabs and the built-in tool tabs. deckTabOptions
  // is always built module tabs first, CORE_DECK_TABS last (see _setModuleTabs), so the tools
  // boundary is just its own length back from the end of the deck section.
  const mainTabCount = Object.keys(tabOptions).length;
  const toolsStartIndex =
    mainTabCount + Object.keys(deckTabOptions).length - Object.keys(CORE_DECK_TABS).length;
  // Only worth a second divider if there's at least one module tab ahead of it to separate from.
  const showToolsDivider = toolsStartIndex > mainTabCount;

  const tabButtons = Object.entries(allTabs).map(([key, data], index) => {
    const divider =
      index === mainTabCount || (showToolsDivider && index === toolsStartIndex) ? <hr /> : null;
    return 'subTabs' in data ? (
      <>
        {divider}
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
        {divider}
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
