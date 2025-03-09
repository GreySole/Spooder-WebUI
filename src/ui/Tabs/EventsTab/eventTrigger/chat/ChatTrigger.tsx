import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { buildKey, buildTriggerKey } from '../../FormKeys';
import ChatTriggerCondition from './ChatTriggerCondition';
import {
  Button,
  Columns,
  FormBoolSwitch,
  FormTextInput,
  Stack,
} from '@greysole/spooder-component-library';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import ResponseSearchAndMatchCheatSheet from '../../eventCommand/response/ResponseSearchAndMatchCheatSheet';

interface ChatTriggerProps {
  eventName: string;
}

export default function ChatTrigger(props: ChatTriggerProps) {
  const { eventName } = props;
  const { watch } = useFormContext();
  const [searchAndMatchCheatSheetOpen, setSearchAndMatchCheatSheetOpen] = useState(false);

  const chatTriggerKey = buildTriggerKey(eventName, 'chat');
  const enabledKey = buildKey(chatTriggerKey, 'enabled');
  const enabled = watch(enabledKey, false);

  const searchKey = buildKey(chatTriggerKey, 'search');
  const commandKey = buildKey(chatTriggerKey, 'command');

  if (!enabled) {
    return (
      <Stack spacing='small'>
        <FormBoolSwitch label='Chat:' formKey={enabledKey} />
      </Stack>
    );
  }

  return (
    <Stack spacing='small'>
      <FormBoolSwitch label='Chat:' formKey={enabledKey} />
      <Stack spacing='small' margin='small'>
        <ChatTriggerCondition eventName={eventName} />
        <Columns spacing='medium'>
          <FormBoolSwitch label='Search and Match' formKey={searchKey} />
          <Button
            icon={faQuestionCircle}
            iconSize='large'
            onClick={() => {
              setSearchAndMatchCheatSheetOpen(!searchAndMatchCheatSheetOpen);
            }}
          />
        </Columns>
        <ResponseSearchAndMatchCheatSheet isOpen={searchAndMatchCheatSheetOpen} />
        <FormTextInput label='Command:' formKey={commandKey} />
      </Stack>
    </Stack>
  );
}
