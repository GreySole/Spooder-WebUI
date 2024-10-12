import React from 'react';
import { useFormContext } from 'react-hook-form';
import useTwitch from '../../../../../app/hooks/useTwitch';
import FormBoolSwitch from '../../../../Common/input/form/FormBoolSwitch';
import { buildKey, buildTriggerKey } from '../../FormKeys';
import { EventTriggerProps } from '../../../../Types';

interface ChannelPointReward {
  id: string;
  title: string;
  override: boolean;
}

export default function TwitchTriggerTypeReward(props: EventTriggerProps) {
  const { eventName } = props;
  const { watch, register } = useFormContext();
  const { getChannelPointRewards } = useTwitch();
  const {
    data: channelPointRewards,
    isLoading: channelPointRewardsLoading,
    error: channelPointRewardsError,
  } = getChannelPointRewards();

  const twitchTriggerKey = buildTriggerKey(eventName, 'twitch');

  const rewardKey = buildKey(twitchTriggerKey, 'reward');

  const idKey = buildKey(rewardKey, 'id');
  const id = watch(idKey, '');

  const overrideKey = buildKey(rewardKey, 'override');
  const override = watch(overrideKey, false);

  if (channelPointRewardsLoading && !channelPointRewardsError) {
    return null;
  }

  const rewardOptions = channelPointRewardsError
    ? []
    : channelPointRewards.map((reward: ChannelPointReward) => (
        <option value={reward.id}>{reward.title}</option>
      ));

  return (
    <label className='event-trigger'>
      <label>
        Reward:
        <select value={id} {...register(idKey)}>
          {rewardOptions}
        </select>
      </label>
      <FormBoolSwitch label='Override Approval (Refundable):' formKey={overrideKey} />
    </label>
  );
}
