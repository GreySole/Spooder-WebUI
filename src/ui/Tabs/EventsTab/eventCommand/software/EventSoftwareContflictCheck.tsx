import React from 'react';
import { useFormContext } from 'react-hook-form';
import { EventCommandProps } from '../../../../Types';

function checkCommandConflicts(eventName: string, commandIndex: number) {
  const { getValues } = useFormContext();
  let eventConflicts = [];
  let events = getValues('events');
  let checkAddress = events[eventName].commands[commandIndex].address;
  let checkValue = events[eventName].commands[commandIndex].valueOn;
  for (let e in events) {
    for (let c in events[e].commands) {
      if (e == eventName && c == `${commandIndex}`) {
        continue;
      }
      if (events[e].commands[c].type == 'software') {
        if (events[e].commands[c].address == checkAddress) {
          if (isNaN(checkValue) && isNaN(events[e].commands[c].valueOn)) {
            if (checkValue.includes(',')) {
              if (events[e].commands[c].valueOn.includes(',')) {
                if (events[e].commands[c].valueOn.split(',')[0] == checkValue.split(',')[0]) {
                  eventConflicts.push(e + c);
                }
              }
            } else {
              eventConflicts.push(e + c);
            }
          }
        }
      }
    }
  }

  return eventConflicts;
}

export default function EventSoftwareConflictCheck(props: EventCommandProps) {
  const { eventName, commandIndex } = props;
  const commandConflicts = checkCommandConflicts(eventName, commandIndex);
  return commandConflicts.length > 0 ? (
    <div className='type-label-conflicts'>
      <label>
        {commandConflicts.length +
          ' event' +
          (commandConflicts.length == 1 ? '' : 's') +
          " share this address. Use 'priority' to handle the overlap"}
      </label>
      <label>Conflicts: {commandConflicts.join(', ')}</label>
    </div>
  ) : null;
}
