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
  Button,
  useDialog,
} from '@greysole/spooder-component-library';
import { useFormContext } from 'react-hook-form';
import { StyleSize } from '../../Types';
import { useEventTableModal } from './context/EventTableModalContext';
import { EVENT_KEY, buildEventKey, buildKey } from './FormKeys';
import { TwitchIcon } from '../../common/icons/icons';
import useEvents from '../../../app/hooks/useEvents';

interface EventElementProps {
  eventName: string;
}

export default function EventElement(props: EventElementProps) {
  const { eventName } = props;
  const { setValue, getValues, watch, unregister } = useFormContext();
  const { getEvents, getSaveEvents } = useEvents();
  const { refetch } = getEvents();
  const { saveEvents } = getSaveEvents();
  const { openDialog, closeDialog } = useDialog();
  const { open, setEventName } = useEventTableModal();
  const { isMobileDevice } = useTheme();
  const event = watch(`${EVENT_KEY}.${eventName}`);

  function deleteEvent() {
    openDialog(
      `Delete ${eventName}?`,
      <TypeFace>Are you sure you want to delete {eventName}?</TypeFace>,
      [
        <Button
          label='Cancel'
          onClick={() => {
            closeDialog();
          }}
        />,
        <Button
          label='Delete'
          className='delete-button'
          onClick={() => {
            unregister(buildKey(EVENT_KEY, eventName));
            saveEvents(getValues());
            refetch();
            closeDialog();
          }}
        />,
      ],
    );
  }

  if (!event) {
    return null;
  }
  const eventTriggers = event.triggers;

  function editEvent() {
    setEventName(eventName);
    open();
  }

  let triggerIcons = [];
  if (eventTriggers.chat?.enabled) {
    triggerIcons.push(<Icon key={'chaticon'} icon={faCommentDots} iconSize='xlarge' />);
  }

  if (eventTriggers.twitch?.enabled) {
    triggerIcons.push(<Icon key={'twitchicon'} icon={TwitchIcon} iconSize='xlarge' />);
  }

  if (eventTriggers.osc?.enabled) {
    triggerIcons.push(<Icon key={'oscicon'} icon={faNetworkWired} iconSize='xlarge' />);
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
              className: 'delete-button',
              onClick: () => deleteEvent(),
            },
          ]}
        />
      </Box>
    </Border>
  );
}
