import React from 'react';
import ShareOverviewTab from './ShareOverviewTab';
import ShareCommandTab from './ShareCommandTab';
import ShareDiscordTab from './ShareDiscordTab';
import SharePluginTab from './SharePluginTab';
import ShareTwitchTab from './ShareTwitchTab';

interface ShareTabContentProps {
  shareKey: string;
  tab: string;
}

export default function ShareTabContent({ shareKey, tab }: ShareTabContentProps) {
  console.log('ShareTabContent', tab);
  let tabContent = null;
  switch (tab) {
    case 'overview':
      tabContent = <ShareOverviewTab shareKey={shareKey} />;
      break;
    case 'commands':
      tabContent = <ShareCommandTab shareKey={shareKey} />;
      break;
    case 'plugins':
      tabContent = <SharePluginTab shareKey={shareKey} />;
      break;
    case 'twitch':
      tabContent = <ShareTwitchTab shareKey={shareKey} />;
      break;
    case 'discord':
      tabContent = <ShareDiscordTab shareKey={shareKey} />;
      break;
  }

  return tabContent;
}
