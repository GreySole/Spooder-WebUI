import React from 'react';
import { useFormContext } from 'react-hook-form';
import { buildKey, buildNodeValueKey } from '../../FormKeys';
import usePlugins from '../../../../../app/hooks/usePlugins';
import {
  FormNumberInput,
  FormSelectDropdown,
  FormTextInput,
  Stack,
} from '@greysole/spooder-component-library';
import CustomEventPluginNodeCommand from './CustomEventPluginNodeCommand';

interface PluginNodeEditorProps {
  eventName: string;
  nodeIndex: number;
}

export default function PluginNodeEditor(props: PluginNodeEditorProps) {
  const { eventName, nodeIndex } = props;
  const { watch } = useFormContext();

  const nodeValueKey = buildNodeValueKey(eventName, nodeIndex);

  const pluginNameFormKey = buildKey(nodeValueKey, 'pluginname');
  const pluginName = watch(pluginNameFormKey, '');

  const stopEventFormKey = buildKey(nodeValueKey, 'stop_eventname');

  const eventTypeFormKey = buildKey(nodeValueKey, 'etype');
  const eType = watch(eventTypeFormKey, '');

  const eventNameFormKey = buildKey(nodeValueKey, 'eventname');

  const durationFormKey = buildKey(nodeValueKey, 'duration');

  const { getPlugins, getPluginEventsForm } = usePlugins();
  const { data: plugins, isLoading: pluginsLoading, error: pluginsError } = getPlugins();
  const { data: pluginEventsForm, isLoading: pluginEventsFormLoading } =
    getPluginEventsForm(pluginName);

  if (pluginsLoading || pluginEventsFormLoading) {
    return null;
  }

  let pluginOptions = [{ label: 'None', value: '' }];
  if (plugins != null) {
    let sortedPlugins: any[] = Object.keys(plugins).sort();
    for (let p in sortedPlugins) {
      pluginOptions.push({ label: plugins[sortedPlugins[p]].name, value: sortedPlugins[p] });
    }
  }

  return (
    <Stack spacing='small'>
      <FormSelectDropdown formKey={pluginNameFormKey} label='Plugin:' options={pluginOptions} />
      <FormSelectDropdown
        formKey={eventTypeFormKey}
        label='Event Type:'
        options={[
          { label: 'Timed', value: 'timed' },
          { label: 'One Shot', value: 'oneshot' },
        ]}
      />
      {pluginEventsForm != null ? (
        <CustomEventPluginNodeCommand
          formKey={nodeValueKey}
          pluginName={pluginName}
          eventForm={pluginEventsForm}
        />
      ) : (
        <FormTextInput label='Event Name:' formKey={eventNameFormKey} />
      )}
      {eType == 'timed' ? (
        pluginEventsForm != null ? (
          <CustomEventPluginNodeCommand
            formKey={stopEventFormKey}
            pluginName={pluginName}
            eventForm={pluginEventsForm}
          />
        ) : (
          <FormTextInput label='End Event Name:' formKey={stopEventFormKey} />
        )
      ) : null}
      {eType == 'timed' ? (
        <FormNumberInput label='Duration (Seconds):' formKey={durationFormKey} />
      ) : null}
    </Stack>
  );
}
