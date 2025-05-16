import { faDeleteLeft, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Box, TypeFace, ButtonRow } from '@greysole/spooder-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import useUsers from '../../../app/hooks/useUsers';
import UserEntryLabel from './UserEntryLabel';
import { useUserEditModal } from './context/EditModalContext';

interface UserEntryProps {
  username: string;
}

export default function UserEntry(props: UserEntryProps) {
  const { username } = props;
  const { watch, setValue, unregister } = useFormContext();
  const { getResetPassword } = useUsers();
  const { resetPassword } = getResetPassword();
  const { setUser, openModal } = useUserEditModal();
  const userId = watch(`trusted_users.user_names.${username}`);
  const displayName = watch(`trusted_users.display_names.${userId}`);
  const hasPassword = watch(`trusted_users_pw.${userId}`, false);

  console.log('UserEntry', userId, hasPassword);

  const safeDeleteUserPassword = () => {
    const deleteConfirm = confirm(
      `${displayName} will have a temporary password set to login and set a new password. Is that okay?`,
    );

    if (deleteConfirm == true) {
      resetPassword(userId);
    }
  };

  const deleteUser = () => {
    const deleteConfirm = confirm(`Are you sure you want to delete ${userId}?`);

    if (deleteConfirm == true) {
      unregister(`trusted_users.permissions.${userId}`);
      unregister(`trusted_users.user_names.${userId}`);
      unregister(`trusted_users.display_names.${userId}`);
      unregister(`trusted_users_pw.${userId}`);
    }
  };

  return (
    <Box justifyContent='space-between' alignItems='center'>
      <UserEntryLabel username={username} />
      <ButtonRow
        buttonSize='medium'
        iconSize='large'
        buttons={[
          {
            icon: faEdit,
            onClick: () => {
              setValue(`name_changes.${username}`, username);
              setUser(userId, username);
              openModal();
            },
          },
          { icon: faDeleteLeft, onClick: () => safeDeleteUserPassword() },
          { icon: faTrash, onClick: () => deleteUser() },
        ]}
      />
    </Box>
  );
}
