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
    <div className='command-props response'>
      <label className='response-code-ui field-section'>
        <ResponseCommandCheatSheet />
        <CodeEditor
          className='response-code-editor'
          language='js'
          value={message}
          placeholder="return 'Hello '+event.displayName"
          {...register(messageFormKey)}
        />
        <input
          className='response-code-input'
          type='text'
          placeholder='Input text'
          value={inputMessage}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)}
        />
        <div className='response-code-output'></div>
        <div className='verify-message'>
          <button
            className='verify-message-button save-button'
            onKeyDown={(e) => {
              if (e.code == 'Enter') {
                verifyResponseScript(eventName, message, inputMessage);
              }
            }}
            onClick={() => verifyResponseScript(eventName, message, inputMessage)}
          >
            Verify Script
          </button>
        </div>
      </label>
      <label>
        Delay (Milliseconds):
        <input value={delay} type='number' {...register(delayFormKey)} />
      </label>
    </div>
  );
}
