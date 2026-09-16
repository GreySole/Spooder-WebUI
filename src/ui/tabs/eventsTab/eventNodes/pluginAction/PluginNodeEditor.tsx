import React from 'react';
import { useFormContext } from 'react-hook-form';
import { buildKey, buildNodeValueKey } from '../../FormKeys';
import usePlugins from '../../../../../app/hooks/usePlugins';
import {
  FormNumberInput,
  FormSelectDropdown,
  FormTextInput,
  Stack,
} from '@spooder/webui-component-library';
import CustomEventPluginNodeCommand from './CustomEventPluginNodeCommand';
import { KeyedObject } from '../../../../Types';

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
  const legacyEventName = watch(eventNameFormKey, '');
  const nestedEventName = watch(buildKey(nodeValueKey, 'event', 'name'), '');

  const durationFormKey = buildKey(nodeValueKey, 'duration');

  const { getPlugins, getPluginEventsForm } = usePlugins();
  const { data: plugins, isLoading: pluginsLoading, error: pluginsError } = getPlugins();
  const { data: pluginEventsForm, isLoading: pluginEventsFormLoading } =
    getPluginEventsForm(pluginName);

  if (pluginsLoading || pluginEventsFormLoading) {
    return null;
  }

  // A node saved before its plugin declared events-form.json (or one whose plain-text event
  // name was never one of that form's declared events, e.g. graphicboard's named graphics)
  // still carries its event under the old flat `eventname` field, with no `event` object at
  // all. CustomEventPluginNodeCommand only ever reads/writes the nested `event.name`, so
  // switching every node of a plugin to it the moment that plugin gains a form would hide
  // (and, on the next save, silently drop) whatever a legacy node already had configured -
  // exactly what EventPluginCommand's own `eCommand.event ?? eCommand.eventname` fallback on
  // the backend is written to tolerate. Keep showing the plain field for such a node; clearing
  // it is the escape hatch into the dynamic form.
  const usesCustomEventForm = pluginEventsForm != null && (!legacyEventName || nestedEventName);

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
      {usesCustomEventForm ? (
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
          <StopEventNameSelect formKey={stopEventFormKey} eventForm={pluginEventsForm} />
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

interface StopEventNameSelectProps {
  formKey: string;
  eventForm: KeyedObject;
}

// The backend (EventPluginCommand) reads stop_eventname as a plain event-name string - it
// has no support for the values/preprocessing payload CustomEventPluginNodeCommand writes
// under `${formKey}.event.name`/`.event.values` for the start event. So the stop event
// picker writes formKey itself directly rather than reusing that component.
function StopEventNameSelect(props: StopEventNameSelectProps) {
  const { formKey, eventForm } = props;

  const eventOptions = [{ label: 'None', value: '' }];
  for (let e in eventForm) {
    eventOptions.push({ label: eventForm[e].label, value: e });
  }

  return <FormSelectDropdown formKey={formKey} label='End Event Name:' options={eventOptions} />;
}
