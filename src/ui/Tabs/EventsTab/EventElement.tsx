import React from 'react';
import { faCommentDots, faAward, faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FormBoolSwitch from '../../common/input/form/FormBoolSwitch';
import { useFormContext } from 'react-hook-form';
import { buildEventKey, buildKey, EVENT_KEY, GROUP_KEY } from './FormKeys';
import EventExpandable from './eventCommand/EventExpandable';
import EventCommands from './EventCommands';
import FormTextInput from '../../common/input/form/FormTextInput';
import EventTriggers from './EventTriggers';
import FormNumberInput from '../../common/input/form/FormNumberInput';
import FormSelectDropdown from '../../common/input/form/FormSelectDropdown';
import DeleteEventButton from './eventCommand/input/DeleteEventButton';
import SvgIcon from '../../icons/SvgIcon';
import TwitchIcon from '../../icons/twitch.svg';

interface EventElementProps {
  eventName: string;
}

export default function EventElement(props: EventElementProps) {
  const { eventName } = props;
  const { getValues, watch } = useFormContext();
  const event = getValues(`${EVENT_KEY}.${eventName}`);
  const groups = getValues(GROUP_KEY);
  const eventTriggers = event.triggers;
  const eventCommands = event.commands;

  const groupOptions = groups.map((groupName: string) => ({ label: groupName, value: groupName }));

  let triggerIcons = [];
  if (eventTriggers.chat.enabled) {
    triggerIcons.push(<FontAwesomeIcon icon={faCommentDots} />);
  }

  if (eventTriggers.twitch.enabled) {
    triggerIcons.push(<SvgIcon src={TwitchIcon} fill={'white'} width='32px' height='32px' />);
  }

  if (eventTriggers.osc?.enabled) {
    triggerIcons.push(<FontAwesomeIcon icon={faNetworkWired} />);
  }
  const eventKey = buildEventKey(eventName);
  const nameKey = buildKey(eventKey, 'name');
  const name = watch(nameKey);
  const descriptionKey = buildKey(eventKey, 'description');
  const groupKey = buildKey(eventKey, 'group');
  const cooldownKey = buildKey(eventKey, 'cooldown');
  const chatNotificationKey = buildKey(eventKey, 'chatnotification');
  const cooldownNotificationKey = buildKey(eventKey, 'cooldownnotification');

  return (
    <EventExpandable label={name} triggerIcons={triggerIcons}>
      <div className={'command-section'}>
        <label>Internal Name: {eventName}</label>
        <FormTextInput label='Name:' formKey={nameKey} />
        <FormTextInput label='Description:' formKey={descriptionKey} />
        <FormSelectDropdown label='Event Type:' formKey={groupKey} options={groupOptions} />
        <FormNumberInput label='Duration (Seconds):' formKey={cooldownKey} />
        <FormBoolSwitch label='Notify Activation in Chat:' formKey={chatNotificationKey} />
        <FormBoolSwitch
          label='Tell How Much Time Left for Cooldown:'
          formKey={cooldownNotificationKey}
        />
        <label className='field-section'>
          Trigger:
          <EventTriggers eventName={eventName} />
        </label>
        <EventCommands eventName={eventName} eventCommands={eventCommands} />

        <div className='delete-event-div'>
          <DeleteEventButton eventName={eventName} />
        </div>
      </div>
    </EventExpandable>
  );
}
