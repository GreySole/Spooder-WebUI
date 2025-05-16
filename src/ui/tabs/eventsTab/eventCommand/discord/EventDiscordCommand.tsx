import { useFormContext } from 'react-hook-form';
import useDiscord from '../../../../../app/hooks/useDiscord';
import useEvents from '../../../../../app/hooks/useEvents';
import { useState } from 'react';
import { EventCommandProps } from '../../../../Types';
import {
  Stack,
  Box,
  FormNumberInput,
  FormSelectDropdown,
} from '@greysole/spooder-component-library';
import React from 'react';
import FormCodeInput from '../../../../common/input/form/FormCodeInput';
import { buildCommandKey, buildKey } from '../../FormKeys';
import ResponseScriptTest from '../response/ResponseScriptTest';

export default function EventDiscordCommand(props: EventCommandProps) {
  const { eventName, commandIndex } = props;
  const { watch } = useFormContext();
  const { getVerifyResponseScript } = useEvents();
  const { getDiscordGuilds } = useDiscord();

  const formKey = buildCommandKey(eventName, commandIndex);

  const messageFormKey = buildKey(formKey, 'message');
  const delayFormKey = buildKey(formKey, 'delay');
  const discordGuildFormKey = buildKey(formKey, 'guild');
  const discordChannelFormKey = buildKey(formKey, 'channel');

  const selectedGuild = watch(discordGuildFormKey, '');

  const {
    data: channelData,
    isLoading: channelsLoading,
    error: channelsError,
  } = getDiscordGuilds();
  if (channelsLoading) {
    return null;
  }

  let guildOptions = [{ value: '', label: 'Select Guild' }];
  let channelOptions = [{ value: '', label: 'Select Channel' }];
  for (let d in channelData) {
    guildOptions.push({ value: d, label: channelData[d].name });
  }

  for (let c in channelData[selectedGuild]?.channels) {
    channelOptions.push({ value: c, label: channelData[selectedGuild]?.channels[c].name });
  }

  return (
    <Stack spacing='medium' padding='medium'>
      <FormSelectDropdown formKey={discordGuildFormKey} label='Guild' options={guildOptions} />
      <FormSelectDropdown
        formKey={discordChannelFormKey}
        label='Channel'
        options={channelOptions}
      />
      <Box flexFlow='column'>
        <FormCodeInput label='Script' formKey={messageFormKey} />
      </Box>
      <ResponseScriptTest eventName={eventName} commandIndex={commandIndex} />
      <FormNumberInput label='Delay (Milliseconds):' formKey={delayFormKey} />
    </Stack>
  );
}
