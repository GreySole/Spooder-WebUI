import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import useShare from '../../../../app/hooks/useShare';
import { Box, Button } from '@greysole/spooder-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface ToggleShareButtonProps {
  shareKey: string;
}

export default function ToggleShareButton(props: ToggleShareButtonProps) {
  const { shareKey } = props;
  const { getActiveShares, getSetShare } = useShare();
  const { data: activeShares, isLoading, refetch } = getActiveShares();
  const { setShare } = getSetShare();
  const { getValues } = useFormContext();

  if (isLoading) {
    return null;
  }

  const isActive = Object.keys(activeShares).includes(shareKey);

  const getJoinMessage = () => {
    return getValues(`${shareKey}.joinMessage`);
  };

  const getLeaveMessage = () => {
    return getValues(`${shareKey}.leaveMessage`);
  };

  const startShare = async () => {
    await setShare(shareKey, true, getJoinMessage(), getLeaveMessage());
    refetch();
  };

  const stopShare = async () => {
    await setShare(shareKey, false, getJoinMessage(), getLeaveMessage());
    refetch();
  };

  return (
    <Box padding='small'>
      {!isActive ? (
        <Button label='Start' icon={faPlay} iconSize='lg' onClick={() => startShare()} />
      ) : (
        <Button label='Stop' icon={faStop} iconSize='lg' onClick={() => stopShare()} />
      )}
    </Box>
  );
}
