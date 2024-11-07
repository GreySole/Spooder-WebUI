import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import CommandToggleGrid from './CommandToggleGrid';
import useShare from '../../../../app/hooks/useShare';
import Button from '../../../common/input/controlled/Button';
import SaveButton from '../../../common/input/form/SaveButton';
import React from 'react';

interface ShareEntrySettingsProps {
  shareKey: string;
}

export default function ShareEntryCommandSettings(props: ShareEntrySettingsProps) {
  const { shareKey } = props;
  const { getSaveShares } = useShare();
  const { saveShares } = getSaveShares();
  const { watch, getValues } = useFormContext();
  const share = watch(shareKey);
  const [openSettings, setOpenSettings] = useState(false);

  const saveAndCloseShare = () => {
    saveShares(getValues());
    setOpenSettings(false);
  };

  let shareContent = null;
  if (openSettings) {
    shareContent = (
      <div className={'share-entry-content-commands'}>
        <CommandToggleGrid formKey={shareKey} />
        <SaveButton saveFunction={saveAndCloseShare} />
      </div>
    );
  } else {
    shareContent = (
      <div className='share-entry-commands'>
        <div className='share-entry-label'>
          Commands <Button label='Set' onClick={() => setOpenSettings(true)} />
        </div>
        {share.commands.join(', ')}
      </div>
    );
  }

  return shareContent;
}