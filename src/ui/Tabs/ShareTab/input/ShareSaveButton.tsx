import React from 'react';
import useShare from '../../../../app/hooks/useShare';
import { SaveButton } from '@greysole/spooder-component-library';

export default function ShareSaveButton() {
  const { getSaveShares } = useShare();
  const { saveShares } = getSaveShares();
  return <SaveButton saveFunction={saveShares} />;
}
