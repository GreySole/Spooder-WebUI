import { useFormContext } from 'react-hook-form';
import useTwitch from '../../../../app/hooks/useTwitch';
import BoolSwitch from '../../common/input/controlled/BoolSwitch';
import React from 'react';

interface AutoShareSwitchProps {
  shareKey: string;
}

export default function AutoShareSwitch(props: AutoShareSwitchProps) {
  const { shareKey } = props;
  const { watch } = useFormContext();
  const share = watch(shareKey);
  const { getEventsubsByUser, getDeleteEventsub, getInitEventsub } = useTwitch();
  const { data, isLoading, error } = getEventsubsByUser(share.twitch.id);
  const { deleteEventsub } = getDeleteEventsub();
  const { initEventsub } = getInitEventsub();

  if (isLoading) {
    return null;
  }

  const autoShareEnabled = data['stream.online'] !== undefined;

  const setAutoShare = () => {
    if (autoShareEnabled) {
      deleteEventsub(data['stream.online'].id);
      deleteEventsub(data['stream.offline'].id);
    } else {
      initEventsub('stream.online', share.twitch.id);
      initEventsub('stream.offline', share.twitch.id);
    }
  };

  return (
    <div className='share-discord-label'>
      Live Auto Share: <BoolSwitch value={autoShareEnabled} onChange={() => setAutoShare()} />
    </div>
  );
}
