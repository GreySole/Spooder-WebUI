import { SelectDropdown } from '@greysole/spooder-component-library';
import React from 'react';
import useDiscord from '../../../../modules/installed/discord/useDiscord';
import { SelectOption } from '../../../Types';

interface DiscordChannelPair {
  destGuild: string;
  destChannel: string;
}

interface DiscordChannelSelectProps {
  label?: string;
  value: DiscordChannelPair;
  onChange: (value: DiscordChannelPair) => void;
}

export default function DiscordChannelSelect(props: DiscordChannelSelectProps) {
  const { label, value, onChange } = props;
  const { getDiscordGuilds } = useDiscord();
  const { data: guilds, isLoading, error } = getDiscordGuilds();

  const destGuild = value.destGuild;
  const destChannel = value.destChannel;

  const onGuildChange = (guild: string) => {
    onChange({ destGuild: guild, destChannel: '' });
  };

  const onChannelChange = (channel: string) => {
    onChange({ ...value, destChannel: channel });
  };

  if (isLoading || error) {
    return null;
  }

  const guildOptions: SelectOption[] = [{ value: '', label: 'Select Guild' }];
  const channelOptions: SelectOption[] = [{ value: '', label: 'Select Channel' }];

  if (Object.keys(guilds).length > 0) {
    for (let d in guilds) {
      guildOptions.push({ value: d, label: guilds[d].name });
    }

    if (destGuild != '' && guilds[destGuild]) {
      for (let c in guilds[destGuild].channels) {
        channelOptions.push({ value: c, label: guilds[destGuild].channels[c].name });
      }
    }

    return (
      <label>
        {label}
        <SelectDropdown options={guildOptions} value={destGuild} onChange={onGuildChange} />
        <SelectDropdown options={channelOptions} value={destChannel} onChange={onChannelChange} />
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
