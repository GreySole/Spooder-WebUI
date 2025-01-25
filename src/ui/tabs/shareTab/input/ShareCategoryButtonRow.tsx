import { faHome, faComment, faPlug, faTrash } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { StyleSize } from '../../../Types';
import { ButtonRow, DiscordIcon, TwitchIcon, useTheme } from '@greysole/spooder-component-library';

interface ShareCategoryButtonRowProps {
  tab: string;
  setTab: (tab: string) => void;
  removeShareEntry: () => void;
}

export default function ShareCategoryButtonRow(props: ShareCategoryButtonRowProps) {
  const { tab, setTab, removeShareEntry } = props;
  const { themeColors, themeConstants } = useTheme();

  const iconSize = StyleSize.large;
  console.log(DiscordIcon, TwitchIcon);

  return (
    <ButtonRow
      buttons={[
        {
          icon: faHome,
          iconSize: iconSize,
          color: themeColors.backgroundColorNear,
          isActive: tab === 'overview',
          onClick: () => setTab('overview'),
        },
        {
          icon: faComment,
          iconSize: iconSize,
          color: themeColors.backgroundColorNear,
          isActive: tab === 'commands',
          onClick: () => setTab('commands'),
        },
        {
          icon: faPlug,
          iconSize: iconSize,
          color: themeColors.backgroundColorNear,
          isActive: tab === 'plugins',
          onClick: () => setTab('plugins'),
        },
        {
          icon: <TwitchIcon />,
          iconSize: iconSize,
          color: themeColors.backgroundColorNear,
          isActive: tab === 'twitch',
          onClick: () => setTab('twitch'),
        },
        {
          icon: <DiscordIcon />,
          iconSize: iconSize,
          color: themeColors.backgroundColorNear,
          isActive: tab === 'discord',
          onClick: () => setTab('discord'),
        },
        {
          icon: faTrash,
          iconSize: iconSize,
          color: themeConstants.delete,
          onClick: () => removeShareEntry(),
        },
      ]}
    />
  );
}
