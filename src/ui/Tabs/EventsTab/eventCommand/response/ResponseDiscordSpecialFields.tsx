import React from 'react';
import { useFormContext } from 'react-hook-form';
import useDiscord from '../../../../../app/hooks/useDiscord';
import { buildKey } from '../../FormKeys';
import FormBoolSwitch from '../../../../common/input/form/FormBoolSwitch';
import ResponseCommandCheatSheet from './ResponseCommandCheatSheet';
import useEvents from '../../../../../app/hooks/useEvents';
import { useState } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import FormTextInput from '../../../../common/input/form/FormTextInput';

interface EventResponseCommandProps {
  eventName: string;
  formKey: string;
}

export default function ResponseDiscordSpecialFields(props: EventResponseCommandProps) {
  const { eventName, formKey } = props;
  const { watch, register } = useFormContext();
  const { verifyResponseScript } = useEvents();
  const { getDiscordChannels } = useDiscord();
  const {
    data: channelData,
    isLoading: channelsLoading,
    error: channelsError,
  } = getDiscordChannels();
  if (channelsLoading) {
    return null;
  }
  const specialDiscordEnabledFormKey = buildKey(formKey, 'special', 'discord', 'enabled');
  const specialDiscordEnabled = watch(specialDiscordEnabledFormKey, false);
  const specialDiscordGuildFormKey = buildKey(formKey, 'special', 'discord', 'guild');
  const specialDiscordGuild = watch(specialDiscordGuildFormKey, '');
  const specialDiscordChannelFormKey = buildKey(formKey, 'special', 'discord', 'channel');
  const specialDiscordChannel = watch(specialDiscordChannelFormKey, '');
  const specialDiscordMessageFormKey = buildKey(formKey, 'special', 'discord', 'message');
  const specialDiscordMessage = watch(specialDiscordChannelFormKey, '');
  const specialDiscordIntervalFormKey = buildKey(formKey, 'special', 'discord', 'interval');
  const specialDiscordInterval = watch(specialDiscordChannelFormKey, 15);

  const [inputMessage, setInputMessage] = useState<string>('');

  let guildOptions = [<option value={''}>Select Guild</option>];
  let channelOptions = [<option value={''}>Select Channel</option>];
  for (let d in channelData) {
    guildOptions.push(<option value={d}>{channelData[d].name}</option>);
  }

  for (let c in channelData[specialDiscordGuild]?.channels) {
    channelOptions.push(
      <option value={c}>{channelData[specialDiscordGuild]?.channels[c].name}</option>,
    );
  }

  return (
    <>
      <div className='config-variable-ui'>
        <FormBoolSwitch
          label={'Send @everyone ping on Discord'}
          formKey={specialDiscordEnabledFormKey}
        />
        <div className={specialDiscordEnabled ? '' : 'hidden'}>
          <select value={specialDiscordGuild} {...register(specialDiscordEnabledFormKey)}>
            {guildOptions}
          </select>
          <select defaultValue={specialDiscordChannel} {...register(specialDiscordChannelFormKey)}>
            {channelOptions}
          </select>
        </div>
      </div>
      <div className='command-props response'>
        <div className='response-code-ui'>
          <ResponseCommandCheatSheet />
          <CodeEditor
            className='response-code-editor'
            language='js'
            value={specialDiscordMessage}
            placeholder="return 'Hello '+event.displayName"
            {...register(specialDiscordMessageFormKey)}
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
                  verifyResponseScript(eventName, specialDiscordMessage, inputMessage);
                }
              }}
              onClick={() => verifyResponseScript(eventName, specialDiscordMessage, inputMessage)}
            >
              Verify Script
            </button>
          </div>
        </div>
        <FormTextInput label='Interval (Seconds):' formKey={specialDiscordIntervalFormKey} />
      </div>
    </>
  );
}
