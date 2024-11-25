import { useFormContext } from 'react-hook-form';
import useTwitch from '../../../../app/hooks/useTwitch';
import BoolSwitch from '../../../common/input/controlled/BoolSwitch';
import React from 'react';

interface AutoShareSwitchProps {
  shareKey: string;
}

export default function AutoShareSwitch(props: AutoShareSwitchProps) {
  const { shareKey } = props;
  const { watch } = useFormContext();
  const share = watch(shareKey);
  const { getEventSubsByUser, getDeleteEventSub, getInitEventSub } = useTwitch();
  const { data, isLoading, error } = getEventSubsByUser(share.streamPlatforms.twitch.userId);
  const { deleteEventSub } = getDeleteEventSub();
  const { initEventSub } = getInitEventSub();

  if (isLoading) {
    return null;
  }

  const autoShareEnabled = data['stream.online'] !== undefined;

  const setAutoShare = () => {
    if (autoShareEnabled) {
      deleteEventSub(data['stream.online'].id);
      deleteEventSub(data['stream.offline'].id);
    } else {
      initEventSub('stream.online', share.streamPlatforms.twitch.userId);
      initEventSub('stream.offline', share.streamPlatforms.twitch.userId);
    }
  };

  return (
    <div className='share-discord-label'>
      Live Auto Share: <BoolSwitch value={autoShareEnabled} onChange={() => setAutoShare()} />
    </div>
  );
}
