import React from 'react';
import { useFormContext } from 'react-hook-form';
import { buildKey, buildTriggerKey } from '../../FormKeys';
import { Border, FormBoolSwitch, Stack, TypeFace } from '@greysole/spooder-component-library';

interface ChatTriggerConditionProps {
  eventName: string;
}

export default function ChatTriggerCondition(props: ChatTriggerConditionProps) {
  const { eventName } = props;

  const chatTriggerKey = buildTriggerKey(eventName, 'chat');
  const chatTriggerConditionKey = buildKey(chatTriggerKey, 'condition');

  const conditionBroadcasterKey = buildKey(chatTriggerConditionKey, 'broadcaster');
  const conditionModKey = buildKey(chatTriggerConditionKey, 'mod');
  const conditionSubKey = buildKey(chatTriggerConditionKey, 'sub');
  const conditionVipKey = buildKey(chatTriggerConditionKey, 'vip');

  return (
    <Border inactiveColor='var(--color-background-far)' colorOnHover>
      <Stack spacing='small' margin='small'>
        <TypeFace>Permissions</TypeFace>
        <FormBoolSwitch label='Broadcaster Only:' formKey={conditionBroadcasterKey} />
        <FormBoolSwitch label='Mod Only:' formKey={conditionModKey} />
        <FormBoolSwitch label='Subscriber Only:' formKey={conditionSubKey} />
        <FormBoolSwitch label='VIP Only:' formKey={conditionVipKey} />
      </Stack>
    </Border>
  );
}
