import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { EventTriggerProps, OSCConditionType } from '../../../../Types';
import { buildTriggerKey, buildKey } from '../../FormKeys';
import OSCTriggerConditions from './OSCTriggerConditions';
import {
  Border,
  Box,
  Button,
  Columns,
  FormBoolSwitch,
  FormNumberInput,
  FormSelectDropdown,
  FormTextInput,
  Stack,
} from '@greysole/spooder-component-library';
import OSCTriggerCondition from './OSCTriggerConditionsValue';
import ResponseSearchAndMatchCheatSheet from '../../eventCommand/response/ResponseSearchAndMatchCheatSheet';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';

interface OSCCondition {
  type: OSCConditionType;
  value: string;
}

interface OSCTriggerObject {
  enabled: boolean;
  address: string;
  conditions: OSCCondition[];
}

export default function OSCTrigger(props: EventTriggerProps) {
  const { eventName } = props;
  const { watch } = useFormContext();

  const oscTriggerKey = buildTriggerKey(eventName, 'osc');
  const enabledKey = buildKey(oscTriggerKey, 'enabled');
  const enabled = watch(enabledKey, false);
  const addressKey = buildKey(oscTriggerKey, 'address');
  const handleTypeKey = buildKey(oscTriggerKey, 'handletype');
  const handleType = watch(handleTypeKey, 'trigger');

  if (!enabled) {
    return (
      <div className='osc-trigger'>
        <FormBoolSwitch label='OSC:' formKey={enabledKey} />
      </div>
    );
  }

  return (
    <Border>
      <Box width='100%' flexFlow='column' padding='small'>
        <FormBoolSwitch label='OSC:' formKey={enabledKey} />
        <Stack spacing='small' margin='small'>
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
          <OSCTriggerConditionsSelector eventName={eventName} handleType={handleType} />
        </Stack>
      </Box>
    </Border>
  );
}

function OSCTriggerConditionsSelector(props: { eventName: string; handleType: string }) {
  const { eventName, handleType } = props;
  const oscTriggerKey = buildTriggerKey(eventName, 'osc');
  const [cheatSheetOpen, setCheatSheetOpen] = useState(false);
  if (handleType === 'toggle') {
    return (
      <>
        <OSCTriggerConditions
          formKey='condition_groups_on'
          eventName={eventName}
          label='Conditions On'
        />
        <OSCTriggerConditions
          formKey='condition_groups_off'
          eventName={eventName}
          label='Conditions Off'
        />
      </>
    );
  } else if (handleType === 'trigger') {
    return (
      <OSCTriggerConditions
        formKey='condition_groups_on'
        eventName={eventName}
        label='Conditions'
      />
    );
  } else if (handleType === 'search') {
    return (
      <Stack spacing='small'>
        <FormNumberInput
          width='3rem'
          label='Arg'
          formKey={buildKey(oscTriggerKey, 'search', 'arg')}
        />
        <Columns spacing='small'>
          <FormTextInput
            width='100%'
            label='Command'
            formKey={buildKey(oscTriggerKey, 'search', 'command')}
          />
          <Button icon={faQuestion} onClick={() => setCheatSheetOpen(true)} />
        </Columns>
        <ResponseSearchAndMatchCheatSheet isOpen={cheatSheetOpen} />
        <OSCTriggerConditions
        formKey='condition_groups_on'
        eventName={eventName}
        label='Conditions'
      />
      </Stack>
    );
  }
}
