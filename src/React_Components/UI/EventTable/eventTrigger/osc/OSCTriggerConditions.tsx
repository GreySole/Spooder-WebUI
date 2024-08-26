import { useFormContext } from 'react-hook-form';
import { EventTriggerProps, OSCConditionType, OSCHandleType } from '../../../../Types';
import { buildKey, buildTriggerKey } from '../../FormKeys';
import FormSelectDropdown from '../../../common/input/form/FormSelectDropdown';
import FormTextInput from '../../../common/input/form/FormTextInput';

interface TriggerCondition {
  formKey: string;
  index: number;
}

function OSCTriggerCondition(props: TriggerCondition) {
  const { formKey, index } = props;
  const { watch } = useFormContext();

  const conditionKey = buildKey(formKey, `${index}`, 'condition');
  const valueKey = buildKey(formKey, `${index}`, 'value');

  return (
    <div className='osc-trigger-condition'>
      <FormSelectDropdown
        label={`Condition ${index}`}
        formKey={conditionKey}
        options={[
          { value: OSCConditionType.equal, label: 'Equal to' },
          { value: OSCConditionType.notEqual, label: 'Not equal to' },
          { value: OSCConditionType.greaterThanOrEqual, label: 'Greater than or equal to' },
          { value: OSCConditionType.lessThanOrEqual, label: 'Less than or equal to' },
          { value: OSCConditionType.greaterThan, label: 'Greater than' },
          { value: OSCConditionType.lessThan, label: 'Less than' },
        ]}
      />
      <FormTextInput formKey={valueKey} label={`Value ${index}`} />
    </div>
  );
}

export default function OSCTriggerConditions(props: EventTriggerProps) {
  const { eventName } = props;
  const { watch } = useFormContext();

  const oscTriggerKey = buildTriggerKey(eventName, 'osc');

  const handleTypeKey = buildKey(oscTriggerKey, 'handletype');
  const handleType = watch(handleTypeKey, OSCHandleType.trigger);

  const conditionKey = buildKey(oscTriggerKey, 'conditions');
  const conditions = watch(conditionKey, []);

  return (
    <div className='osc-trigger-conditions'>
      {conditions.map((condition: any, index: number) => {
        <OSCTriggerCondition formKey={conditionKey} index={index} />;
      })}
    </div>
  );
}
