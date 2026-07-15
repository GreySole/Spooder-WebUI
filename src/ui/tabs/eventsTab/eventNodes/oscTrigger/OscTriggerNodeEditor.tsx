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
} from '@greysole/spooder-component-library';
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
  const addressKey = buildKey(nodeValueKey, 'address');
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
      <FormTextInput width='100%' label='Address: ' formKey={addressKey} />

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
