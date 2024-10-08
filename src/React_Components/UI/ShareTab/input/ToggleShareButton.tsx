import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useShare from '../../../../app/hooks/useShare';
import Button from '../../common/input/controlled/Button';
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
    <>
      {!isActive ? (
        <Button label='' icon={faPlay} onClick={() => setShare(shareKey, true, '')} />
      ) : (
        <Button label='' icon={faStop} onClick={() => setShare(shareKey, false, '')} />
      )}
    </>
  );
}
