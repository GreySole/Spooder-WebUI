import { useFormContext } from 'react-hook-form';
import { buildEventKey, buildKey, EVENT_KEY, GROUP_KEY } from './FormKeys';
import React from 'react';
import {
  Stack,
  TypeFace,
  FormTextInput,
  FormSelectDropdown,
  FormNumberInput,
  FormBoolSwitch,
} from '@greysole/spooder-component-library';

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
  const descriptionKey = buildKey(eventKey, 'description');
  const groupKey = buildKey(eventKey, 'group');
  const cooldownKey = buildKey(eventKey, 'cooldown');

  return (
    <Stack spacing='medium' paddingTop='medium'>
      <TypeFace>Internal Name: {eventName}</TypeFace>
      <FormTextInput label='Name:' formKey={nameKey} />
      <FormTextInput label='Description:' formKey={descriptionKey} />
      <FormSelectDropdown label='Group:' formKey={groupKey} options={groupOptions} />
      <FormNumberInput label='Cooldown (Seconds):' formKey={cooldownKey} />
    </Stack>
  );
}
