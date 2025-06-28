import React from 'react';
import { useFormContext } from 'react-hook-form';
import { EventTriggerProps, OSCConditionType } from '../../../../Types';
import { buildTriggerKey, buildKey } from '../../FormKeys';
import OSCTriggerConditions from './OSCTriggerConditions';
import {
  Border,
  Box,
  FormBoolSwitch,
  FormSelectDropdown,
  FormTextInput,
  Stack,
} from '@greysole/spooder-component-library';

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
          {handleType === 'toggle' ? (
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
          ) : (
            <OSCTriggerConditions
              formKey='condition_groups_on'
              eventName={eventName}
              label='Conditions'
            />
          )}
        </Stack>
      </Box>
    </Border>
  );
}
