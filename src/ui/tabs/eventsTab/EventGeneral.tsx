import { useFormContext } from 'react-hook-form';
import { buildGraphKey, buildKey, GROUP_KEY } from './FormKeys';
import React from 'react';
import {
  Stack,
  TypeFace,
  FormTextInput,
  FormSelectDropdown,
  FormNumberInput,
  FormBoolSwitch,
} from '@spooder/webui-component-library';

interface EventGeneralProps {
  eventName: string;
}

export default function EventGeneral(props: EventGeneralProps) {
  const { eventName } = props;
  const { watch } = useFormContext();
  const groups = watch(GROUP_KEY);
  const groupOptions = groups.map((groupName: string) => ({ label: groupName, value: groupName }));

  const graphKey = buildGraphKey(eventName);
  const nameKey = buildKey(graphKey, 'name');
  const descriptionKey = buildKey(graphKey, 'description');
  const groupKey = buildKey(graphKey, 'group');
  const cooldownKey = buildKey(graphKey, 'cooldown');

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
