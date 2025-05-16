import React from 'react';
import ShareEntryPluginSettings from '../input/ShareEntryPluginSettings';

interface SharePluginTabProps {
  shareKey: string;
}

export default function SharePluginTab({ shareKey }: SharePluginTabProps) {
  return <ShareEntryPluginSettings shareKey={shareKey} />;
}
