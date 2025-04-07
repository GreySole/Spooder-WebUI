import { faCommentDots, faPlug, faLock, faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import { TimelineRow, Timeline } from '@xzdarcy/react-timeline-editor';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { buildKey, buildCommandKey, EVENT_KEY } from '../FormKeys';
import { DiscordIcon, ObsIcon } from '../../../common/icons/icons';
import { Box, getIcon, Slider, TypeFace } from '@greysole/spooder-component-library';

interface EventCommandTimelineProps {
  eventName: string;
}

export default function EventCommandTimeline(props: EventCommandTimelineProps) {
  const { eventName } = props;
  let maxDuration = 1;
  const [timelineZoom, setTimelineZoom] = useState<number>(0.5);
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
    maxDuration = Math.max(eventCommands[c].delay / 1000 + eventCommands[c].duration, maxDuration);
    if (isNaN(maxDuration)) {
      maxDuration = 1;
    }

    const id = eventCommands[c].type + '-' + c;

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

  const timelineZoomSlider = (
    <Slider orientation='horizontal' step={0.01} value={timelineZoom} onChange={setTimelineZoom} />
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
        scale={timelineZoom * maxDuration}
        dragLine={true}
        gridSnap={true}
        getActionRender={(action: any, row) => {
          if (eventCommands.length == 0) {
            return <></>;
          }
          const etypeFromId = action.id.split('-')[0];
          switch (etypeFromId) {
            case 'response':
              return (
                <Box height='100%' justifyContent='center' alignItems='center'>
                  <TypeFace textAlign='center'>{getIcon(faCommentDots, true, 'large')}</TypeFace>
                </Box>
              );
            case 'plugin':
              return (
                <Box height='100%' justifyContent='center' alignItems='center'>
                  <TypeFace textAlign='center'>{getIcon(faPlug, true, 'large')}</TypeFace>
                </Box>
              );
            case 'mod':
              return (
                <Box height='100%' justifyContent='center' alignItems='center'>
                  <TypeFace textAlign='center'>{getIcon(faLock, true, 'large')}</TypeFace>
                </Box>
              );
            case 'obs':
              return (
                <Box height='100%' justifyContent='center' alignItems='center'>
                  <TypeFace textAlign='center'>{getIcon(ObsIcon, true, 'large')}</TypeFace>
                </Box>
              );
            case 'discord':
              return (
                <Box height='100%' justifyContent='center' alignItems='center'>
                  <TypeFace textAlign='center'>{getIcon(DiscordIcon, true, 'large')}</TypeFace>
                </Box>
              );
            default:
              return (
                <Box height='100%' justifyContent='center' alignItems='center'>
                  <TypeFace textAlign='center'>{getIcon(faNetworkWired, true, 'large')}</TypeFace>
                </Box>
              );
          }
        }}
      />
      {timelineZoomSlider}
    </>
  );
}
