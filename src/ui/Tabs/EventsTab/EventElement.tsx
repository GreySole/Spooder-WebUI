import React from 'react';
import {
  faCommentDots,
  faNetworkWired,
  faTrash,
  faSquarePen,
} from '@fortawesome/free-solid-svg-icons';
import {
  getIcon,
  Border,
  Box,
  Columns,
  TypeFace,
  ButtonRow,
} from '@greysole/spooder-component-library';
import useTheme from '@greysole/spooder-component-library/dist/types/context/ThemeContext';
import { useFormContext } from 'react-hook-form';
import { StyleSize } from '../../Types';
import { useEventTableModal } from './context/EventTableModalContext';
import { EVENT_KEY, buildEventKey, buildKey } from './FormKeys';
import TwitchIcon from '@greysole/spooder-component-library/dist/types/icons/TwitchIcon';

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
  if (eventTriggers.chat.enabled) {
    triggerIcons.push(getIcon(faCommentDots, true, StyleSize.xlarge));
  }

  if (eventTriggers.twitch.enabled) {
    triggerIcons.push(getIcon(TwitchIcon, true, StyleSize.xlarge));
  }

  if (eventTriggers.osc?.enabled) {
    triggerIcons.push(getIcon(faNetworkWired, true, StyleSize.xlarge));
  }
  const eventKey = buildEventKey(eventName);
  const nameKey = buildKey(eventKey, 'name');
  const name = watch(nameKey);

  return (
    <Border borderBottom>
      <Box
        classes={['expandable-header']}
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
          buttons={[
            {
              icon: faSquarePen,
              iconSize: StyleSize.large,
              onClick: () => editEvent(),
            },
            {
              icon: faTrash,
              iconSize: StyleSize.large,
              onClick: () => deleteEvent(),
            },
          ]}
        />
      </Box>
    </Border>
  );
}
