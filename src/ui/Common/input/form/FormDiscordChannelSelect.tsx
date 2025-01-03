import React from 'react';
import { useFormContext } from 'react-hook-form';
import useDiscord from '../../../../app/hooks/useDiscord';
import { SelectOption } from '../../../Types';
import { FormSelectDropdown } from '@greysole/spooder-component-library';

interface FormDiscordChannelSelectProps {
  formKey: string;
  label?: string;
}

export default function FormDiscordChannelSelect(props: FormDiscordChannelSelectProps) {
  const { formKey, label } = props;
  const { getDiscordGuilds } = useDiscord();
  const { data: guilds, isLoading, error } = getDiscordGuilds();
  const { watch } = useFormContext();
  const destGuild = watch(`${formKey}.destguild`, '');

  if (isLoading || error) {
    return null;
  }

  let guildOptions: SelectOption[] = [{ value: '', label: 'Select Guild' }];
  let channelOptions: SelectOption[] = [{ value: '', label: 'Select Channel' }];

  if (Object.keys(guilds).length > 0) {
    for (let d in guilds) {
      guildOptions.push({ value: d, label: guilds[d].name });
    }

    if (destGuild != '' && guilds[destGuild] != null) {
      for (let c in guilds[destGuild].channels) {
        channelOptions.push({ value: c, label: guilds[destGuild].channels[c].name });
      }
    }

    return (
      <label>
        {label}
        <FormSelectDropdown formKey={`${formKey}.destguild`} options={guildOptions} />
        <FormSelectDropdown formKey={`${formKey}.destchannel`} options={channelOptions} />
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
