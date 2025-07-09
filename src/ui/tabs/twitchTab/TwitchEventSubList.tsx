import {
  Border,
  Box,
  Button,
  Expandable,
  Stack,
  TypeFace,
} from '@greysole/spooder-component-library';
import React from 'react';
import useTwitch from '../../../app/hooks/useTwitch';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function TwitchEventSubList() {
  const { getTwitchConfig, getEventSubs, getDeleteEventSub } = useTwitch();
  const { data: twitchConfig, isLoading: twitchConfigLoading } = getTwitchConfig();
  const { data: eventsubs, isLoading: eventsubsLoading } = getEventSubs();
  const { deleteEventSub } = getDeleteEventSub();
  let subTable = [];
  for (let event in eventsubs) {
    for (let sub in eventsubs[event]) {
      let conditionTable = [];
      for (let c in eventsubs[event][sub].condition) {
        conditionTable.push(
          <Box key={c} marginLeft='medium'>
            <TypeFace>
              <TypeFace fontWeight='bold'>{c}: </TypeFace>
              {eventsubs[event][sub].condition[c]}
            </TypeFace>
          </Box>,
        );
      }
      subTable.push(
        <Border borderBottom key={`${event}-${sub}`}>
          <Box width='100%' justifyContent='space-between' padding='medium'>
            <Stack spacing='small'>
              <TypeFace>
                <TypeFace fontWeight='bold'>Type: </TypeFace>
                {eventsubs[event][sub].type}
              </TypeFace>
              <TypeFace>
                <TypeFace fontWeight='bold'>ID: </TypeFace>
                {eventsubs[event][sub].id}
              </TypeFace>
              <TypeFace>
                <TypeFace fontWeight='bold'>Conditions: </TypeFace>
                {conditionTable}
              </TypeFace>
              <TypeFace>
                <TypeFace fontWeight='bold'>Status: </TypeFace>
                {eventsubs[event][sub].status}
              </TypeFace>
            </Stack>
            <Stack spacing='small'>
              <Button icon={faTrash} onClick={() => deleteEventSub(eventsubs[event][sub].id)} />
            </Stack>
          </Box>
        </Border>,
      );
    }
  }
  return <Expandable label='EventSubs'>{subTable}</Expandable>;
}
