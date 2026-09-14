import { useFormContext } from 'react-hook-form';
import { buildGraphKey, buildKey, GRAPH_KEY, GROUP_KEY } from './FormKeys';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Columns,
  Stack,
  TextInput,
  TypeFace,
  FormTextInput,
  FormSelectDropdown,
  FormNumberInput,
  FormBoolSwitch,
} from '@spooder/webui-component-library';
import { useEventTableModal } from './context/EventTableModalContext';
import { renameEventInGraphs } from './eventNodes/eventUsage';

interface EventGeneralProps {
  eventName: string;
}

export default function EventGeneral(props: EventGeneralProps) {
  const { eventName } = props;
  const { watch, setValue, getValues, unregister } = useFormContext();
  const { setEventName } = useEventTableModal();
  const groups = watch(GROUP_KEY);
  const graphs = watch(GRAPH_KEY);
  const groupOptions = groups.map((groupName: string) => ({ label: groupName, value: groupName }));

  const [internalKeyInput, setInternalKeyInput] = useState(eventName);

  // The modal reuses this component for whichever event is open, so the local draft needs to
  // reset whenever the open event changes (including right after a rename, below).
  useEffect(() => {
    setInternalKeyInput(eventName);
  }, [eventName]);

  const graphKey = buildGraphKey(eventName);
  const nameKey = buildKey(graphKey, 'name');
  const descriptionKey = buildKey(graphKey, 'description');
  const groupKey = buildKey(graphKey, 'group');
  const cooldownKey = buildKey(graphKey, 'cooldown');

  const trimmedKey = internalKeyInput.trim();
  const isUnchanged = trimmedKey === eventName;
  const isTaken = !isUnchanged && trimmedKey.length > 0 && Object.keys(graphs ?? {}).includes(trimmedKey);
  const canRename = !isUnchanged && !isTaken && trimmedKey.length > 0;

  function renameInternalKey() {
    if (!canRename) {
      return;
    }

    const graph = getValues(graphKey);
    setValue(buildGraphKey(trimmedKey), graph, { shouldDirty: true });
    unregister(graphKey);

    // Cascade to the other places an event is referenced by this key - see eventUsage.ts.
    // Plugin settings that reference an event by name are outside this form and can't be
    // reached from here, so those still need a manual update after a rename.
    const changedNodes = renameEventInGraphs(graphs, eventName, trimmedKey);
    for (const changedEventId in changedNodes) {
      const targetEventId = changedEventId === eventName ? trimmedKey : changedEventId;
      setValue(buildKey(buildGraphKey(targetEventId), 'nodes'), changedNodes[changedEventId], {
        shouldDirty: true,
      });
    }

    setEventName(trimmedKey);
  }

  return (
    <Stack spacing='medium' paddingTop='medium'>
      <Stack spacing='small'>
        <Columns spacing='small'>
          <TextInput
            width='100%'
            label='Internal Name:'
            value={internalKeyInput}
            onInput={(value) => setInternalKeyInput(value)}
            jsonFriendly
          />
          <Button
            label='Rename'
            onClick={() => renameInternalKey()}
            disabled={!canRename}
            className='merge-with-input'
          />
        </Columns>
        {isTaken ? (
          <TypeFace fontSize='small'>{`'${trimmedKey}' already exists. Pick another name.`}</TypeFace>
        ) : null}
        <TypeFace fontSize='small'>
          Used internally to address this event - renaming it updates Trigger Event and Mod
          Action nodes, but plugin settings referencing it by name must be updated manually.
        </TypeFace>
      </Stack>
      <FormTextInput label='Name:' formKey={nameKey} />
      <FormTextInput label='Description:' formKey={descriptionKey} />
      <FormSelectDropdown label='Group:' formKey={groupKey} options={groupOptions} />
      <FormNumberInput label='Cooldown (Seconds):' formKey={cooldownKey} />
    </Stack>
  );
}
