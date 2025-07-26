import React from 'react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { faComment, faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import {
  Expandable,
  Box,
  Columns,
  SearchBar,
  FilterButton,
  ResetButton,
  SaveButton,
} from '@greysole/spooder-component-library';
import useEvents from '../../../app/hooks/useEvents';
import { Footer } from '../../app/Footer';
import AddEventInput from './eventCommand/input/AddEventInput';
import AddGroupInput from './eventCommand/input/AddGroupInput';
import DeleteGroupButton from './eventCommand/input/DeleteGroupButton';
import EventElement from './EventElement';
import { TwitchIcon } from '../../common/icons/icons';

export default function EventTable() {
  const [searchText, setSearchText] = useState<string>('');
  const [filter, setFilter] = useState<string[]>([]);

  const { getEvents } = useEvents();
  const { events, groups, isLoading } = getEvents();

  const searchEnabled = searchText !== '';
  const filterEnabled = filter.length > 0;

  const propKeys = Object.keys(events).sort((a, b) => {
    return events[a].name.toUpperCase() > events[b].name.toUpperCase() ? 1 : -1;
  });

  const groupObjects = groups.reduce((obj: any, key: string) => ({ ...obj, [key]: [] }), {
    Default: [],
  });

  for (let p in propKeys) {
    const s = propKeys[p];

    const thisEvent = events[s];

    const eventName = thisEvent.name;
    const groupName = thisEvent.group;

    if (
      filterEnabled &&
      Object.keys(thisEvent.triggers).some((key) => {
        return filter.includes(key) && !thisEvent.triggers[key].enabled;
      })
    ) {
      continue;
    }

    const internalEventName = eventName.toLowerCase().replace(/ /g, '');
    const eventNameLower = eventName.toLowerCase().replace(/ /g, '');

    if (
      searchEnabled &&
      !internalEventName.includes(searchText) &&
      !eventNameLower.includes(searchText)
    ) {
      continue;
    }

    if (groupObjects[groupName] == null) {
      groupObjects[groupName] = [];
    }

    groupObjects[groupName].push(<EventElement key={`event-${s}`} eventName={s} />);
  }

  const groupKeys = Object.keys(groupObjects).sort();

  const groupElements = groupKeys.map((groupName: string) => {
    if (searchEnabled == true && groupObjects[groupName].length == 0) {
      return null;
    }

    return (
      <Expandable
        key={`group-${groupName}`}
        label={groupName}
        forceOpen={searchEnabled || filterEnabled}
      >
        <Box flexFlow='column'>
          <Box flexFlow='row wrap'>
            <AddEventInput groupName={groupName} />
            <DeleteGroupButton groupName={groupName} />
          </Box>

          {groupObjects[groupName]}
        </Box>
      </Expandable>
    );
  });

  return (
    <Box flexFlow='column' width='inherit' marginBottom='var(--footer-height)'>
      <Box flexFlow='column'>
        <Box marginBottom='medium'>
          <AddGroupInput />
        </Box>
        {groupElements}
      </Box>
      <Footer showFooter={true}>
        <Box width='inherit' alignItems='center' padding='small' justifyContent='space-between'>
          <Columns spacing='medium' padding='small'>
            <SearchBar placeholder='Search Events...' value={searchText} onSearch={setSearchText} />
            <FilterButton
              options={[
                { label: 'Chat', icon: faComment, value: 'chat' },
                { label: 'OSC', icon: faNetworkWired, value: 'osc' },
                { label: 'Twitch', icon: TwitchIcon, value: 'twitch' },
              ]}
              selectedOptions={filter}
              onChange={(e) => (setFilter(e), console.log(e))}
            />
          </Columns>
        </Box>
      </Footer>
    </Box>
  );
}

export { EventTable };
