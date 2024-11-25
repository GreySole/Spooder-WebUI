import React, { useState } from 'react';
import {
  faComment,
  faHome,
  faPlay,
  faPlug,
  faStop,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LinkButton from '../../common/input/general/LinkButton';
import ToggleShareButton from './input/ToggleShareButton';
import { useFormContext } from 'react-hook-form';
import ShareDiscordForm from './input/ShareDiscordForm';
import AutoShareSwitch from './input/AutoShareSwitch';
import FormTextInput from '../../common/input/form/FormTextInput';
import ShareEntryCommandSettings from './input/ShareEntryCommandSettings';
import ShareEntryPluginSettings from './input/ShareEntryPluginSettings';
import Box from '../../common/layout/Box';
import Button from '../../common/input/controlled/Button';
import TwitchIcon from '../../icons/TwitchIcon';
import DiscordIcon from '../../icons/DiscordIcon';
import Columns from '../../common/layout/Columns';
import Stack from '../../common/layout/Stack';
import TypeFace from '../../common/layout/TypeFace';
import ShareTabContainer from './tab/ShareTabContent';
import ShareTabContent from './tab/ShareTabContent';

interface ShareEntryProps {
  shareKey: string;
}

export default function ShareEntry(props: ShareEntryProps) {
  const { shareKey } = props;
  const { watch, setValue } = useFormContext();
  const [tab, setTab] = useState('overview');
  const share = watch(shareKey);
  console.log(shareKey, share);

  const removeShareEntry = () => {
    setValue(shareKey, null);
  };

  return (
    <Box classes={['share-entry']} key={shareKey} flexFlow='column'>
      <Box width='100%' justifyContent='space-between'>
        <Box flexFlow='row' alignItems='center' width='100%'>
          <img src={share.streamPlatforms.twitch.profilePic} width={100} height={100} />
          <Box flexFlow='column' margin='10px'>
            <Stack spacing='10px'>
              <Columns spacing='20px'>
                <Button
                  icon={faHome}
                  width='75px'
                  height='50px'
                  onClick={() => setTab('overview')}
                />
                <Button
                  icon={faComment}
                  width='75px'
                  height='50px'
                  onClick={() => setTab('commands')}
                />
                <Button
                  icon={faPlug}
                  width='75px'
                  height='50px'
                  onClick={() => setTab('plugins')}
                />
                <Button
                  icon={<TwitchIcon />}
                  width='75px'
                  height='50px'
                  iconSize='25px'
                  onClick={() => setTab('twitch')}
                />
                <Button
                  icon={<DiscordIcon />}
                  width='75px'
                  height='50px'
                  iconSize='25px'
                  onClick={() => setTab('discord')}
                />
                <Button
                  icon={faTrash}
                  width='75px'
                  height='50px'
                  onClick={() => removeShareEntry()}
                />
              </Columns>
              <Columns spacing='10px'>
                <TypeFace fontSize='32px'>{share.streamPlatforms.twitch.displayName}</TypeFace>
                <LinkButton
                  iconOnly={true}
                  mode='newtab'
                  link={'https://twitch.tv/' + share.streamPlatforms.twitch.username}
                />
              </Columns>
            </Stack>
          </Box>
        </Box>

        <ToggleShareButton shareKey={shareKey} />
      </Box>
      <ShareTabContent shareKey={shareKey} tab={tab} />
    </Box>
  );

  /*return (
    <div className='share-entry' key={shareKey}>
      <div className='share-entry-info'>
        <div className='share-entry-user'>
          <div className='share-entry-user-pfp'>
            <img src={share.streamPlatforms.twitch.profilePic} width={100} height={100} />
          </div>
          <div className='share-entry-user-info'>
            <div className='share-entry-user-name'>
              <div className='label'>
                {share.streamPlatforms.twitch.displayName}{' '}
                <LinkButton
                  iconOnly={true}
                  mode='newtab'
                  link={'https://twitch.tv/' + share.streamPlatforms.twitch.username}
                />
              </div>{' '}
              <ShareDiscordForm shareKey={shareKey} />{' '}
              <div className='share-discord-label'>
                <AutoShareSwitch shareKey={shareKey} />
              </div>
            </div>

            <FormTextInput formKey={`${shareKey}.joinMessage`} label='Join Message' />
            <FormTextInput formKey={`${shareKey}.leaveMessage`} label='Leave Message' />
          </div>
          <div className='share-entry-actions'>
            <ToggleShareButton shareKey={shareKey} />
            <button className='delete-button' onClick={() => removeShareEntry()}>
              <FontAwesomeIcon icon={faTrash} size='2x' />
            </button>
          </div>
        </div>
        <div className='share-entry-content'>
          <div className='share-entry-content-overview'>
            <ShareEntryCommandSettings shareKey={shareKey} />
            <ShareEntryPluginSettings shareKey={shareKey} />
          </div>
        </div>
      </div>
    </div>
  );*/
}
