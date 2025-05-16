import React from 'react';
import ShareDiscordForm from '../input/ShareDiscordForm';

interface ShareDiscordTabProps {
  shareKey: string;
}

export default function ShareDiscordTab({ shareKey }: ShareDiscordTabProps) {
  return <ShareDiscordForm shareKey={shareKey} />;
}
