import React from 'react';
import { useFormContext } from 'react-hook-form';
import useTwitch from '../../../../../app/hooks/useTwitch';
import { EventTriggerProps } from '../../../../Types';
import { buildTriggerKey, buildKey } from '../../FormKeys';

export default function TwitchTriggerType(props: EventTriggerProps) {
  const { eventName } = props;
  const { watch, register } = useFormContext();
  const { getAvailableEventSubs } = useTwitch();

  const twitchTriggerKey = buildTriggerKey(eventName, 'twitch');
  const typeKey = buildKey(twitchTriggerKey, 'type');
  const type = watch(typeKey, '');

  const {
    data: eventsubTypes,
    isLoading: eventsubTypesLoading,
    error: eventsubTypesError,
  } = getAvailableEventSubs();

  if (eventsubTypesLoading && !eventsubTypesError) {
    return null;
  }

  let eventsubOptions = [];
  for (let e in eventsubTypes) {
    eventsubOptions.push(<option value={e}>{eventsubTypes[e]}</option>);
  }

  return (
    <label className='label-switch'>
      Type:
      <select key={'eventsubs-' + eventsubTypes.length} value={type} {...register(typeKey)}>
        <option value=''>Select Type</option>
        <option value='redeem'>Channel Point Redeem</option>
        {eventsubOptions}
      </select>
    </label>
  );
}
