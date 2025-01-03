import React from 'react';
import { useFormContext } from 'react-hook-form';
import { buildKey, buildTriggerKey } from '../../FormKeys';
import ChatTriggerCondition from './ChatTriggerCondition';
import { FormBoolSwitch, FormTextInput } from '@greysole/spooder-component-library';

interface ChatTriggerProps {
  eventName: string;
}

export default function ChatTrigger(props: ChatTriggerProps) {
  const { eventName } = props;
  const { watch } = useFormContext();

  const chatTriggerKey = buildTriggerKey(eventName, 'chat');
  const enabledKey = buildKey(chatTriggerKey, 'enabled');
  const enabled = watch(enabledKey, false);

  const searchKey = buildKey(chatTriggerKey, 'search');
  const commandKey = buildKey(chatTriggerKey, 'command');

  if (!enabled) {
    return (
      <div className='chat-trigger'>
        <FormBoolSwitch label='Chat:' formKey={enabledKey} />
      </div>
    );
  }

  return (
    <div className='chat-trigger'>
      <FormBoolSwitch label='Chat:' formKey={enabledKey} />
      <ChatTriggerCondition eventName={eventName} />
      <FormBoolSwitch label='Search and Match in Message:' formKey={searchKey} />
      <FormTextInput label='Command:' formKey={commandKey} />
    </div>
  );
}
