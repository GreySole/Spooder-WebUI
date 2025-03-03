import React from 'react';
import { useFormContext } from 'react-hook-form';
import useDiscord from '../../../../../app/hooks/useDiscord';
import { buildKey } from '../../FormKeys';
import ResponseCommandCheatSheet from './ResponseCommandCheatSheet';
import useEvents from '../../../../../app/hooks/useEvents';
import { useState } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import {
  Border,
  Box,
  Button,
  Columns,
  Expandable,
  FormBoolSwitch,
  FormSelectDropdown,
  FormTextInput,
  Stack,
  TextInput,
  TypeFace,
} from '@greysole/spooder-component-library';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import FormCodeInput from '../../../../common/input/form/FormCodeInput';
import ResponseSearchAndMatchCheatSheet from './ResponseSearchAndMatchCheatSheet';
import { Value } from 'sass';

interface EventResponseCommandProps {
  eventName: string;
  formKey: string;
}

export default function ResponseDiscordSpecialFields(props: EventResponseCommandProps) {
  const { eventName, formKey } = props;
  const { watch, getValues } = useFormContext();
  const { getVerifyResponseScript } = useEvents();
  const { verifyResponseScript } = getVerifyResponseScript();
  const { getDiscordGuilds } = useDiscord();
  const [verifyScriptStatus, setVerifyScriptStatus] = useState('');
  const [verifyScriptResponse, setVerifyScriptResponse] = useState(
    'Write your code in the above editor and click Verify Script. The result of the script will print here. Use the Input Message field to simulate a chat message and trigger the command.',
  );
  const [inputMessage, setInputMessage] = useState<string>('');
  const {
    data: channelData,
    isLoading: channelsLoading,
    error: channelsError,
  } = getDiscordGuilds();
  if (channelsLoading) {
    return null;
  }
  const specialDiscordEnabledFormKey = buildKey(formKey, 'special', 'discord', 'enabled');
  const specialDiscordGuildFormKey = buildKey(formKey, 'special', 'discord', 'guild');
  const specialDiscordChannelFormKey = buildKey(formKey, 'special', 'discord', 'channel');
  const specialDiscordMessageFormKey = buildKey(formKey, 'special', 'discord', 'message');
  const specialDiscordIntervalFormKey = buildKey(formKey, 'special', 'discord', 'interval');

  const specialDiscordGuild = watch(specialDiscordGuildFormKey, '');

  const verifyBorderColor =
    verifyScriptStatus !== '' ? (verifyScriptStatus === 'error' ? 'red' : 'green') : undefined;

  let guildOptions = [{ value: '', label: 'Select Guild' }];
  let channelOptions = [{ value: '', label: 'Select Channel' }];
  for (let d in channelData) {
    guildOptions.push({ value: d, label: channelData[d].name });
  }

  for (let c in channelData[specialDiscordGuild]?.channels) {
    channelOptions.push({ value: c, label: channelData[specialDiscordGuild]?.channels[c].name });
  }

  return (
    <Stack spacing='medium' padding='medium'>
      <FormBoolSwitch
        label={'Send @everyone ping on Discord'}
        formKey={specialDiscordEnabledFormKey}
      />
      <FormSelectDropdown
        label='Guild'
        formKey={specialDiscordGuildFormKey}
        options={guildOptions}
      />
      <FormSelectDropdown
        label='Channel'
        formKey={specialDiscordChannelFormKey}
        options={channelOptions}
      />

      <Box flexFlow='column'>
        <FormCodeInput label='Script' formKey={specialDiscordMessageFormKey} />
        <Box flexFlow='column' marginTop='medium'>
          <Stack spacing='medium'>
            <Border borderColor={verifyBorderColor}>
              <Box flexFlow='row' padding='medium'>
                <TypeFace>{verifyScriptResponse}</TypeFace>
              </Box>
            </Border>
            <TextInput
              placeholder='Input Message'
              value={inputMessage}
              onInput={(value) => {
                setInputMessage(value);
              }}
            />
            <Button
              label='Verify Script'
              onClick={() => {
                const values = getValues();
                verifyResponseScript(values.command, inputMessage, values.script).then((res) => {
                  setVerifyScriptResponse(res.data.response);
                  setVerifyScriptStatus(res.data.status);
                });
              }}
            />
          </Stack>
        </Box>
      </Box>
      <FormTextInput label='Interval (Seconds):' formKey={specialDiscordIntervalFormKey} />
    </Stack>
  );
}
