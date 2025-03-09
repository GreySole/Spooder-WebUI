import React from 'react';
import { useFormContext } from 'react-hook-form';
import { buildKey, buildTriggerKey } from '../../FormKeys';
import {
  Border,
  Box,
  Expandable,
  FormBoolSwitch,
  Stack,
  TypeFace,
} from '@greysole/spooder-component-library';

interface ChatTriggerConditionProps {
  eventName: string;
}

export default function ChatTriggerCondition(props: ChatTriggerConditionProps) {
  const { eventName } = props;

  const chatTriggerKey = buildTriggerKey(eventName, 'chat');
  const chatTriggerConditionKey = buildKey(chatTriggerKey, 'condition');

  const broadcasterKey = buildKey(chatTriggerConditionKey, 'broadcaster');
  const modKey = buildKey(chatTriggerConditionKey, 'mod');
  const subKey = buildKey(chatTriggerConditionKey, 'sub');
  const vipKey = buildKey(chatTriggerConditionKey, 'vip');

  return (
    <Box width='100%'>
      <Border inactiveColor='var(--color-background-far)' colorOnHover>
        <Expandable label='Permissions'>
          <FormBoolSwitch label='Broadcaster' formKey={broadcasterKey} />
          <FormBoolSwitch label='Moderator' formKey={modKey} />
          <FormBoolSwitch label='Subscriber' formKey={subKey} />
          <FormBoolSwitch label='VIP' formKey={vipKey} />
        </Expandable>
      </Border>
    </Box>
  );
}
