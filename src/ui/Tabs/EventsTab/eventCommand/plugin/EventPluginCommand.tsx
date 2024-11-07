import React from 'react';
import { useFormContext } from 'react-hook-form';
import { buildCommandKey, buildKey } from '../../FormKeys';
import usePlugins from '../../../../../app/hooks/usePlugins';
import { EventCommandProps } from '../../../../Types';
import FormTextInput from '../../../../common/input/form/FormTextInput';
import CustomEventPluginCommand from './CustomEventPluginCommand';
import FormSelectDropdown from '../../../../common/input/form/FormSelectDropdown';

export default function EventPluginCommand(props: EventCommandProps) {
  const { eventName, commandIndex } = props;
  const { watch, register } = useFormContext();

  const formKey = buildCommandKey(eventName, commandIndex);

  const pluginNameFormKey = buildKey(formKey, 'pluginname');
  const pluginName = watch(pluginNameFormKey, '');

  const stopEventFormKey = buildKey(formKey, 'stop_eventname');
  const stopEventName = watch(stopEventFormKey, '');

  const eventTypeFormKey = buildKey(formKey, 'etype');
  const eType = watch(eventTypeFormKey, '');

  const eventNameFormKey = buildKey(formKey, 'eventname');
  const pluginEventName = watch(eventNameFormKey, 0);

  const durationFormKey = buildKey(formKey, 'duration');
  const duration = watch(durationFormKey, 0);

  const delayFormKey = buildKey(formKey, 'delay');
  const delay = watch(delayFormKey, 0);

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
    <div className='command-props plugin'>
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
        <CustomEventPluginCommand
          formKey={formKey}
          pluginName={pluginName}
          eventForm={pluginEventsForm}
        />
      ) : (
        <FormTextInput label='Event Name:' formKey={eventNameFormKey} />
      )}
      {eType == 'timed' ? (
        pluginEventsForm != null ? (
          <CustomEventPluginCommand
            formKey={stopEventFormKey}
            pluginName={pluginName}
            eventForm={pluginEventsForm}
          />
        ) : (
          <FormTextInput label='End Event Name:' formKey={stopEventFormKey} />
        )
      ) : null}
      {eType == 'timed' ? (
        <label>
          Duration (Seconds):
          <input value={duration} type='number' {...register(durationFormKey)} />
        </label>
      ) : null}
      <label>
        Delay (Milliseconds):
        <input value={delay} type='number' {...register(delayFormKey)} />
      </label>
    </div>
  );
}
