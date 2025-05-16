import React from 'react';
import { useSaveOSCTunnelsMutation } from '../../../app/api/configSlice';
import { SaveButton } from '@greysole/spooder-component-library';

export default function SaveTunnelFormButton() {
  const [saveOSCTunnels] = useSaveOSCTunnelsMutation();
  return <SaveButton saveFunction={saveOSCTunnels} />;
}
