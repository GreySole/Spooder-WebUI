import { BoolSwitch, Button, TypeFace, useDialog } from '@greysole/spooder-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import useShare from '../../../../app/hooks/useShare';

interface AutoShareSwitchProps {
  shareKey: string;
}

export default function AutoShareSwitch(props: AutoShareSwitchProps) {
  const { shareKey } = props;
  const { watch, setValue } = useFormContext();
  const { getSetAutoShare } = useShare();
  const { setAutoShare, isLoading } = getSetAutoShare();
  const { openDialog, closeDialog } = useDialog();
  const autoShareEnabled = watch('autoShare', false);

  if (isLoading) {
    return null;
  }

  const autoShareClick = () => {
    openDialog(
      'Enable Auto Share',
      <TypeFace>
        Enabling Auto Share will make your bot start sharing when your client goes live and stop
        when they end stream. Making sharing autonomous. Is that okay?
      </TypeFace>,
      [
        <Button label='Cancel' onClick={() => closeDialog()} />,
        <Button
          label='Enable'
          onClick={() => {
            const newAutoShareEnabled = !autoShareEnabled;
            setAutoShare(shareKey, newAutoShareEnabled).then(() => {
              setValue('autoShare', newAutoShareEnabled);
              closeDialog();
            });
          }}
        />,
      ],
    );
  };

  return (
    <BoolSwitch
      label='Live Auto Share'
      value={autoShareEnabled}
      onChange={() => autoShareClick()}
    />
  );
}
