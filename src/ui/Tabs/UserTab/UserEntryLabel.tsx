import { TypeFace } from '@greysole/spooder-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface UserEntryLabelProps {
  username: string;
}

export default function UserEntryLabel(props: UserEntryLabelProps) {
  const { username } = props;
  const { watch } = useFormContext();
  const userId = watch(`trusted_users.user_names.${username}`);
  const displayName = watch(`trusted_users.display_names.${userId}`);
  return (
    <TypeFace fontSize='large' fontWeight='bold'>
      {username} <TypeFace fontSize='medium'> ({displayName})</TypeFace>
    </TypeFace>
  );
}
