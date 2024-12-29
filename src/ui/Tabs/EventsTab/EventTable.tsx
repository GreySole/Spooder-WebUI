import React from 'react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import Expandable from '../../common/layout/Expandable';
import AddEventInput from './eventCommand/input/AddEventInput';
import EventElement from './EventElement';
import DeleteGroupButton from './eventCommand/input/DeleteGroupButton';
import Box from '../../common/layout/Box';
import Columns from '../../common/layout/Columns';
import SearchBar from '../../common/input/general/SearchBar';
import SaveButton from '../../common/input/form/SaveButton';
import AddGroupInput from './eventCommand/input/AddGroupInput';
import useEvents from '../../../app/hooks/useEvents';
import ResetButton from '../../common/input/form/ResetButton';
import { Footer } from '../../app/Footer';
import FilterButton from '../../common/input/general/FilterButton';
import { faComment, faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import TwitchIcon from '../../icons/twitch.svg';
import { FilterProps } from '../../Types';

export default function EventTable() {
  const { watch, formState } = useFormContext();
  const [searchText, setSearchText] = useState<string>('');
  const [filter, setFilter] = useState<string[]>([]);
  const { getSaveEvents } = useEvents();
  const { saveEvents } = getSaveEvents();

  const events = watch('events');
  const groups = watch('groups');

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

    if (searchEnabled && !s.startsWith(searchText) && !eventName.startsWith(searchText)) {
      continue;
    }

    if (groupObjects[groupName] == null) {
      groupObjects[groupName] = [];
    }

    groupObjects[groupName].push(<EventElement key={s} eventName={s} />);
  }

  const groupKeys = Object.keys(groupObjects).sort();

  const groupElements = groupKeys.map((groupName: string) => {
    if (searchEnabled == true && groupObjects[groupName].length == 0) {
      return null;
    }

    return (
      <Expandable label={groupName} forceOpen={searchEnabled || filterEnabled}>
        <Box flexFlow='column'>
          <Columns spacing='medium'>
            <AddEventInput groupName={groupName} />
            <DeleteGroupButton groupName={groupName} />
          </Columns>
          {groupObjects[groupName]}
        </Box>
      </Expandable>
    );
  });

  return (
    <>
      <Box flexFlow='column' padding='medium'>
        <AddGroupInput />
        {groupElements}
      </Box>
      <Footer showFooter={true}>
        <Box width='inherit' alignItems='center' padding='small' justifyContent='space-between'>
          <Columns spacing='medium' padding='small'>
            <SearchBar placeholder='Search Events...' onSearch={setSearchText} />
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
          {formState.isDirty ? (
            <Columns spacing='medium' padding='small'>
              <ResetButton />
              <SaveButton saveFunction={saveEvents} />
            </Columns>
          ) : null}
        </Box>
      </Footer>
    </>
  );
}

export { EventTable };
