import React from 'react';
import { useFormContext } from 'react-hook-form';
import useTwitch from '../../../../../app/hooks/useTwitch';
import { EventTriggerProps } from '../../../../Types';
import { buildTriggerKey, buildKey } from '../../FormKeys';
import { FormSelectDropdown } from '@greysole/spooder-component-library';

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

  let eventsubOptions = [
    { value: '""', label: 'Select Type' },
    { value: 'redeem', label: 'Channel Point Redeem' },
  ];
  for (let e in eventsubTypes) {
    eventsubOptions.push({ value: e, label: eventsubTypes[e] });
  }

  return <FormSelectDropdown label='Type:' formKey={typeKey} options={eventsubOptions} />;
}
