import React from 'react';
import { useFormContext } from 'react-hook-form';
import usePlugins from '../../../../../app/hooks/usePlugins';
import { FormSelectDropdown } from '@greysole/spooder-component-library';
import { GRAPH_KEY } from '../../FormKeys';

interface ModNodeTargetProps {
  formKey: string;
  targetType: string;
}

export default function ModNodeTarget(props: ModNodeTargetProps) {
  const { formKey, targetType } = props;
  const { watch } = useFormContext();
  const { getPlugins } = usePlugins();
  const { data: plugins, isLoading: pluginsLoading } = getPlugins();
  const graphs = watch(GRAPH_KEY);

  if (targetType === 'event') {
    const eventTargetOptions = [{ value: '', label: 'None' }].concat(
      Object.keys(graphs)
        .map((eventId) => ({
          value: eventId,
          label: graphs[eventId].name,
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
