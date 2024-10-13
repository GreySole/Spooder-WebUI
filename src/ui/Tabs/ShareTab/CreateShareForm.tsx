import React from 'react';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import TextInput from '../../common/input/controlled/TextInput';
import { useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import useShare from '../../../app/hooks/useShare';
import { KeyedObject } from '../../Types';
import Button from '../../common/input/controlled/Button';

export default function CreateShareForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [twitchUsername, setTwitchUsername] = useState('');
  const { getVerifyShareTarget } = useShare();
  const { verifyShareTarget } = getVerifyShareTarget();
  const { setValue } = useFormContext();

  const onSubmit = () => {
    verifyShareTarget(twitchUsername).then((userData: KeyedObject) => {
      const uniqueId = uuidv4();
      const newShare = {
        joinMessage: '',
        leaveMessage: '',
        plugins: [],
        commands: [],
        twitch: {
          twitchUsername: userData.login,
          twitchDisplayname: userData.display_name,
          twitchUserId: userData.id,
          twitchProfileImageUrl: userData.profile_image_url,
        },
        discord: {
          discordId: '',
          discordUsername: '',
        },
      };
      setValue(`shares.${uniqueId}`, newShare);
    });
  };

  return (
    <>
      <div className='plugin-install-button'>
        <Button
          label='Create Share'
          onClick={() => setIsOpen(!isOpen)}
          icon={faPlusCircle}
          iconSize='lg'
        />
      </div>
      {isOpen ? (
        <div className='share-tab-create-element'>
          <TextInput value={twitchUsername} onInput={(value) => setTwitchUsername(value)} />
          <Button label='Add' onClick={() => onSubmit} />
        </div>
      ) : null}
    </>
  );
}
