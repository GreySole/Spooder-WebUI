import { useFormContext } from 'react-hook-form';
import useOBS from '../../../../app/hooks/useOBS';
import Button from '../../../common/input/controlled/Button';
import React from 'react';

export default function ObsConnectButton() {
  const { getValues } = useFormContext();
  const { getConnectObs, getObsStatus } = useOBS();
  const { connectObs } = getConnectObs();
  const { refetch } = getObsStatus();

  const connectObsClick = async () => {
    const values = getValues();
    console.log('CONNECT OBS');
    await connectObs(values.url, values.port, values.password, values.remember);
    refetch();
  };

  return <Button label='Connect' onClick={() => connectObsClick()} />;
}
