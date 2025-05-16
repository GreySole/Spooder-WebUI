import React from 'react';
import useTwitch from '../../../../../app/hooks/useTwitch';
import { buildKey, buildTriggerKey } from '../../FormKeys';
import { EventTriggerProps } from '../../../../Types';
import {
  Box,
  FormBoolSwitch,
  FormLoader,
  FormSelectDropdown,
  Stack,
  useTheme,
} from '@greysole/spooder-component-library';

interface ChannelPointReward {
  id: string;
  title: string;
  override: boolean;
}

export default function TwitchTriggerTypeReward(props: EventTriggerProps) {
  const { eventName } = props;
  const { getChannelPointRewards } = useTwitch();
  const { isMobileDevice } = useTheme();
  const {
    data: channelPointRewards,
    isLoading: channelPointRewardsLoading,
    error: channelPointRewardsError,
  } = getChannelPointRewards();

  const twitchTriggerKey = buildTriggerKey(eventName, 'twitch');
  const rewardKey = buildKey(twitchTriggerKey, 'reward');
  const idKey = buildKey(rewardKey, 'id');
  const overrideKey = buildKey(rewardKey, 'override');

  if (channelPointRewardsLoading && !channelPointRewardsError) {
    return <FormLoader />;
  }

  const rewardOptions = channelPointRewardsError
    ? []
    : channelPointRewards.map((reward: ChannelPointReward) => ({
        value: reward.id,
        label: reward.title,
      }));

  return (
    <Box width='100%' flexFlow='column'>
      <Stack spacing='small'>
        <FormSelectDropdown
          width={isMobileDevice ? '100%' : undefined}
          label='Reward:'
          formKey={idKey}
          options={rewardOptions}
        />
        <FormBoolSwitch label='Override Approval (Refundable):' formKey={overrideKey} />
      </Stack>
    </Box>
  );
}
