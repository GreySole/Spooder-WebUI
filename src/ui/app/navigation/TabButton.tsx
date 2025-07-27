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
  faTv,
  faGamepad,
  faHammer,
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
    dashboard: faDashboard,
    commands: faClapperboard,
    plugins: faPlug,
    osctunnels: faArrowsSplitUpAndLeft,
    module: faPuzzlePiece,
    users: faPerson,
    sharing: faShareNodes,
    theme: faPaintRoller,
    config: faGears,
    obs: faGamepad,
    osc: faTv,
    mod: faHammer,
  };

  console.log(tabName);

  const tabs = Object.keys(iconMap);
  const selectedTabIndex = tabs.indexOf(currentTab);
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
        setTab(tabName);
        setNavigation(false);
      }}
      label={tabLabel}
      icon={iconMap[tabName]}
    />
  );
}
