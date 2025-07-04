import {
  Box,
  Stack,
  Columns,
  TypeFace,
  LinkButton,
  useTheme,
  Border,
  Icon,
} from '@greysole/spooder-component-library';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import ShareCategoryButtonRow from './input/ShareCategoryButtonRow';
import ToggleShareButton from './input/ToggleShareButton';
import ShareTabContent from './tab/ShareTabContent';
import ShareUiLink from './input/ShareUiLink';

interface ShareEntryProps {
  shareKey: string;
}

export default function ShareEntry(props: ShareEntryProps) {
  const { shareKey } = props;
  const { watch, setValue, unregister } = useFormContext();
  const [tab, setTab] = useState('overview');
  const { isMobileDevice } = useTheme();
  const share = watch(shareKey);

  const removeShareEntry = () => {
    unregister(shareKey);
  };

  return (
    <Border borderBottom>
      <Box className='share-entry' key={shareKey} flexFlow='column'>
        <Box justifyContent='space-between'>
          <Box flexFlow={isMobileDevice ? 'column' : 'row'} alignItems='center' width='100%'>
            <Icon icon={share.streamPlatforms.twitch.profilePic} iconSize='100px' clip='circle' />
            <Box flexFlow='column' margin='small' marginLeft='medium'>
              <Stack spacing='small'>
                <TypeFace fontSize='large'>{share.streamPlatforms.twitch.displayName}</TypeFace>
                <ShareCategoryButtonRow
                  tab={tab}
                  setTab={setTab}
                  removeShareEntry={removeShareEntry}
                />

                <Columns spacing='medium' padding='small'>
                  <LinkButton
                    label='Stream'
                    mode='newtab'
                    link={'https://twitch.tv/' + share.streamPlatforms.twitch.username}
                  />
                  <ShareUiLink shareKey={shareKey} />
                  <ToggleShareButton shareKey={shareKey} />
                </Columns>
              </Stack>
            </Box>
          </Box>
        </Box>
        <ShareTabContent shareKey={shareKey} tab={tab} />
      </Box>
    </Border>
  );
}
