import React from 'react';
import { useFormContext } from 'react-hook-form';
import FormBoolSwitch from '../../../../common/input/form/FormBoolSwitch';
import { EventTriggerProps, OSCConditionType, OSCHandleType } from '../../../../Types';
import { buildTriggerKey, buildKey } from '../../FormKeys';
import FormSelectDropdown from '../../../../common/input/form/FormSelectDropdown';
import FormTextInput from '../../../../common/input/form/FormTextInput';
import OSCTriggerConditions from './OSCTriggerConditions';

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

  const oscTriggerKey = buildTriggerKey(eventName, 'osc');
  const enabledKey = buildKey(oscTriggerKey, 'enabled');
  const addressKey = buildKey(oscTriggerKey, 'address');
  const handleTypeKey = buildKey(oscTriggerKey, 'handletype');

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
