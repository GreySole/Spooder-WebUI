import { useFormContext } from 'react-hook-form';
import FormBoolSwitch from '../../../common/input/form/FormBoolSwitch';
import { buildKey, buildTriggerKey } from '../../FormKeys';
import ChatTriggerCondition from './ChatTriggerCondition';
import FormTextInput from '../../../common/input/form/FormTextInput';

interface ChatTriggerProps {
  eventName: string;
}

export default function ChatTrigger(props: ChatTriggerProps) {
  const { eventName } = props;
  const { watch, register } = useFormContext();

  const chatTriggerKey = buildTriggerKey(eventName, 'chat');

  const enabledKey = buildKey(chatTriggerKey, 'enabled');
  const enabled = watch(enabledKey, false);

  const searchKey = buildKey(chatTriggerKey, 'search');
  const search = watch(searchKey, false);

  const commandKey = buildKey(chatTriggerKey, 'command');
  const command = watch(commandKey, '');

  if (!enabled) {
    return (
      <div className='chat-trigger'>
        <FormBoolSwitch label='Chat:' formKey={enabledKey} />
      </div>
    );
  }

  return (
    <div className='chat-trigger'>
      <FormBoolSwitch label='Chat:' formKey={enabledKey} />
      <ChatTriggerCondition eventName={eventName} />
      <FormBoolSwitch
        label='Search and Match in Message:'
        formKey={searchKey}
      />
      <FormTextInput label='Command:' formKey={commandKey}/>
    </div>
  );
}
