import { useFormContext } from 'react-hook-form';
import useTwitch from '../../../../app/hooks/useTwitch';
import React from 'react';
import { BoolSwitch } from '@greysole/spooder-component-library';

interface AutoShareSwitchProps {
  shareKey: string;
}

export default function AutoShareSwitch(props: AutoShareSwitchProps) {
  const { shareKey } = props;
  const { watch } = useFormContext();
  const share = watch(shareKey);
  const { getEventSubsByUser, getDeleteEventSub, getInitEventSub } = useTwitch();
  const { data, isLoading, error, refetch } = getEventSubsByUser(
    share.streamPlatforms.twitch.userId,
  );
  const { deleteEventSub } = getDeleteEventSub();
  const { initEventSub } = getInitEventSub();

  if (isLoading) {
    return null;
  }

  const autoShareEnabled = data.data.filter((sub: any) => sub.type === 'stream.online').length > 0;
  console.log('autoShareEnabled', autoShareEnabled, data);

  const setAutoShare = async () => {
    if (autoShareEnabled) {
      data.data.forEach(async (sub: any) => {
        if (sub.type === 'stream.online' || sub.type === 'stream.offline') {
          await deleteEventSub(sub.id);
        }
      });
    } else {
      await initEventSub('stream.online', share.streamPlatforms.twitch.userId);
      await initEventSub('stream.offline', share.streamPlatforms.twitch.userId);
    }

    refetch();
  };

  return (
    <BoolSwitch label='Live Auto Share' value={autoShareEnabled} onChange={() => setAutoShare()} />
  );
}
