import {
  Box,
  Stack,
  Columns,
  TypeFace,
  LinkButton,
  useTheme,
  Border,
  Icon,
  useDialog,
  Button,
  SaveButton,
} from '@spooder/webui-component-library';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import ShareCategoryButtonRow from './input/ShareCategoryButtonRow';
import ToggleShareButton from './input/ToggleShareButton';
import ShareTabContent from './tab/ShareTabContent';
import ShareUiLink from './input/ShareUiLink';
import ShareEntryFormContextProvider from './context/ShareEntryFormContext';
import useShare from '../../../app/hooks/useShare';

interface ShareEntryProps {
  shareKey: string;
  shareData: any;
}

function ShareEntryContent(props: { shareKey: string }) {
  const { shareKey } = props;
  const { getDeleteShare, getShares, getSaveShare } = useShare();
  const { saveShare } = getSaveShare();
  const { refetch } = getShares();
  const { openDialog, closeDialog } = useDialog();
  const { deleteShare } = getDeleteShare();
  const { watch, formState, getValues, reset } = useFormContext();
  const [isDirty, setIsDirty] = useState(false);
  const [tab, setTab] = useState('overview');
  const { isMobileDevice } = useTheme();
  const share = watch();

  useEffect(() => {
    setIsDirty(formState.isDirty);
  }, [formState.isDirty]);

  const handleSave = () => {
    const formData = getValues();
    saveShare(shareKey, formData);
    reset(formData);
    setIsDirty(false);
  };

  const removeShareEntry = () => {
    deleteShare(shareKey);
    openDialog('Delete Share', 'Are you sure you want to delete this share?', [
      <Button label='Cancel' onClick={() => closeDialog()} />,
      <Button
        label='Delete'
        onClick={() => {
          deleteShare(shareKey);
          closeDialog();
          refetch();
        }}
      />,
    ]);
  };

  if (!share) {
    return null;
  }

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
        {isDirty && (
          <Box padding='small'>
            <SaveButton saveFunction={handleSave} />
          </Box>
        )}
      </Box>
    </Border>
  );
}

export default function ShareEntry(props: ShareEntryProps) {
  const { shareKey, shareData } = props;

  return (
    <ShareEntryFormContextProvider shareKey={shareKey} shareData={shareData}>
      <ShareEntryContent shareKey={shareKey} />
    </ShareEntryFormContextProvider>
  );
}
