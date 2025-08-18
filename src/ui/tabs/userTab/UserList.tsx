import React from 'react';
import { useFormContext } from 'react-hook-form';
import UserEntry from './UserEntry';
import { FormLoader, Stack } from '@greysole/spooder-component-library';
import PendingUserEntry from './PendingUserEntry';
import useUsers from '../../../app/hooks/useUsers';
import PageCircleLoader from '../../common/input/general/PageCircleLoader';

export default function UserList() {
  const { getUsers } = useUsers();
  const { data: users, isLoading } = getUsers();

  if (isLoading) {
    return <PageCircleLoader />;
  }

  return (
    <Stack spacing='medium'>
      {Object.keys(users.trusted_users.pending).map((inviteCode) => {
        return <PendingUserEntry key={inviteCode} inviteCode={inviteCode as string} />;
      })}
      {Object.keys(users.trusted_users.user_names).map((username) => {
        const userId = users.trusted_users.user_names[username];
        const displayName = users.trusted_users.display_names[userId];
        const hasPassword = users.trusted_users_pw[userId] || false;
        return (
          <UserEntry
            key={username}
            userId={userId}
            username={username as string}
            displayName={displayName}
            hasPassword={hasPassword}
          />
        );
      })}
    </Stack>
  );
}
