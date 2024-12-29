import React from 'react';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormContext } from 'react-hook-form';
import FormBoolSwitch from '../../../../common/input/form/FormBoolSwitch';
import { buildCommandKey, buildKey, buildTriggerKey } from '../../FormKeys';
import ResponseCommandCheatSheet from './ResponseCommandCheatSheet';
import useDiscord from '../../../../../app/hooks/useDiscord';
import CodeEditor from '@uiw/react-textarea-code-editor';
import useEvents from '../../../../../app/hooks/useEvents';
import { useState } from 'react';
import { EventCommandProps } from '../../../../Types';
import FormNumberInput from '../../../../common/input/form/FormNumberInput';
import FormCodeInput from '../../../../common/input/form/FormCodeInput';
import Button from '../../../../common/input/controlled/Button';
import TextInput from '../../../../common/input/controlled/TextInput';
import { HotkeysProvider } from '../../../../../app/hooks/useHotkeys';

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
