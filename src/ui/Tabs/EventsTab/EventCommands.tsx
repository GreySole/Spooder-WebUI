import React from 'react';
import { faCommentDots, faLock, faNetworkWired, faPlug } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import EventOBSCommand from './eventCommand/obs/EventOBSCommand';
import EventSoftwareCommand from './eventCommand/software/EventSoftwareCommand';
import EventPluginCommand from './eventCommand/plugin/EventPluginCommand';
import EventResponseCommand from './eventCommand/response/EventResponseCommand';
import EventModCommand from './eventCommand/mod/EventModCommand';
import { useState } from 'react';
import { Timeline } from '@xzdarcy/react-timeline-editor';
import EventAddCommand from './eventCommand/EventAddCommand';
import { buildCommandKey, buildKey } from './FormKeys';
import { useFormContext } from 'react-hook-form';
const discordIcon = '../../icons/discord.svg';
const obsIcon = '../../icons/obs.svg';

interface EventCommandsProps {
  eventName: string;
  eventCommands: any[];
}

export default function EventCommands(props: EventCommandsProps) {
  const { eventName, eventCommands } = props;
  let commandElements = [];
  let maxDuration = 1;
  const [timelineZoom, setTimelineZoom] = useState<number>(1);
  const [timelineData, setTimelineData] = useState([]);
  const [timelineEffectData, setTimelineEffectData] = useState({
    timed: {
      id: 'timed',
      name: 'Timed',
    },
    nottimed: {
      id: 'nottimed',
      name: 'nottimed',
    },
  });
  const { setValue } = useFormContext();

  for (let c = 0; c < eventCommands.length; c++) {
    maxDuration = Math.max(eventCommands[c].delay / 1000, eventCommands[c].duration);
    if (isNaN(maxDuration)) {
      maxDuration = 1;
    }

    let id = eventCommands[c].type + '-' + c;
    if (eventCommands[c].type == 'software') {
      id =
        eventCommands[c].address + '-' + eventCommands[c].valueOn + '|' + eventCommands[c].valueOff;
    } else if (eventCommands[c].type == 'obs' || eventCommands[c].type == 'mod') {
      id = eventCommands[c].function;
    }

    let delay = isNaN(eventCommands[c].delay) ? 0 : eventCommands[c].delay;
    let duration = isNaN(eventCommands[c].duration) ? 1 : eventCommands[c].duration;

    /*setTimelineData([
      {
        id: c,
        actions: [
          {
            id: id,
            start: delay / 1000,
            end: eventCommands[c].etype == 'timed' ? delay / 1000 + duration : delay / 1000 + 1,
            eventname: eventName,
            eventtype: eventCommands[c].type,
            commandindex: c,
            effectId: eventCommands[c].etype == 'timed' ? 'timed' : 'nottimed',
          },
        ],
      },
    ] as any);*/

    let element = null;
    switch (eventCommands[c].type) {
      case 'response':
        element = <EventResponseCommand eventName={eventName} commandIndex={c} />;
        break;
      case 'plugin':
        element = <EventPluginCommand eventName={eventName} commandIndex={c} />;
        break;
      case 'software':
        element = <EventSoftwareCommand eventName={eventName} commandIndex={c} />;
        break;
      case 'obs':
        element = <EventOBSCommand eventName={eventName} commandIndex={c} />;
        break;
      case 'mod':
        element = <EventModCommand eventName={eventName} commandIndex={c} />;
        break;
    }

    let typeLabel = <div>{eventCommands[c].type}</div>;

    commandElements.push(
      <div className='command-fields' key={c}>
        <label>
          {typeLabel}
          {element}
        </label>

        <div className='command-actions'>{<FontAwesomeIcon icon='trash' />}</div>
      </div>,
    );
  }

  let timelineZoomInput = (
    <input
      type='range'
      min={1}
      max={120}
      value={timelineZoom}
      className='timeline-zoom-slider'
      //style={{ width: '70%' }}
      onChange={(e) => setTimelineZoom(parseFloat(e.target.value))}
    />
  );

  function onUpdateTimeline(frames: any) {
    for (let t in frames) {
      const newDelayValue = Math.floor(frames[t].actions[0].start * 1000);
      const newDurationValue = (
        Math.round((frames[t].actions[0].end - frames[t].actions[0].start) / 0.05) * 0.05
      ).toFixed(2);

      const delayFormKey = buildKey(
        buildCommandKey(eventName, frames[t].actions[0].commandindex),
        'delay',
      );
      const durationFormKey = buildKey(
        buildCommandKey(eventName, frames[t].actions[0].commandindex),
        'duration',
      );

      eventCommands[frames[t].actions[0].commandindex].delay = newDelayValue;
      eventCommands[frames[t].actions[0].commandindex].duration = newDurationValue;
      setValue(delayFormKey, newDelayValue);
      setValue(durationFormKey, newDurationValue);
    }
  }

  function addCommand(type: string) {}

  return (
    <label className='field-section'>
      Commands:
      <Timeline
        // style={{ width: '75%', height: '200px' }}
        editorData={timelineData}
        effects={timelineEffectData}
        onChange={onUpdateTimeline}
        autoScroll={true}
        scale={timelineZoom}
        dragLine={true}
        getActionRender={(action: any, row) => {
          switch (action.eventtype) {
            case 'response':
              return (
                <div className='prompt'>
                  <FontAwesomeIcon icon={faCommentDots} size={'2x'} />
                </div>
              );
            case 'plugin':
              return (
                <div className='prompt'>
                  <FontAwesomeIcon icon={faPlug} size={'lg'} />
                  <label>{action.id}</label>
                </div>
              );
            case 'mod':
              return (
                <div className='prompt'>
                  <FontAwesomeIcon icon={faLock} size={'lg'} />
                  <label>{action.id}</label>
                </div>
              );
            case 'obs':
              return (
                <div className='prompt'>
                  <img width={25} height={25} src={obsIcon} />
                  <label>{action.id}</label>
                </div>
              );
            case 'discord':
              return (
                <div className='prompt'>
                  <img width={25} height={25} src={discordIcon} />
                  <label>{action.id}</label>
                </div>
              );
            default:
              return (
                <div className='prompt'>
                  <FontAwesomeIcon icon={faNetworkWired} size={'lg'} />
                  <label>{action.id}</label>
                </div>
              );
          }
        }}
      />
      {timelineZoom}
      {commandElements}
      <EventAddCommand onClickAdd={() => addCommand('software')} />
    </label>
  );
}
