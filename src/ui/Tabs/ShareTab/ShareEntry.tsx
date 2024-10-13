import React from 'react';
import { faPlay, faStop, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import LinkButton from '../../common/LinkButton';
import ToggleShareButton from './input/ToggleShareButton';
import { useFormContext } from 'react-hook-form';
import ShareDiscordForm from './input/ShareDiscordForm';
import AutoShareSwitch from './input/AutoShareSwitch';
import FormTextInput from '../../common/input/form/FormTextInput';
import ShareEntryCommandSettings from './input/ShareEntryCommandSettings';
import ShareEntryPluginSettings from './input/ShareEntryPluginSettings';

interface ShareEntryProps {
  shareKey: string;
}

export default function ShareEntry(props: ShareEntryProps) {
  const { shareKey } = props;
  const { watch, setValue } = useFormContext();
  const share = watch(shareKey);
  console.log(shareKey, share);

  const removeShareEntry = () => {
    setValue(shareKey, null);
  };

  return (
    <div className='share-entry' key={shareKey}>
      <div className='share-entry-info'>
        <div className='share-entry-user'>
          <div className='share-entry-user-pfp'>
            <img src={share.twitch.profilepic} width={100} height={100} />
          </div>
          <div className='share-entry-user-info'>
            <div className='share-entry-user-name'>
              <div className='label'>
                {share.twitch.displayName}{' '}
                <LinkButton
                  iconOnly={true}
                  mode='newtab'
                  link={'https://twitch.tv/' + share.twitch.username}
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
  );
}
