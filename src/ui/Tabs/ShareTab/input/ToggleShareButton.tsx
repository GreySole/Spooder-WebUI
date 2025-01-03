import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import useShare from '../../../../app/hooks/useShare';
import { Box, Button } from '@greysole/spooder-component-library';
import React from 'react';

interface ToggleShareButtonProps {
  shareKey: string;
}

export default function ToggleShareButton(props: ToggleShareButtonProps) {
  const { shareKey } = props;
  const { getActiveShares, getSetShare } = useShare();
  const { data: activeShares, isLoading, error } = getActiveShares();
  const { setShare } = getSetShare();

  if (isLoading) {
    return null;
  }

  const isActive = activeShares.some((share: string) => share.replaceAll('#', '') === shareKey);

  return (
    <Box padding='small'>
      {!isActive ? (
        <Button
          label='Start'
          icon={faPlay}
          iconSize='lg'
          onClick={() => setShare(shareKey, true, '')}
        />
      ) : (
        <Button
          label='Stop'
          icon={faStop}
          iconSize='lg'
          onClick={() => setShare(shareKey, false, '')}
        />
      )}
    </Box>
  );
}
