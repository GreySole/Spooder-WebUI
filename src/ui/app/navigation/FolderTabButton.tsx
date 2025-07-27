import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useTheme, Button, Box } from '@greysole/spooder-component-library';
import React, { useEffect, useState } from 'react';
import useNavigation from '../../../app/hooks/useNavigation';
import TabButton from './TabButton';
import { current } from '@reduxjs/toolkit';

export default function FolderTabButton(props: {
  tabName: string;
  tabLabel: string;
  index: number;
  icon: IconProp;
  subTabs: Record<string, { label: string; icon: IconProp }>;
}) {
  const { tabName, tabLabel, index, icon, subTabs } = props;
  const { currentTab, currentFolder, tabOptions, deckTabOptions } = useNavigation();
  const { themeVariables } = useTheme();
  const [showSubTabs, setShowSubTabs] = useState(false);

  console.log('FolderTabButton', tabName, currentTab, currentFolder);

  useEffect(() => {
    if (!Object.keys(subTabs).includes(currentTab)) {
      setShowSubTabs(false);
    }
  }, [currentTab]);

  const iconMap = { ...tabOptions, ...deckTabOptions };

  const tabs = Object.keys(iconMap);
  const selectedTabIndex = currentFolder ? tabs.indexOf(currentFolder) : tabs.indexOf(currentTab);
  const distanceFromSelected = selectedTabIndex - index;
  console.log(selectedTabIndex, index, distanceFromSelected);

  const diffMag = tabs.length / 2;

  const tabHue = themeVariables.hue * 360 - distanceFromSelected * diffMag;
  const tabSaturation = themeVariables.saturation * 100;
  const tabLightness = themeVariables.isDarkTheme ? 80 : 20;

  const iconAndTextColor = `hsl(${tabHue % 360}deg, ${tabSaturation}%, ${tabLightness}%)`;

  return (
    <Box className={`folder-tab-button` + (showSubTabs ? ' expanded' : '')} flexFlow='column'>
      <Button
        className={'tab-button minimal' + (currentTab === tabName ? ' selected' : '')}
        style={{
          flexDirection: 'row-reverse',
          justifyContent: 'start',
          padding: '.5rem',
          color: iconAndTextColor,
          fontWeight: '500',
          margin: '1px 0',
        }}
        iconColor={iconAndTextColor}
        iconGap='smedium'
        onClick={() => {
          setShowSubTabs(!showSubTabs);
        }}
        label={tabLabel}
        icon={icon}
      />
      {showSubTabs ? (
        <Box flexFlow='column' padding='small' spacing='none'>
          {Object.entries(subTabs).map(([subKey, subTab], subIndex) => (
            <TabButton
              key={`sub-tab-button-${subTab.label}`}
              tabName={subKey}
              tabFolder={tabName}
              tabLabel={subTab.label}
              index={subIndex}
              icon={subTab.icon}
            />
          ))}
        </Box>
      ) : null}
    </Box>
  );
}
