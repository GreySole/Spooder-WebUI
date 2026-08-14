import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Box,
  Button,
  Columns,
  FormNumberInput,
  FormSelectDropdown,
  FormTextInput,
  Stack,
  TypeFace,
} from '@spooder/webui-component-library';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { buildKey, buildNodeValueKey } from '../../FormKeys';
import OscConditions from './OscConditions';
import ResponseSearchAndMatchCheatSheet from '../../eventCommand/response/ResponseSearchAndMatchCheatSheet';

interface OscTriggerNodeEditorProps {
  eventName: string;
  nodeIndex: number;
}

export default function OscTriggerNodeEditor(props: OscTriggerNodeEditorProps) {
  const { eventName, nodeIndex } = props;
  const { watch } = useFormContext();
  const [cheatSheetOpen, setCheatSheetOpen] = useState(false);

  const nodeValueKey = buildNodeValueKey(eventName, nodeIndex);
  const handleTypeKey = buildKey(nodeValueKey, 'handletype');
  const handleType = watch(handleTypeKey, 'trigger');

  return (
    <Stack spacing='medium'>
      <FormSelectDropdown
        formKey={handleTypeKey}
        label='Handle: '
        options={[
          { value: 'trigger', label: 'Trigger' },
          { value: 'toggle', label: 'Toggle' },
          { value: 'search', label: 'Search String' },
        ]}
      />
      {/* Address and Arg Count are edited inline on the node card. Rendering them here too
          would put duplicate DOM ids in the document (the shared Form* inputs derive their id
          from the form key), which breaks label/input association and makes the fields look
          unresponsive. Only the per-arg naming lives here. */}
      <OscArgOutputs nodeValueKey={nodeValueKey} />

      {handleType === 'toggle' ? (
        <>
          <OscConditions nodeValueKey={nodeValueKey} fieldName='condition_groups_on' label='Conditions On' />
          <OscConditions
            nodeValueKey={nodeValueKey}
            fieldName='condition_groups_off'
            label='Conditions Off'
          />
        </>
      ) : null}

      {handleType === 'trigger' ? (
        <OscConditions nodeValueKey={nodeValueKey} fieldName='condition_groups_on' label='Conditions' />
      ) : null}

      {handleType === 'search' ? (
        <Stack spacing='small'>
          <FormNumberInput width='5rem' label='Arg' formKey={buildKey(nodeValueKey, 'search', 'arg')} />
          <Columns spacing='small'>
            <FormTextInput
              width='100%'
              label='Command'
              formKey={buildKey(nodeValueKey, 'search', 'command')}
            />
            <Button icon={faQuestion} onClick={() => setCheatSheetOpen(!cheatSheetOpen)} />
          </Columns>
          <ResponseSearchAndMatchCheatSheet isOpen={cheatSheetOpen} />
          <OscConditions nodeValueKey={nodeValueKey} fieldName='condition_groups_on' label='Conditions' />
        </Stack>
      ) : null}
    </Stack>
  );
}

interface OscArgOutputsProps {
  nodeValueKey: string;
}

// Names and types the node's arg output ports. Lives in the inspector rather than the node's
// inline form because it's a variable-length list keyed off argCount, not a single field.
// These are display concerns only - the ports themselves are always arg0..argN-1 (see
// buildOscTriggerOutputs), so renaming here never disturbs existing edges.
function OscArgOutputs(props: OscArgOutputsProps) {
  const { nodeValueKey } = props;
  const { watch } = useFormContext();
  const argCount = Number(watch(buildKey(nodeValueKey, 'argCount'), 0)) || 0;

  if (argCount === 0) {
    return <TypeFace fontSize='small'>Set Arg Count on the node to name its outputs.</TypeFace>;
  }

  return (
    <Stack spacing='small'>
      {/* Only the names live here - each arg's type is picked on its output row on the node
          card. Rendering the type select in both places would duplicate its DOM id. */}
      {Array.from({ length: argCount }, (_, i) => (
        <FormTextInput
          key={i}
          width='100%'
          label={`Arg ${i} Name`}
          formKey={buildKey(nodeValueKey, 'argLabels', String(i))}
        />
      ))}
    </Stack>
  );
}
