import React from 'react';
import { useFormContext } from 'react-hook-form';
import UserEntry from './UserEntry';
import { Stack } from '@greysole/spooder-component-library';

export default function UserList() {
  const { watch } = useFormContext();
  const users = watch('trusted_users');

  return (
    <Stack spacing='medium'>
      {Object.values(users.usernames).map((userKey) => {
        return <UserEntry userKey={userKey as string} />;
      })}
    </Stack>
  );
}
