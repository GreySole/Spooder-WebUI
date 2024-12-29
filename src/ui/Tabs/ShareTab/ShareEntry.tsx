import React, { useState } from 'react';
import {
  faComment,
  faHome,
  faPlay,
  faPlug,
  faStop,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import LinkButton from '../../common/input/general/LinkButton';
import ToggleShareButton from './input/ToggleShareButton';
import { useFormContext } from 'react-hook-form';
import Box from '../../common/layout/Box';
import Columns from '../../common/layout/Columns';
import Stack from '../../common/layout/Stack';
import TypeFace from '../../common/layout/TypeFace';
import ShareTabContent from './tab/ShareTabContent';
import TwitchIcon from '../../icons/twitch.svg';
import DiscordIcon from '../../icons/discord.svg';
import ButtonRow from '../../common/input/general/ButtonRow';
import ImageFile from '../../common/input/general/ImageFile';
import useTheme from '../../../app/hooks/useTheme';
import ShareCategoryButtonRow from './input/ShareCategoryButtonRow';

interface ShareEntryProps {
  shareKey: string;
}

export default function ShareEntry(props: ShareEntryProps) {
  const { shareKey } = props;
  const { watch, setValue } = useFormContext();
  const [tab, setTab] = useState('overview');
  const { isMobileDevice } = useTheme();
  const share = watch(shareKey);

  const removeShareEntry = () => {
    setValue(shareKey, null);
  };

  return (
    <Box classes={['share-entry']} key={shareKey} flexFlow='column'>
      <Box justifyContent='space-between'>
        <Box flexFlow={isMobileDevice ? 'column' : 'row'} alignItems='center' width='100%'>
          <ImageFile
            src={share.streamPlatforms.twitch.profilePic}
            width='100px'
            height='100px'
            clip='circle'
          />
          <Box flexFlow='column' margin='small' marginLeft='medium'>
            <Stack spacing='small'>
              <ShareCategoryButtonRow
                tab={tab}
                setTab={setTab}
                removeShareEntry={removeShareEntry}
              />
              <Columns spacing='medium' padding='small'>
                <TypeFace fontSize='large'>{share.streamPlatforms.twitch.displayName}</TypeFace>
                <LinkButton
                  iconOnly={true}
                  mode='newtab'
                  link={'https://twitch.tv/' + share.streamPlatforms.twitch.username}
                />
                <ToggleShareButton shareKey={shareKey} />
              </Columns>
            </Stack>
          </Box>
        </Box>
      </Box>
      <ShareTabContent shareKey={shareKey} tab={tab} />
    </Box>
  );
}
