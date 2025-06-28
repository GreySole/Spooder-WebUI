import { faDeleteLeft, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  Box,
  TypeFace,
  ButtonRow,
  Button,
  Columns,
  LinkButton,
  Stack,
  useDialog,
} from '@greysole/spooder-component-library';
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
  const { openDialog, closeDialog } = useDialog();

  const userId = watch(`trusted_users.user_names.${username}`);
  const displayName = watch(`trusted_users.display_names.${userId}`);
  const hasPassword = watch(`trusted_users_pw.${userId}`, false);

  console.log('UserEntry', userId, hasPassword);

  const safeDeleteUserPassword = () => {
    openDialog(
      'Reset Password',
      <TypeFace>{`${displayName} will have a temporary password set to login and set a new password. Is that okay?`}</TypeFace>,
      [
        <Button
          label='Cancel'
          onClick={() => {
            closeDialog();
          }}
        />,
        <Button
          label='Ok'
          onClick={() => {
            closeDialog();
            resetPassword(userId).then((response) => {
              console.log('resetPassword', response);
              if (response.data && response.data.status === 'ok') {
                openDialog(
                  'Success',
                  <Stack spacing='small' align='center'>
                    <TypeFace>{`Password reset for ${displayName}. Here's the temp password. This won't be shown again.`}</TypeFace>
                    <Columns spacing='small'>
                      <TypeFace>{`Temp password: ${response.data.temp_password}`}</TypeFace>
                      <LinkButton iconOnly mode='copy' link={response.data.temp_password} />
                    </Columns>
                  </Stack>,
                  [
                    <Button
                      label='Got it'
                      onClick={() => {
                        closeDialog();
                      }}
                    />,
                  ],
                );
              } else {
                openDialog('Error', 'Failed to reset password', [
                  <Button
                    label='Ok'
                    onClick={() => {
                      closeDialog();
                    }}
                  />,
                ]);
              }
            });
          }}
        />,
      ],
    );
  };

  const deleteUser = () => {
    openDialog(
      `Delete ${displayName}?`,
      <TypeFace>Are you sure you want to delete {displayName}?</TypeFace>,
      [
        <Button
          label='Cancel'
          onClick={() => {
            closeDialog();
          }}
        />,
        <Button
          label='Delete'
          onClick={() => {
            unregister(`trusted_users.permissions.${userId}`);
            unregister(`trusted_users.user_names.${userId}`);
            unregister(`trusted_users.display_names.${userId}`);
            unregister(`trusted_users_pw.${userId}`);
          }}
        />,
      ],
    );
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
