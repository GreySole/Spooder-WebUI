import { faHome, faComment, faPlug, faTrash, faMicrochip } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { ButtonRow, useTheme } from '@spooder/webui-component-library';

interface ShareCategoryButtonRowProps {
  tab: string;
  setTab: (tab: string) => void;
  removeShareEntry: () => void;
}

export default function ShareCategoryButtonRow(props: ShareCategoryButtonRowProps) {
  const { tab, setTab, removeShareEntry } = props;
  const { themeColors, themeConstants } = useTheme();

  return (
    <ButtonRow
      buttonSize='medium'
      iconSize='large'
      buttons={[
        {
          icon: faHome,
          color: themeColors.backgroundColorNear,
          isActive: tab === 'overview',
          onClick: () => setTab('overview'),
        },
        {
          icon: faComment,
          color: themeColors.backgroundColorNear,
          isActive: tab === 'commands',
          onClick: () => setTab('commands'),
        },
        {
          icon: faPlug,
          color: themeColors.backgroundColorNear,
          isActive: tab === 'plugins',
          onClick: () => setTab('plugins'),
        },
        {
          icon: faMicrochip,
          color: themeColors.backgroundColorNear,
          isActive: tab === 'integration',
          onClick: () => setTab('integration'),
        },
        {
          icon: faTrash,
          color: themeConstants.delete,
          onClick: () => removeShareEntry(),
        },
      ]}
    />
  );
}
