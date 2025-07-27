import React from 'react';
import useNavigation from '../../../app/hooks/useNavigation';
import { Button, useTheme } from '@greysole/spooder-component-library';
import { icon, IconProp } from '@fortawesome/fontawesome-svg-core';

interface TabButtonProps {
  tabName: string;
  tabLabel: string;
  icon: IconProp;
  index: number;
  tabFolder?: string;
}

export default function TabButton(props: TabButtonProps) {
  const { tabName, tabFolder, tabLabel, index, icon } = props;
  const { setTab, currentTab, currentFolder, setNavigation, tabOptions, deckTabOptions } =
    useNavigation();
  const { themeVariables } = useTheme();

  const iconMap = { ...tabOptions, ...deckTabOptions };

  console.log(tabName);

  const tabs = Object.keys(iconMap);
  const selectedTabIndex = currentFolder ? tabs.indexOf(currentFolder) : tabs.indexOf(currentTab);
  const distanceFromSelected = selectedTabIndex - index;

  const diffMag = tabs.length / 2;

  const tabHue = themeVariables.hue * 360 - distanceFromSelected * diffMag;
  const tabSaturation = themeVariables.saturation * 100;
  const tabLightness = themeVariables.isDarkTheme ? 80 : 20;

  const iconAndTextColor = `hsl(${tabHue % 360}deg, ${tabSaturation}%, ${tabLightness}%)`;

  return (
    <Button
      className={'tab-button minimal' + (currentTab == tabName ? ' selected' : '')}
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
        setTab(tabName, tabFolder);
        setNavigation(false);
      }}
      label={tabLabel}
      icon={icon}
    />
  );
}
