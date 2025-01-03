import React from 'react';
import { useFormContext } from 'react-hook-form';
import { buildCommandKey, buildKey, buildTriggerKey } from '../../FormKeys';
import useEvents from '../../../../../app/hooks/useEvents';
import { useState } from 'react';
import { EventCommandProps } from '../../../../Types';
import { HotkeysProvider } from '../../../../../app/hooks/useHotkeys';
import {
  FormCodeInput,
  TextInput,
  Button,
  FormNumberInput,
} from '@greysole/spooder-component-library';
import ResponseCommandCheatSheet from './ResponseCommandCheatSheet';

export default function EventResponseCommand(props: EventCommandProps) {
  const { eventName, commandIndex } = props;
  const { watch, register } = useFormContext();
  const { verifyResponseScript } = useEvents();
  const formKey = buildCommandKey(eventName, commandIndex);
  const twitchTrigger = watch(buildTriggerKey(eventName, 'twitch'), undefined);

  const messageFormKey = buildKey(formKey, 'message');
  const message = watch(messageFormKey, '');
  const delayFormKey = buildKey(formKey, 'delay');
  const delay = watch(messageFormKey, 0);

  const [inputMessage, setInputMessage] = useState<string>('');

  return (
    <HotkeysProvider enter={() => verifyResponseScript(eventName, message, inputMessage)}>
      <label className='response-code-ui field-section'>
        <ResponseCommandCheatSheet />
        <FormCodeInput label='Message:' formKey={messageFormKey} />
        <TextInput
          //className='response-code-input'
          placeholder='Input text'
          value={inputMessage}
          onInput={(value) => setInputMessage(value)}
        />
        <div className='response-code-output'></div>
        <div className='verify-message'>
          <Button
            label='Verify Script'
            className='verify-message-button save-button'
            onClick={() => verifyResponseScript(eventName, message, inputMessage)}
          />
        </div>
      </label>

      <FormNumberInput label='Delay (Milliseconds):' formKey={delayFormKey} />
    </HotkeysProvider>
  );
}
