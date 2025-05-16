import React from 'react';
import { useFormContext } from 'react-hook-form';
import { buildKey } from '../../FormKeys';
import usePlugins from '../../../../../app/hooks/usePlugins';
import { FormSelectDropdown } from '@greysole/spooder-component-library';

interface ModTargetProps {
  formKey: string;
  targetType: string;
}

export default function ModTarget(props: ModTargetProps) {
  const { formKey, targetType } = props;
  const { watch } = useFormContext();
  const { getPlugins } = usePlugins();
  const { data: plugins, isLoading: pluginsLoading, error: pluginsError } = getPlugins();
  const events = watch('events');

  console.log('MOD TARGET', targetType);
  if (targetType === 'event') {
    const eventTargetOptions = [{ value: '', label: 'None' }].concat(
      Object.keys(events)
        .map((event) => ({
          value: event,
          label: events[event].name,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    );

    return <FormSelectDropdown options={eventTargetOptions} formKey={formKey} label='Target' />;
  } else if (targetType === 'plugin') {
    if (pluginsLoading) {
      return null;
    }
    const pluginTargetOptions = [{ value: '', label: 'None' }].concat(
      Object.keys(plugins!)
        .sort()
        .map((plugin) => ({
          value: plugin,
          label: plugins![plugin].name,
        })),
    );

    return <FormSelectDropdown options={pluginTargetOptions} formKey={formKey} label='Target' />;
  }

  return null;
}
