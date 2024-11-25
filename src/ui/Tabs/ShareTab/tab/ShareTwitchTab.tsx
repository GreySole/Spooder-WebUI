import React from 'react';
import AutoShareSwitch from '../input/AutoShareSwitch';

interface ShareTwitchTabProps {
  shareKey: string;
}

export default function ShareTwitchTab({ shareKey }: ShareTwitchTabProps) {
  return <AutoShareSwitch shareKey={shareKey} />;
}
