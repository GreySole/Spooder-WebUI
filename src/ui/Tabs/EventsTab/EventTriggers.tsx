import React from 'react';
import { useFormContext } from 'react-hook-form';
import TwitchTriggerType from './eventTrigger/twitch/TwitchTriggerType';
import ChatTrigger from './eventTrigger/chat/ChatTrigger';
import OSCTrigger from './eventTrigger/osc/OSCTrigger';
import { EVENT_KEY } from './FormKeys';
import TwitchTrigger from './eventTrigger/twitch/TwitchTrigger';

interface EventTriggersProps {
  eventName: string;
}

export default function EventTriggers(props: EventTriggersProps) {
  const { eventName } = props;
  const { watch } = useFormContext();
  const eventTriggers = watch(`${EVENT_KEY}.${eventName}.triggers`, []);

  const triggerElements = [];
  for (const t in eventTriggers) {
    switch (t) {
      case 'chat':
        triggerElements.push(<ChatTrigger eventName={eventName} />);
        break;
      case 'osc':
        triggerElements.push(<OSCTrigger eventName={eventName} />);
        break;
      case 'twitch':
        triggerElements.push(<TwitchTrigger eventName={eventName} />);
        break;
    }
  }

  return <div className='command-props triggers'>{triggerElements}</div>;
}
