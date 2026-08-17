import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Box, Button, Stack, TextInput, TypeFace, useDialog } from '@spooder/webui-component-library';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { EventGraph } from '../../../Types';
import { buildGraphKey, GRAPH_KEY } from '../FormKeys';
import { collectTimerUsage, deleteTimerFromGraphs, renameTimerInGraphs } from './timerUsage';

interface TimerManagerPanelProps {
  onClose: () => void;
}

const NODE_LABELS: { [nodeTypeId: string]: string } = {
  start_timer: 'Start',
  stop_timer: 'Stop',
  timer_elapsed: 'On Elapsed',
  timer_tick: 'On Tick',
};

// Timers are global by name, so they're managed across the whole save file rather than per
// event. Every edit here writes straight into the shared events form - the save path posts
// the entire form, so changes to events other than the open one persist with a normal Save.
export default function TimerManagerPanel(props: TimerManagerPanelProps) {
  const { onClose } = props;
  const { watch, getValues, setValue } = useFormContext();
  const { openDialog, closeDialog } = useDialog();
  const [renaming, setRenaming] = useState<{ [name: string]: string }>({});

  const usages = collectTimerUsage(watch(GRAPH_KEY));

  function applyRename(from: string) {
    const to = (renaming[from] ?? '').trim();
    if (!to || to === from) {
      return;
    }
    const graphs: { [eventId: string]: EventGraph } = getValues(GRAPH_KEY);
    const changed = renameTimerInGraphs(graphs, from, to);
    for (const eventId in changed) {
      setValue(`${buildGraphKey(eventId)}.nodes`, changed[eventId], { shouldDirty: true });
    }
    setRenaming((current) => {
      const next = { ...current };
      delete next[from];
      return next;
    });
  }

  function confirmDelete(name: string, referenceCount: number) {
    openDialog(
      `Delete timer '${name}'?`,
      <TypeFace>
        This removes {referenceCount} node{referenceCount === 1 ? '' : 's'} and their connections,
        across every event that uses this timer.
      </TypeFace>,
      [
        <Button label='Cancel' onClick={() => closeDialog()} />,
        <Button
          label='Delete'
          className='delete-button'
          onClick={() => {
            const graphs: { [eventId: string]: EventGraph } = getValues(GRAPH_KEY);
            const changed = deleteTimerFromGraphs(graphs, name);
            for (const eventId in changed) {
              setValue(`${buildGraphKey(eventId)}.nodes`, changed[eventId].nodes, { shouldDirty: true });
              setValue(`${buildGraphKey(eventId)}.edges`, changed[eventId].edges, { shouldDirty: true });
            }
            closeDialog();
          }}
        />,
      ],
    );
  }

  return (
    <Stack spacing='medium' padding='medium'>
      <Box justifyContent='space-between' alignItems='center'>
        <TypeFace fontSize='large'>Timers</TypeFace>
        <Button label='Close' onClick={onClose} />
      </Box>

      {usages.length === 0 ? (
        <TypeFace>
          No named timers yet. Add a Start Timer node and give it a name.
        </TypeFace>
      ) : null}

      {usages.map((usage) => (
        <Stack key={usage.name} spacing='small'>
          <Box justifyContent='space-between' alignItems='center'>
            <TypeFace fontWeight='bold'>{usage.name}</TypeFace>
            <Button
              icon={faTrash}
              className='delete-button'
              onClick={() => confirmDelete(usage.name, usage.references.length)}
            />
          </Box>

          <Box alignItems='center'>
            <TextInput
              placeholder='Rename to...'
              value={renaming[usage.name] ?? ''}
              onInput={(value: string) =>
                setRenaming((current) => ({ ...current, [usage.name]: value }))
              }
            />
            <Button label='Rename' onClick={() => applyRename(usage.name)} />
          </Box>

          {usage.references.map((ref) => (
            <TypeFace key={`${ref.eventId}:${ref.nodeId}`} fontSize='small'>
              {ref.eventName} — {NODE_LABELS[ref.nodeTypeId] ?? ref.nodeTypeId}
            </TypeFace>
          ))}
        </Stack>
      ))}
    </Stack>
  );
}
