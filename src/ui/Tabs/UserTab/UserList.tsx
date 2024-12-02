import React from 'react';
import { useFormContext } from 'react-hook-form';
import UserEntry from './UserEntry';
import Box from '../../common/layout/Box';
import Stack from '../../common/layout/Stack';

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
