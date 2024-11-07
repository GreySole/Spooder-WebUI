import React from 'react';
import FormBoolSwitch from '../../../../common/input/form/FormBoolSwitch';
import { useFormContext } from 'react-hook-form';
import { buildKey, buildTriggerKey } from '../../FormKeys';
import TwitchTriggerType from './TwitchTriggerType';
import TwitchTriggerTypeReward from './TwitchTriggerTypeReward';

interface TwitchTriggerProps {
  eventName: string;
}

export default function TwitchTrigger(props: TwitchTriggerProps) {
  const { eventName } = props;
  const { watch } = useFormContext();

  const twitchTriggerKey = buildTriggerKey(eventName, 'twitch');

  const enabledKey = buildKey(twitchTriggerKey, 'enabled');
  const enabled = watch(enabledKey, false);

  const typeKey = buildKey(twitchTriggerKey, 'type');
  const type = watch(typeKey, '');

  if (!enabled) {
    return (
      <div className='trigger twitch'>
        <FormBoolSwitch label='Twitch:' formKey={enabledKey} />
      </div>
    );
  }

  return (
    <div className='trigger twitch'>
      <FormBoolSwitch label='Twitch:' formKey={enabledKey} />
      <TwitchTriggerType eventName={eventName} />
      {type === 'redeem' ? <TwitchTriggerTypeReward eventName={eventName} /> : null}
    </div>
  );
}
