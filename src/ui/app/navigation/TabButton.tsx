import React from 'react';
import useNavigation from '../../../app/hooks/useNavigation';
import { Button, useTheme } from '@greysole/spooder-component-library';
import { icon, IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faDashboard,
  faGears,
  faClapperboard,
  faPlug,
  faArrowsSplitUpAndLeft,
  faPuzzlePiece,
  faPerson,
  faPaintRoller,
  faShareNodes,
} from '@fortawesome/free-solid-svg-icons';

interface TabButtonProps {
  tabName: string;
  tabLabel: string;
  index: number;
}

export default function TabButton(props: TabButtonProps) {
  const { tabName, tabLabel, index } = props;
  const { setTab, currentTab, setNavigation } = useNavigation();
  const { themeVariables } = useTheme();

  const iconMap: Record<string, IconProp> = {
    'dashboard': faDashboard,
    'commands': faClapperboard,
    'plugins': faPlug,
    'osctunnels': faArrowsSplitUpAndLeft,
    'module': faPuzzlePiece,
    'users': faPerson,
    'sharing': faShareNodes,
    'theme': faPaintRoller,
    'config': faGears,
  };


  const tabs = Object.keys(iconMap);
  const selectedTabIndex = tabs.indexOf(currentTab);
  const distanceFromSelected = selectedTabIndex - index;

  const diffMag = tabs.length / 2;

  const tabHue = (themeVariables.hue * 360) - (distanceFromSelected * diffMag);
  const tabSaturation = themeVariables.saturation * 100;
  const tabLightness = 50 + Math.abs(distanceFromSelected * diffMag);
  const tabAlpha = 100 - (Math.abs(distanceFromSelected) * diffMag);

  const iconAndTextColor = `hsla(${tabHue % 360}deg, ${tabSaturation}%, ${tabLightness}%, ${tabAlpha}% )`;

  console.log(`${tabName} ${iconAndTextColor}`);

  return (
    <Button
      className={'tab-button minimal' + (currentTab == tabName ? ' selected' : '')}
      style={{ flexDirection: 'row-reverse', justifyContent: 'start', padding: '.625rem', color: iconAndTextColor }}
      iconColor={iconAndTextColor}
      iconGap='smedium'
      onClick={() => {
        setTab(tabName);
        setNavigation(false);
      }}
      label={tabLabel}
      icon={iconMap[tabName]}
    />
  );
}
