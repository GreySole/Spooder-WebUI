import {
  Border,
  Box,
  Button,
  Expandable,
  Stack,
  TypeFace,
} from '@greysole/spooder-component-library';
import React from 'react';
import useTwitch from '../../../../app/hooks/useTwitch';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import TwitchEventSubList from './TwitchEventSubList';
import TwitchEventSubTest from './TwitchEventSubTest';

export default function TwitchEventSub() {
  return (
    <Expandable label='EventSubs'>
      <Stack spacing='small'>
        <TwitchEventSubTest />
        <TwitchEventSubList />
      </Stack>
    </Expandable>
  );
}
