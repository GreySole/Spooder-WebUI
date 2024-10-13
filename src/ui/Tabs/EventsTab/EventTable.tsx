import React from 'react';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useEffect, ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
import useConfig from '../../../app/hooks/useConfig';
import useEvents from '../../../app/hooks/useEvents';
import Expandable from '../../common/Expandable';
import EventTableFormContextProvider from './context/EventTableFormContext';
import AddEventInput from './eventCommand/input/AddEventInput';
import AddGroupInput from './eventCommand/input/AddGroupInput';
import EventElement from './EventElement';
import LoadingCircle from '../../common/LoadingCircle';
import { useHotkeys } from '../../../app/hooks/useHotkeys';
import SaveEventsButton from '../../common/input/form/SaveButton';
import DeleteGroupButton from './eventCommand/input/DeleteGroupButton';

export default function EventTable() {
  const { watch } = useFormContext();
  const [searchText, setSearchText] = useState<string>('');

  const events = watch('events', {});
  const groups = watch('groups', []);

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
      <div key={groupName} className='command-group'>
        <Expandable label={groupName}>
          <div className={'command-group-content'}>
            <div
              className='command-group-actions'
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <AddEventInput groupName={groupName} />
              <div className='delete-event-div'>
                <DeleteGroupButton groupName={groupName} />
              </div>
            </div>
            {groupObjects[groupName]}
          </div>
        </Expandable>
      </div>
    );
  });

  return (
    <>
      <div className='event-search'>
        <FontAwesomeIcon icon={faMagnifyingGlass} className='event-search-icon' size='lg' />
        <input
          type='search'
          className='event-search-bar'
          placeholder='Search Events...'
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value)}
        />
      </div>
      <div className='event-container'>{groupElements}</div>
    </>
  );
}

export { EventTable };
