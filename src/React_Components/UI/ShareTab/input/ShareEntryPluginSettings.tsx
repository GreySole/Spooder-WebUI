import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import useEvents from '../../../../app/hooks/useEvents';
import LoadingCircle from '../../LoadingCircle';
import CommandToggleGrid from './CommandToggleGrid';
import useShare from '../../../../app/hooks/useShare';
import Button from '../../common/input/controlled/Button';
import SaveButton from '../../common/input/form/SaveButton';
import usePlugins from '../../../../app/hooks/usePlugins';
import PluginToggleGrid from './PluginToggleGrid';
import React from 'react';

interface ShareEntrySettingsProps {
  shareKey: string;
}

export default function ShareEntryPluginSettings(props: ShareEntrySettingsProps) {
  const { shareKey } = props;
  const { getPlugins } = usePlugins();
  const { data: plugins, isLoading, error } = getPlugins();
  const { getSaveShares } = useShare();
  const { saveShares } = getSaveShares();
  const { watch, getValues } = useFormContext();
  const share = watch(shareKey);
  const [openSettings, setOpenSettings] = useState(false);

  if (isLoading) {
    return <LoadingCircle />;
  }

  const saveAndCloseShare = () => {
    saveShares(getValues());
    setOpenSettings(false);
  };

  let shareContent = null;
  if (openSettings) {
    shareContent = (
      <div className={'share-entry-content-plugins'}>
        <PluginToggleGrid formKey={shareKey} />
        <SaveButton saveFunction={saveAndCloseShare} />
      </div>
    );
  } else {
    shareContent = (
      <div className='share-entry-commands'>
        <div className='share-entry-label'>
          Plugins <Button label='Set' onClick={() => setOpenSettings(true)} />
        </div>
        {share.plugins.join(', ')}
      </div>
    );
  }

  return shareContent;
}
