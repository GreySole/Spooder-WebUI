import React from 'react';
import {
  faCommentDots,
  faAward,
  faNetworkWired,
  faTrash,
  faSquarePen,
} from '@fortawesome/free-solid-svg-icons';
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
import TypeFace from '../../common/layout/TypeFace';
import Stack from '../../common/layout/Stack';
import Modal from '../../common/input/general/Modal';
import EventGeneral from './EventGeneral';
import Box from '../../common/layout/Box';
import ButtonRow from '../../common/input/general/ButtonRow';
import { StyleSize } from '../../Types';
import Columns from '../../common/layout/Columns';
import { getIcon } from '../../util/MediaUtil';
import useTheme from '../../../app/hooks/useTheme';
import Border from '../../common/layout/Border';
import { useEventTableModal } from './context/EventTableModalContext';

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
