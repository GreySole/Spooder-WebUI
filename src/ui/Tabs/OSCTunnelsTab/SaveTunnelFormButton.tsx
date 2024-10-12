import React from 'react';
import SaveButton from '../../Common/input/form/SaveButton';
import { useSaveOSCTunnelsMutation } from '../../../app/api/configSlice';

export default function SaveTunnelFormButton() {
  const [saveOSCTunnels] = useSaveOSCTunnelsMutation();
  return <SaveButton saveFunction={saveOSCTunnels} />;
}
