import React from 'react';
import useShare from '../../../../app/hooks/useShare';
import SaveButton from '../../../Common/input/form/SaveButton';

export default function ShareSaveButton() {
  const { getSaveShares } = useShare();
  const { saveShares } = getSaveShares();
  return <SaveButton saveFunction={saveShares} />;
}
