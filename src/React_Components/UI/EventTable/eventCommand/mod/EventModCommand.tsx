import React from 'react';
import { useFormContext } from 'react-hook-form';
import { buildCommandKey, buildKey } from '../../FormKeys';
import usePlugins from '../../../../../app/hooks/usePlugins';
import { EventCommandProps } from '../../../../Types';

export default function EventModCommand(props: EventCommandProps) {
  const { eventName, commandIndex } = props;
  const formKey = buildCommandKey(eventName, commandIndex);

  const { watch, register, getValues } = useFormContext();

  const modFunctionFormKey = buildKey(formKey, 'function');
  const modFunction = watch(modFunctionFormKey, '');

  const targetFormKey = buildKey(formKey, 'target');
  const target = watch(targetFormKey, '');

  const targetTypeFormKey = buildKey(formKey, 'targettype');
  const targetType = watch(targetTypeFormKey, '');

  const eventTypeFormKey = buildKey(formKey, 'etype');
  const eType = watch(eventTypeFormKey, '');

  const durationFormKey = buildKey(formKey, 'duration');
  const duration = watch(durationFormKey, 0);

  const delayFormKey = buildKey(formKey, 'delay');
  const delay = watch(delayFormKey, 0);

  const { getPlugins } = usePlugins();
  const { data: plugins, isLoading: pluginsLoading, error: pluginsError } = getPlugins();
  if (pluginsLoading) {
    return null;
  }

  let targetField = null;
  let targetOptions = [<option value='all'>All</option>];
  if (targetType == 'event') {
    let sortedKeys = Object.keys(getValues('events')).sort();

    for (let s in sortedKeys) {
      targetOptions.push(<option value={sortedKeys[s]}>{sortedKeys[s]}</option>);
    }
  } else if (targetType == 'plugin') {
    targetOptions = [<option value={''}>Choose Plugin</option>];
    if (plugins != null) {
      let sortedPlugins: any[] = Object.values(plugins).sort();
      for (let p in sortedPlugins) {
        targetOptions.push(<option value={sortedPlugins[p]}>{sortedPlugins[p]}</option>);
      }
    }
  }
  if (targetType != 'all') {
    targetField = (
      <label>
        Target:
        <select value={target} {...register(targetFormKey)}>
          {targetOptions}
        </select>
      </label>
    );
  }

  const targetTypeElement =
    modFunction != 'commercial' ? (
      <label>
        Target Type:
        <select value={targetType} {...register(targetTypeFormKey)}>
          <option value='all'>Everything</option>
          <option value='event'>Event</option>
          <option value='plugin'>Plugin</option>
        </select>
      </label>
    ) : null;

  const handleTypeElement =
    modFunction != 'commercial' ? (
      <label>
        Handle Type:
        <select value={eType} {...register(eventTypeFormKey)}>
          <option value='toggle'>Toggle</option>
          <option value='timed'>Timed</option>
        </select>
      </label>
    ) : null;

  const mduration =
    eType == 'timed' ? (
      <label>
        Duration (Seconds):
        <input type='number' value={duration} {...register(durationFormKey)} />
      </label>
    ) : null;

  return (
    <div className='command-props software'>
      <h3>
        Moderation chat commands are already built into Spooder. This is mainly so you can hook an
        OSC trigger for quick moderation actions.
      </h3>
      <label>
        Function:
        <select value={modFunction} {...register(modFunctionFormKey)}>
          <option value='lock'>Lock/Unlock</option>
          <option value='spamguard'>Spam Guard</option>
          <option value='stop'>Stop Event</option>
        </select>
      </label>
      {targetTypeElement}
      {targetField}
      {handleTypeElement}
      {mduration}
      <label>
        Delay (Milliseconds):
        <input value={delay} type='number' {...register(delayFormKey)} />
      </label>
    </div>
  );
}
