import React from 'react';
import { useFormContext } from 'react-hook-form';
import { buildCommandKey, buildKey } from '../../FormKeys';
import usePlugins from '../../../../../app/hooks/usePlugins';
import { EventCommandProps } from '../../../../Types';

export default function EventPluginCommand(props: EventCommandProps) {
  const { eventName, commandIndex } = props;
  const formKey = buildCommandKey(eventName, commandIndex);

  const { watch, register } = useFormContext();

  const stopEventFormKey = buildKey(formKey, 'stop_eventname');
  const stopEventName = watch(stopEventFormKey, '');

  const pluginNameFormKey = buildKey(formKey, 'pluginname');
  const pluginName = watch(pluginNameFormKey, '');

  const eventTypeFormKey = buildKey(formKey, 'etype');
  const eType = watch(eventTypeFormKey, '');

  const eventNameFormKey = buildKey(formKey, 'eventname');
  const pluginEventName = watch(eventNameFormKey, 0);

  const durationFormKey = buildKey(formKey, 'duration');
  const duration = watch(durationFormKey, 0);

  const delayFormKey = buildKey(formKey, 'delay');
  const delay = watch(delayFormKey, 0);

  const { getPlugins } = usePlugins();
  const { data: plugins, isLoading: pluginsLoading, error: pluginsError } = getPlugins();
  if (pluginsLoading) {
    return null;
  }

  let pluginOptions = [<option value={''}>Choose Plugin</option>];
  if (plugins != null) {
    let sortedPlugins: any[] = Object.values(plugins).sort();
    for (let p in sortedPlugins) {
      pluginOptions.push(<option value={sortedPlugins[p]}>{sortedPlugins[p]}</option>);
    }
  }

  return (
    <div className='command-props plugin'>
      <label>
        Plugin:
        <select value={pluginName} {...register(pluginNameFormKey)}>
          {pluginOptions}
        </select>
      </label>
      <label>
        Event Type:
        <select value={eType} {...register(eventTypeFormKey)}>
          <option value='timed'>Timed</option>
          <option value='oneshot'>One Shot</option>
        </select>
      </label>
      <label>
        Event Name:
        <input type='text' value={pluginEventName} {...register(eventNameFormKey)} />
      </label>
      {eType == 'timed' ? (
        <label>
          End Event Name:
          <input type='text' value={stopEventName} {...register(stopEventFormKey)} />
        </label>
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
