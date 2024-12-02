import React from 'react';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import Expandable from '../../common/layout/Expandable';
import AddEventInput from './eventCommand/input/AddEventInput';
import EventElement from './EventElement';
import DeleteGroupButton from './eventCommand/input/DeleteGroupButton';
import Box from '../../common/layout/Box';
import Columns from '../../common/layout/Columns';
import SearchBar from '../../common/input/general/SearchBar';

export default function EventTable() {
  const { watch } = useFormContext();
  const [searchText, setSearchText] = useState<string>('');

  const events = watch('events');
  const groups = watch('groups');

  let propKeys = Object.keys(events).sort((a, b) => {
    return events[a].name.toUpperCase() > events[b].name.toUpperCase() ? 1 : -1;
  });

  const groupObjects = groups.reduce((obj: any, key: string) => ({ ...obj, [key]: [] }), {
    Default: [],
  });

  for (let p in propKeys) {
    let s = propKeys[p];

    let thisEvent = events[s];

    let eventName = thisEvent.name;
    let groupName = thisEvent.group;

    if (searchText !== '' && !s.startsWith(searchText) && !eventName.startsWith(searchText)) {
      continue;
    }

    if (groupObjects[groupName] == null) {
      groupObjects[groupName] = [];
    }

    groupObjects[groupName].push(<EventElement key={s} eventName={s} />);
  }

  let groupKeys = Object.keys(groupObjects).sort();

  let searchEnabled = searchText !== '';

  const groupElements = groupKeys.map((groupName: string) => {
    if (searchEnabled == true && groupObjects[groupName].length == 0) {
      return null;
    }

    return (
      <Expandable label={groupName}>
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
    <Box flexFlow='column'>
      <SearchBar placeholder='Search Events...' onSearch={setSearchText} />
      <div className='event-container'>{groupElements}</div>
    </Box>
  );
}

export { EventTable };
