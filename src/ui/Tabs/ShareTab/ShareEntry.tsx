import {
  Box,
  ImageFile,
  Stack,
  Columns,
  TypeFace,
  LinkButton,
} from '@greysole/spooder-component-library';
import useTheme from '@greysole/spooder-component-library/dist/types/context/ThemeContext';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import ShareCategoryButtonRow from './input/ShareCategoryButtonRow';
import ToggleShareButton from './input/ToggleShareButton';
import ShareTabContent from './tab/ShareTabContent';

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
