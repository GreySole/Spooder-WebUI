import React from 'react';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

export default function ResponseCommandCheatSheet() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <>
      <span>
        Reoccuring Message:{' '}
        <FontAwesomeIcon icon={faQuestionCircle} size='lg' onClick={(e) => setIsOpen(!isOpen)} />
      </span>
      <div className={`response-cheatsheet ${isOpen ? '' : 'hidden'}`}>
        Variables:
        <ul>
          <li>event:object - Data that triggered the event.</li>
          <li>
            extra:array - Extra event data (Can be search and match words or booleans for locked
            events/plugins)
          </li>
          <li>toUser:string - The second word in a message that's usually a user name.</li>
          <li>command:array - The message split by whitespace for processing arguments</li>
        </ul>
        Functions:
        <ul>
          <li>
            say(txt:string) - Respond on the platform and channel the message originated from.
          </li>
          <li>
            getVar(key:string, defaultVal=0:any) - Get a variable from the event storage that
            matches the key. Returns default value if not found.
          </li>
          <li>
            setVar(key:string, value:any, save=true:boolean) - Set a variable in the event storage
            for later. Save will write the event storage to file if true.
          </li>
          <li>
            getSharedVar(eventname:string, key:string, defaultVal=0:any) - Get a variable from
            another event's storage space.
          </li>
          <li>
            setSharedVar(eventname:string, key:string, value:any, save=true:boolean) - Each event
            has a storage space with their internal name as the key. This will set a var within a
            certain event's storage space. Handy for features with multiple commands
          </li>
          <li>chooseRandom(choices:array) - Returns a random element from the given array.</li>
          <li>sanitize(txt:string) - Removes special characters from a given text</li>
          <li>
            runEvent(eventName:string) - Run a spooder event. Event data from this event will be
            passed over.
          </li>
        </ul>
      </div>
    </>
  );
}
