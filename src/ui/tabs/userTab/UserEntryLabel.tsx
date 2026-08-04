import { TypeFace } from '@spooder/webui-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface UserEntryLabelProps {
  username: string;
  displayName: string;
}

export default function UserEntryLabel(props: UserEntryLabelProps) {
  const { username, displayName } = props;
  return (
    <TypeFace fontSize='large' fontWeight='bold'>
      {username} <TypeFace fontSize='medium'> ({displayName})</TypeFace>
    </TypeFace>
  );
}
