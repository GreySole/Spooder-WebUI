import { faCommentDots, faPlug, faLock, faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TimelineRow, Timeline } from '@xzdarcy/react-timeline-editor';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { buildKey, buildCommandKey, EVENT_KEY } from '../FormKeys';
import { DiscordIcon, ObsIcon } from '../../../common/icons/icons';

interface EventCommandTimelineProps {
  eventName: string;
}

export default function EventCommandTimeline(props: EventCommandTimelineProps) {
  const { eventName } = props;
  let maxDuration = 1;
  const [timelineZoom, setTimelineZoom] = useState<number>(1);
  const { setValue, watch } = useFormContext();
  const eventCommands = watch(`${EVENT_KEY}.${eventName}.commands`, []);

  const timelineData = [] as TimelineRow[];
  const timelineEffectData = {
    timed: {
      id: 'timed',
      name: 'Timed',
    },
    nottimed: {
      id: 'nottimed',
      name: 'nottimed',
    },
  };

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

    const delay = isNaN(eventCommands[c].delay) ? 0 : eventCommands[c].delay;
    const duration = isNaN(eventCommands[c].duration) ? 1 : eventCommands[c].duration;

    timelineData.push({
      id: c.toString(),
      actions: [
        {
          id: id,
          start: delay / 1000,
          end: eventCommands[c].etype == 'timed' ? delay / 1000 + duration : delay / 1000 + 1,
          effectId: eventCommands[c].etype == 'timed' ? 'timed' : 'nottimed',
        },
      ],
    });
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
      const commandIndex = parseInt(frames[t].id);
      const newDelayValue = Math.floor(frames[t].actions[0].start * 1000);
      const newDurationValue = (
        Math.round((frames[t].actions[0].end - frames[t].actions[0].start) / 0.05) * 0.05
      ).toFixed(2);

      const delayFormKey = buildKey(buildCommandKey(eventName, commandIndex), 'delay');
      const durationFormKey = buildKey(buildCommandKey(eventName, commandIndex), 'duration');

      setValue(delayFormKey, newDelayValue);
      setValue(durationFormKey, newDurationValue);
    }
  }

  return (
    <>
      <Timeline
        editorData={timelineData}
        effects={timelineEffectData}
        onChange={onUpdateTimeline}
        autoScroll={true}
        scale={timelineZoom}
        dragLine={false}
        getActionRender={(action: any, row) => {
          switch (eventCommands[0].type) {
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
                  <img width={25} height={25} src={ObsIcon} />
                  <label>{action.id}</label>
                </div>
              );
            case 'discord':
              return (
                <div className='prompt'>
                  <img width={25} height={25} src={DiscordIcon} />
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
      {timelineZoomInput}
    </>
  );
}
