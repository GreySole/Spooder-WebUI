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
  FormBoolSwitch,
  FormTextInput,
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
  const useLinkButtonFormKey = buildKey(formKey, 'use_link_button');
  const linkButtonTextFormKey = buildKey(formKey, 'link_label');
  const linkFormKey = buildKey(formKey, 'link_url');

  const selectedGuild = watch(discordGuildFormKey, '');
  const useLinkButton = watch(useLinkButtonFormKey, false);

  const {
    data: channelData,
    isLoading: channelsLoading,
    error: channelsError,
  } = getDiscordGuilds();
  if (channelsLoading) {
    return null;
  }

  const guildOptions = [{ value: '', label: 'Select Guild' }];
  const channelOptions = [{ value: '', label: 'Select Channel' }];

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
      <FormBoolSwitch label='Use Link Button' formKey={useLinkButtonFormKey} />
      {useLinkButton ? (
        <>
          <FormTextInput label='Link Button Text:' formKey={linkButtonTextFormKey} />
          <FormTextInput label='Link URL:' formKey={linkFormKey} />
        </>
      ) : null}
      <FormNumberInput label='Delay (Milliseconds):' formKey={delayFormKey} />
    </Stack>
  );
}
