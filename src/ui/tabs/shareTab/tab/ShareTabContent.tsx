import React from 'react';
import ShareOverviewTab from './ShareOverviewTab';
import ShareCommandTab from './ShareCommandTab';
import SharePluginTab from './SharePluginTab';
import ShareIntegrationTab from './ShareIntegrationTab';

interface ShareTabContentProps {
  shareKey: string;
  tab: string;
}

export default function ShareTabContent({ shareKey, tab }: ShareTabContentProps) {
  let tabContent = null;
  switch (tab) {
    case 'overview':
      tabContent = <ShareOverviewTab />;
      break;
    case 'commands':
      tabContent = <ShareCommandTab />;
      break;
    case 'plugins':
      tabContent = <SharePluginTab />;
      break;
    case 'integration':
      tabContent = <ShareIntegrationTab shareKey={shareKey} />;
  }

  return tabContent;
}
