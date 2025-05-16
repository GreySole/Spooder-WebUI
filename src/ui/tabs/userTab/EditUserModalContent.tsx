import {
  Box,
  FormTextInput,
  Expandable,
  BoolSwitch,
  Stack,
} from '@greysole/spooder-component-library';
import React from 'react';
import EditUserPermissions from './EditUserPermissions';
import { useUserEditModal } from './context/EditModalContext';

export default function EditUserModalContent() {
  const { username, userId } = useUserEditModal();

  return (
    <Stack spacing='medium'>
      <FormTextInput formKey={`name_changes.${username}`} label='Username' />
      <FormTextInput formKey={`trusted_users.display_names.${userId}`} label='Display Name' />
      <EditUserPermissions userId={userId} />
    </Stack>
  );
}
