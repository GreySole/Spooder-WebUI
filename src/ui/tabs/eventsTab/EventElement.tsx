import React from 'react';
import { faTrash, faSquarePen } from '@fortawesome/free-solid-svg-icons';
import {
  Border,
  Box,
  Columns,
  TypeFace,
  ButtonRow,
  useTheme,
  useTooltip,
  Icon,
  Button,
  useDialog,
} from '@spooder/webui-component-library';
import { useFormContext } from 'react-hook-form';
import { StyleSize } from '../../Types';
import { useEventTableModal } from './context/EventTableModalContext';
import { GRAPH_KEY, buildGraphKey, buildKey } from './FormKeys';
import useEvents from '../../../app/hooks/useEvents';
import useModules from '../../../modules/useModules';
import { getGraphTriggerKinds, orderTriggerKinds, triggerKindIcon } from './eventNodes/graphUtil';

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
  const { showTip, hideTip } = useTooltip();
  const modules = useModules();
  const graph = watch(`${GRAPH_KEY}.${eventName}`);

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
            unregister(buildKey(GRAPH_KEY, eventName));
            saveEvents(
              getValues(),
              'Event deleted successfully!',
              'An error occurred while deleting the event.',
            ).then(() => {
              closeDialog();
            });
          }}
        />,
      ],
    );
  }

  if (!graph) {
    return null;
  }

  function editEvent() {
    setEventName(eventName);
    open();
  }

  const triggerIcons = orderTriggerKinds(getGraphTriggerKinds(graph)).map((kind) => {
    const { icon, tooltipText } = triggerKindIcon(kind, modules);
    return (
      <span key={kind} onPointerEnter={() => showTip(tooltipText)} onPointerLeave={() => hideTip()}>
        <Icon icon={icon} iconSize='xlarge' />
      </span>
    );
  });
  const graphKey = buildGraphKey(eventName);
  const nameKey = buildKey(graphKey, 'name');
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
