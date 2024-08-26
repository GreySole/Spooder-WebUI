import { useFormContext } from 'react-hook-form';
import { buildKey, buildTriggerKey } from '../../FormKeys';
import FormBoolSwitch from '../../../common/input/form/FormBoolSwitch';

interface ChatTriggerConditionProps {
  eventName: string;
}

export default function ChatTriggerCondition(props: ChatTriggerConditionProps) {
  const { eventName } = props;
  const { watch, register } = useFormContext();

  const chatTriggerKey = buildTriggerKey(eventName, 'chat');
  const chatTriggerConditionKey = buildKey(chatTriggerKey, 'condition');

  const conditionBroadcasterKey = buildKey(chatTriggerConditionKey, 'broadcaster');
  const broadcaster = watch(conditionBroadcasterKey, 'false');

  const conditionModKey = buildKey(chatTriggerConditionKey, 'mod');
  const mod = watch(conditionModKey, false);

  const conditionSubKey = buildKey(chatTriggerConditionKey, 'sub');
  const sub = watch(conditionSubKey, false);

  const conditionVipKey = buildKey(chatTriggerConditionKey, 'vip');
  const vip = watch(conditionVipKey, false);

  return (
    <div className='bool-group'>
      <FormBoolSwitch
        label='Broadcaster Only:'
        formKey={conditionBroadcasterKey}
      />
      <FormBoolSwitch label='Mod Only:' formKey={conditionModKey} />
      <FormBoolSwitch label='Subscriber Only:' formKey={conditionSubKey} />
      <FormBoolSwitch label='VIP Only:' formKey={conditionVipKey} />
    </div>
  );
}
