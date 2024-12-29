import { useFormContext } from 'react-hook-form';
import { buildEventKey, buildKey, EVENT_KEY, GROUP_KEY } from './FormKeys';
import React from 'react';
import FormBoolSwitch from '../../common/input/form/FormBoolSwitch';
import FormNumberInput from '../../common/input/form/FormNumberInput';
import FormSelectDropdown from '../../common/input/form/FormSelectDropdown';
import FormTextInput from '../../common/input/form/FormTextInput';
import Stack from '../../common/layout/Stack';
import TypeFace from '../../common/layout/TypeFace';

interface EventGeneralProps {
  eventName: string;
}

export default function EventGeneral(props: EventGeneralProps) {
  const { eventName } = props;
  const { watch } = useFormContext();
  const groups = watch(GROUP_KEY);
  const groupOptions = groups.map((groupName: string) => ({ label: groupName, value: groupName }));

  const eventKey = buildEventKey(eventName);
  const nameKey = buildKey(eventKey, 'name');
  const name = watch(nameKey);
  const descriptionKey = buildKey(eventKey, 'description');
  const groupKey = buildKey(eventKey, 'group');
  const cooldownKey = buildKey(eventKey, 'cooldown');
  const chatNotificationKey = buildKey(eventKey, 'chatnotification');
  const cooldownNotificationKey = buildKey(eventKey, 'cooldownnotification');

  return (
    <Stack spacing='medium' paddingTop='medium'>
      <TypeFace>Internal Name: {eventName}</TypeFace>
      <FormTextInput label='Name:' formKey={nameKey} />
      <FormTextInput label='Description:' formKey={descriptionKey} />
      <FormSelectDropdown label='Event Type:' formKey={groupKey} options={groupOptions} />
      <FormNumberInput label='Duration (Seconds):' formKey={cooldownKey} />
      <FormBoolSwitch label='Notify Activation in Chat:' formKey={chatNotificationKey} />
      <FormBoolSwitch
        label='Tell How Much Time Left for Cooldown:'
        formKey={cooldownNotificationKey}
      />
    </Stack>
  );
}
