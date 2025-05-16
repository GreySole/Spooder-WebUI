import React from 'react';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import useShare from '../../../app/hooks/useShare';
import { KeyedObject } from '../../Types';
import { Button, TextInput } from '@greysole/spooder-component-library';

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
        notificationPlatforms: {
          discord: {
            userId: '',
            userName: '',
          },
        },
        streamPlatforms: {
          twitch: {
            userName: userData.login,
            displayName: userData.display_name,
            userId: userData.id,
          },
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
