import React, { ReactNode } from 'react';
import { Box, TypeFace } from '@spooder/webui-component-library';
import useModule from '../../../../../app/hooks/useModule';

interface ResponseCommandCheatSheetProps {
  isOpen: boolean;
}

export default function ResponseCommandCheatSheet({ isOpen }: ResponseCommandCheatSheetProps) {
  const { getResponseHandlers } = useModule();
  const { data, isLoading } = getResponseHandlers();
  if (isLoading) {
    return null;
  }
  if (!isOpen) return null;

  const responseHandlers = [] as ReactNode[];

  console.log('ResponseCommandCheatSheet', data);

  for (let d in data) {
    const handler = data[d];
    responseHandlers.push(
      <Box key={d} flexFlow='column'>
        <TypeFace>{d}</TypeFace>
        <ul>
          {handler.map((description: string) => {
            return <li key={description}>{description}</li>;
          })}
        </ul>
      </Box>,
    );
  }
  return (
    <Box flexFlow='column'>
      <TypeFace>Variables:</TypeFace>
      <ul>
        <li>event:object - Data that triggered the event.</li>
        <li>
          extra:array - Extra event data (Can be search and match words or booleans for locked
          events/plugins)
        </li>
        <li>toUser:string - The second word in a message that's usually a user name.</li>
        <li>command:array - The message split by whitespace for processing arguments</li>
      </ul>
      <TypeFace>Functions:</TypeFace>
      <ul>
        <li>say(txt:string) - Respond on the platform and channel the message originated from.</li>
        <li>
          getVar(key:string, defaultVal=0:any) - Get a variable from the event storage that matches
          the key. Returns default value if not found.
        </li>
        <li>
          setVar(key:string, value:any, save=true:boolean) - Set a variable in the event storage for
          later. Save will write the event storage to file if true.
        </li>
        <li>
          getSharedVar(eventname:string, key:string, defaultVal=0:any) - Get a variable from another
          event's storage space.
        </li>
        <li>
          setSharedVar(eventname:string, key:string, value:any, save=true:boolean) - Each event has
          a storage space with their internal name as the key. This will set a var within a certain
          event's storage space. Handy for features with multiple commands
        </li>
        <li>chooseRandom(choices:array) - Returns a random element from the given array.</li>
        <li>sanitize(txt:string) - Removes special characters from a given text</li>
        <li>
          runEvent(eventName:string) - Run a spooder event. Event data from this event will be
          passed over.
        </li>
      </ul>
      {responseHandlers}
    </Box>
  );
}
