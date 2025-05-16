import React from 'react';
import ShareEntryCommandSettings from '../input/ShareEntryCommandSettings';

interface ShareCommandTabProps {
  shareKey: string;
}

export default function ShareCommandTab({ shareKey }: ShareCommandTabProps) {
  return <ShareEntryCommandSettings shareKey={shareKey} />;
}
