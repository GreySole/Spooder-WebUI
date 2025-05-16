import React from 'react';
import { useFormContext } from 'react-hook-form';
import ManualHandle from './ManualHandle';
import MotherwolfHandle from './MotherwolfHandle';
import NgrokHandle from './NgrokHandle';

export default function HostingHandle() {
  const { watch } = useFormContext();
  const externalHandle = watch('network.externalhandle');

  if (externalHandle === 'disabled') {
    return null;
  } else if (externalHandle === 'ngrok') {
    return <NgrokHandle />;
  } else if (externalHandle === 'motherwolf') {
    return <MotherwolfHandle />;
  } else if (externalHandle === 'manual') {
    return <ManualHandle />;
  } else {
    return null;
  }
}
