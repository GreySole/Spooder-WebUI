import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { buildKey, buildNodeValueKey } from '../../FormKeys';
import { Button, Columns, Stack, TypeFace } from '@spooder/webui-component-library';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import ResponseCommandCheatSheet from '../../eventCommand/response/ResponseCommandCheatSheet';
import ResponseScriptTest from './ResponseScriptTest';

interface ResponseNodeEditorProps {
  eventName: string;
  nodeIndex: number;
}

// The Response node's fields (type, script, interval key/minutes) are edited inline on the
// node card from its form def - see CORE_ACTION_DEFS in coreNodeDefs.ts, which also carries
// the showif rules that hide the interval fields for a one-shot response.
//
// What stays here is what a form def can't express: the script tester, and the cheat sheet -
// the card renders its code editor in `compact` mode, which drops the cheat sheet button.
export default function ResponseNodeEditor(props: ResponseNodeEditorProps) {
  const { eventName, nodeIndex } = props;
  const { watch } = useFormContext();
  const [cheatSheetOpen, setCheatSheetOpen] = useState(false);

  const nodeValueKey = buildNodeValueKey(eventName, nodeIndex);
  const eType = watch(buildKey(nodeValueKey, 'etype'), 'oneshot');

  if (eType === 'clear_recurring') {
    return null;
  }

  return (
    <Stack spacing='medium'>
      {eType === 'recurring' ? (
        <TypeFace fontWeight='bold'>
          Note: You can get the count of recurrences with 'extra.count'.
        </TypeFace>
      ) : null}
      <Columns spacing='small'>
        <TypeFace>Script Reference</TypeFace>
        <Button icon={faQuestionCircle} onClick={() => setCheatSheetOpen(!cheatSheetOpen)} />
      </Columns>
      <ResponseCommandCheatSheet isOpen={cheatSheetOpen} />
      <ResponseScriptTest eventName={eventName} nodeIndex={nodeIndex} />
    </Stack>
  );
}
