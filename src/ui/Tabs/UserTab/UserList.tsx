import React from 'react';
import { useFormContext } from 'react-hook-form';
import UserEntry from './UserEntry';

export default function UserList() {
  const { watch } = useFormContext();
  const users = watch('trusted_users');

  return (
    <>
      {Object.values(users.usernames).map((userKey) => {
        return <UserEntry userKey={userKey as string} />;
      })}
    </>
  );
}
