import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { Button, Stack, TextInput } from '@greysole/spooder-component-library';

interface ShareDiscordFormProps {
  shareKey: string;
}

export default function ShareDiscordForm(props: ShareDiscordFormProps) {
  const { shareKey } = props;
  const { watch, setValue, unregister } = useFormContext();
  const userId = watch(`${shareKey}.notificationPlatforms.discord.userId`, null);
  const username = watch(`${shareKey}.notificationPlatforms.discord.username`, null);

  const [addDiscordID, setAddDiscordID] = useState('');
  const [openAddDiscord, setOpenAddDiscord] = useState(false);

  const removeDiscord = () => {
    unregister(`${shareKey}.notificationPlatforms.discord`);
  };
  const addDiscord = () => {
    setValue(`${shareKey}.notificationPlatforms.discord.userId`, addDiscordID);
    setAddDiscordID('');
    setOpenAddDiscord(false);
  };
  if (userId == null && !openAddDiscord) {
    return <Button label='Add Discord' onClick={() => setOpenAddDiscord(true)} />;
  } else if (userId == null && openAddDiscord) {
    return (
      <Stack spacing='medium'>
        <TextInput
          value={addDiscordID}
          placeholder='Discord ID, not the name!'
          onInput={(value) => setAddDiscordID(value)}
        />
        <Button label='Add Discord' onClick={() => addDiscord()} />
      </Stack>
    );
  } else {
    return (
      <Stack spacing='medium'>
        {'Discord ' + username}
        <Button label='' icon={faTrash} onClick={() => removeDiscord()} />
      </Stack>
    );
  }
}
