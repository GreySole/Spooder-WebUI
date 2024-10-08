import React from 'react';
import { useFormContext } from 'react-hook-form';

interface EventTriggersProps {
  eventName: string;
}

export default function EventTriggers(props: EventTriggersProps) {
  const { eventName } = props;
  const { watch } = useFormContext();

  let triggerElement = <div className='command-props triggers'></div>;

  return triggerElement;
}
