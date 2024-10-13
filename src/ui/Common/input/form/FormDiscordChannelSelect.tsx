import React from 'react';
import { useFormContext } from 'react-hook-form';
import useDiscord from '../../../../app/hooks/useDiscord';
import { SelectOption } from '../../../Types';
import FormSelectDropdown from './FormSelectDropdown';

interface FormDiscordChannelSelectProps {
  formKey: string;
  label?: string;
}

export default function FormDiscordChannelSelect(props: FormDiscordChannelSelectProps) {
  const { formKey, label } = props;
  const { getDiscordChannels } = useDiscord();
  const { data: discord, isLoading, error } = getDiscordChannels();
  const { watch } = useFormContext();
  const discordVal = watch(formKey, {
    guild: '',
    channel: '',
  });

  if (isLoading || error) {
    return null;
  }

  let guildOptions: SelectOption[] = [{ value: '', label: 'Select Guild' }];
  let channelOptions: SelectOption[] = [{ value: '', label: 'Select Channel' }];

  if (Object.keys(discord).length > 0) {
    for (let d in discord) {
      guildOptions.push({ value: d, label: discord[d].name });
    }

    if (discordVal.guild != '' && discord[discordVal.guild] != null) {
      for (let c in discord[discordVal.guild].channels) {
        channelOptions.push({ value: c, label: discord[discordVal.guild].channels[c].name });
      }
    }

    return (
      <label>
        {label}
        <FormSelectDropdown formKey={`${formKey}.guild`} options={guildOptions} />
        <FormSelectDropdown formKey={`${formKey}.channel`} options={channelOptions} />
      </label>
    );
  } else {
    return (
      <label>
        {label}
        No guilds found. Invite your Spooder to a Discord server to assign a channel.
      </label>
    );
  }
}
