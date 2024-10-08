import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import TextInput from '../../common/input/controlled/TextInput';
import Button from '../../common/input/controlled/Button';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

interface ShareDiscordFormProps {
  shareKey: string;
}

export default function ShareDiscordForm(props: ShareDiscordFormProps) {
  const { shareKey } = props;
  const { watch, setValue } = useFormContext();
  const share = watch(shareKey);
  const [addDiscordID, setAddDiscordID] = useState('');
  const [openAddDiscord, setOpenAddDiscord] = useState(false);

  const removeDiscord = () => {
    setValue(`${shareKey}.discord.id`, null);
    setValue(`${shareKey}.discord.username`, null);
  };
  if (share.discord.id == null && openAddDiscord) {
    return <Button label='Add Discord' onClick={() => setOpenAddDiscord(true)} />;
  } else if (share.discord.id == null && openAddDiscord) {
    return (
      <div className='share-discord-label'>
        <TextInput
          value={addDiscordID}
          placeholder='Discord ID, not the name!'
          onInput={(value) => setAddDiscordID(value)}
        />
        <Button label='Add Discord' onClick={() => setOpenAddDiscord(true)} />
      </div>
    );
  } else {
    return (
      <div className='share-discord-label'>
        <Button
          label={'Discord ' + share.discord.username}
          icon={faTrash}
          onClick={() => removeDiscord()}
        />
      </div>
    );
  }
}
