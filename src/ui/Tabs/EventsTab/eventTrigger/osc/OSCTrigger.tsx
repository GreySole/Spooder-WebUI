import React from 'react';
import { useFormContext } from 'react-hook-form';
import { EventTriggerProps, OSCConditionType } from '../../../../Types';
import { buildTriggerKey, buildKey } from '../../FormKeys';
import OSCTriggerConditions from './OSCTriggerConditions';
import {
  FormBoolSwitch,
  FormSelectDropdown,
  FormTextInput,
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

  if (!enabled) {
    return (
      <div className='osc-trigger'>
        <FormBoolSwitch label='OSC:' formKey={enabledKey} />
      </div>
    );
  }

  return (
    <div className='osc-trigger'>
      <FormBoolSwitch label='OSC:' formKey={enabledKey} />
      <div className='event-trigger'>
        <FormSelectDropdown
          formKey={handleTypeKey}
          label='Handle: '
          options={[
            { value: 'trigger', label: 'Trigger' },
            { value: 'toggle', label: 'Toggle' },
            { value: 'search', label: 'Search String' },
          ]}
        />
        <FormTextInput label='Address: ' formKey={addressKey} />
        <OSCTriggerConditions eventName={eventName} />
      </div>
    </div>
  );
}
