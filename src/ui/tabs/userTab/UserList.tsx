import React from 'react';
import { useFormContext } from 'react-hook-form';
import UserEntry from './UserEntry';
import { FormLoader, Stack, TypeFace } from '@spooder/webui-component-library';
import PendingUserEntry from './PendingUserEntry';
import useUsers from '../../../app/hooks/useUsers';
import PageCircleLoader from '../../common/input/general/PageCircleLoader';

export default function UserList() {
  const { getUsers } = useUsers();
  const { data: users, isLoading } = getUsers();

  if (isLoading) {
    return <PageCircleLoader />;
  }

  if (
    !users.trusted_users ||
    (Object.keys(users.trusted_users?.user_names).length === 0 &&
      Object.keys(users.trusted_users?.pending).length === 0)
  ) {
    return (
      <TypeFace>
        No users found. Create a user by clicking Create User at the bottom. You will get an invite
        code to send to your user. They can enter this code at the login screen when accessing the
        ModUI. Get the ModUI in the Config tab (must have public hosting set up)
      </TypeFace>
    );
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
