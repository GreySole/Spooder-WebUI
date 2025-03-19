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
    case 'integration':
      tabContent = <ShareIntegrationTab shareKey={shareKey} />;
  }

  return tabContent;
}
