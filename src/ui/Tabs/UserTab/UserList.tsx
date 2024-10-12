import React from 'react';
import { useFormContext } from 'react-hook-form';
import UserEntry from './UserEntry';

export default function UserList() {
  const { watch } = useFormContext();
  const users = watch('trusted_users');

  return (
    <>
      {Object.keys(users).map((userKey: string) => {
        return <UserEntry userKey={userKey} />;
      })}
    </>
  );
}
