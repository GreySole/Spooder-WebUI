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
  userId: string;
  username: string;
  displayName: string;
  hasPassword: boolean;
}

export default function UserEntry(props: UserEntryProps) {
  const { userId, username, displayName, hasPassword } = props;
  const { getResetPassword, getDeleteUser, getUsers } = useUsers();
  const { deleteUser } = getDeleteUser();
  const { resetPassword } = getResetPassword();
  const { setUser, openModal } = useUserEditModal();
  const { openDialog, closeDialog } = useDialog();
  const { refetch } = getUsers();

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

  const deleteUserClick = () => {
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
            deleteUser(userId).then(() => {
              closeDialog();
              refetch();
            });
          }}
        />,
      ],
    );
  };

  return (
    <Box justifyContent='space-between' alignItems='center'>
      <UserEntryLabel username={username} displayName={displayName} />
      <ButtonRow
        buttonSize='medium'
        iconSize='large'
        buttons={[
          {
            icon: faEdit,
            onClick: () => {
              setUser(username);
              openModal();
            },
          },
          { icon: faDeleteLeft, onClick: () => safeDeleteUserPassword() },
          { icon: faTrash, onClick: () => deleteUserClick() },
        ]}
      />
    </Box>
  );
}
