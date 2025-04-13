import React from 'react';
import {
  faCommentDots,
  faNetworkWired,
  faTrash,
  faSquarePen,
} from '@fortawesome/free-solid-svg-icons';
import {
  Border,
  Box,
  Columns,
  TypeFace,
  ButtonRow,
  useTheme,
  Icon,
} from '@greysole/spooder-component-library';
import { useFormContext } from 'react-hook-form';
import { StyleSize } from '../../Types';
import { useEventTableModal } from './context/EventTableModalContext';
import { EVENT_KEY, buildEventKey, buildKey } from './FormKeys';
import { TwitchIcon } from '../../common/icons/icons';

interface EventElementProps {
  eventName: string;
}

export default function EventElement(props: EventElementProps) {
  const { eventName } = props;
  const { setValue, getValues, watch } = useFormContext();
  const { open, setEventName } = useEventTableModal();
  const { isMobileDevice } = useTheme();
  const event = getValues(`${EVENT_KEY}.${eventName}`);
  const eventTriggers = event.triggers;

  function deleteEvent() {
    const deleteConfirm = confirm('Are you sure you want to delete this event?');
    if (!deleteConfirm) {
      return;
    }
    let newState = getValues(EVENT_KEY);
    delete newState[eventName];

    setValue(EVENT_KEY, newState);
  }

  function editEvent() {
    setEventName(eventName);
    open();
  }

  let triggerIcons = [];
  if (eventTriggers.chat?.enabled) {
    triggerIcons.push(<Icon icon={faCommentDots} iconSize='xlarge' />);
  }

  if (eventTriggers.twitch?.enabled) {
    triggerIcons.push(<Icon icon={TwitchIcon} iconSize='xlarge' />);
  }

  if (eventTriggers.osc?.enabled) {
    triggerIcons.push(<Icon icon={faNetworkWired} iconSize='xlarge' />);
  }
  const eventKey = buildEventKey(eventName);
  const nameKey = buildKey(eventKey, 'name');
  const name = watch(nameKey);

  return (
    <Border borderBottom>
      <Box
        className='expandable-header'
        justifyContent='space-between'
        flexFlow={isMobileDevice ? 'column' : 'row'}
        alignItems='center'
        padding='medium'
      >
        <Columns spacing='medium' margin='small'>
          <TypeFace fontSize='large'>{name}</TypeFace>
          <Columns spacing='small'>{triggerIcons}</Columns>
        </Columns>

        <ButtonRow
          buttonSize='large'
          iconSize='large'
          buttons={[
            {
              icon: faSquarePen,
              onClick: () => editEvent(),
            },
            {
              icon: faTrash,
              onClick: () => deleteEvent(),
            },
          ]}
        />
      </Box>
    </Border>
  );
}
