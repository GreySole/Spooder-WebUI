import React from 'react';
import useNavigation from '../../../app/hooks/useNavigation';
import { Button, useTheme } from '@spooder/webui-component-library';
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
  const {
    setTab,
    currentTab,
    currentFolder,
    setNavigation,
    tabOptions,
    deckTabOptions,
    navRailHovered,
  } = useNavigation();
  const { themeVariables, isMobileDevice } = useTheme();
  // Collapsed to icon-only on the desktop rail unless the mouse is over it (see Header.tsx) -
  // mobile's slide-out always shows the full label since there's no hover state there.
  const showLabel = isMobileDevice || navRailHovered;

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
        // Pinned rather than left to content: a bare icon and an icon-plus-label row would
        // otherwise size differently, since a text line's line-height renders taller than the
        // icon's flat pixel size - the collapsed and hover-expanded rail would visibly jump in
        // row height. lineHeight tightens the label to match rather than overflowing this.
        height: '2rem',
        lineHeight: 1,
        color: iconAndTextColor,
        fontWeight: '500',
        margin: '1px 0',
        wordBreak: 'keep-all',
        whiteSpace: 'nowrap',
      }}
      iconColor={iconAndTextColor}
      iconGap='smedium'
      onClick={() => {
        setTab(tabName, tabFolder);
        setNavigation(false);
      }}
      label={showLabel ? tabLabel : undefined}
      tooltipText={showLabel ? undefined : tabLabel}
      icon={icon}
    />
  );
}
