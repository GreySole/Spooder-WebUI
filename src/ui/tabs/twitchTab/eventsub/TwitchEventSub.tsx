import {
  Border,
  Box,
  Button,
  Expandable,
  Stack,
  TypeFace,
} from '@spooder/webui-component-library';
import React from 'react';
import useTwitch from '../../../../app/hooks/useTwitch';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import TwitchEventSubList from './TwitchEventSubList';
import TwitchEventSubTest from './TwitchEventSubTest';
import TwitchEventSubWebhook from './TwitchEventSubWebhook';

export default function TwitchEventSub() {
  const { getRefreshEventSubs, getEventSubs } = useTwitch();
  const { refreshEventSubs } = getRefreshEventSubs();
  const { refetch } = getEventSubs();

  return (
    <Expandable label='EventSubs'>
      <Stack spacing='small'>
        <TwitchEventSubWebhook />
        <Box>
          <Button
            label='Refresh Eventsubs'
            onClick={() => {
              refreshEventSubs().then(() => {
                refetch();
              });
            }}
          />
        </Box>
        <TwitchEventSubList />
      </Stack>
    </Expandable>
  );
}
