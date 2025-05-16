import React from 'react';
import { useFormContext } from 'react-hook-form';
import UserEntry from './UserEntry';
import { Stack } from '@greysole/spooder-component-library';

export default function UserList() {
  const { watch } = useFormContext();
  const user_names = watch('trusted_users.user_names');

  console.log('LIST RENDER');

  return (
    <Stack spacing='medium'>
      {Object.keys(user_names).map((username) => {
        return <UserEntry key={username} username={username as string} />;
      })}
    </Stack>
  );
}
