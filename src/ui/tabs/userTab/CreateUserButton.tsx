import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { KeyedObject } from '../../Types';
import {
  Button,
  LinkButton,
  Stack,
  TypeFace,
  useDialog,
} from '@greysole/spooder-component-library';
import { useUserCreateModal } from './context/CreateModalContext';
import useUsers from '../../../app/hooks/useUsers';

export default function CreateUserButton() {
  const { getCreateUser, getUsers } = useUsers();
  const { refetch } = getUsers();
  const { createUser } = getCreateUser();
  const { openDialog, closeDialog } = useDialog();

  const createUserClick = () => {
    openDialog(
      'Create User',
      <Stack spacing='medium'>
        <TypeFace>
          Creating a user will create an ID and give you an invite code. Send the code to the user
          and they can use it to register when they need to login for the ModUI
        </TypeFace>
      </Stack>,
      [
        <Button label='Cancel' onClick={() => closeDialog()} />,
        <Button
          label='Create'
          onClick={() => {
            createUser().then((response) => {
              console.log(response);
              openDialog(
                'User Created',
                <TypeFace>
                  User created successfully. Invite code: {response.data.invite_code}
                </TypeFace>,
                [
                  <LinkButton
                    label='Copy Invite Code'
                    mode='copy'
                    link={response.data.invite_code}
                  />,
                  <Button
                    label='Ok'
                    onClick={() => {
                      refetch();
                      closeDialog();
                    }}
                  />,
                ],
              );
            });
          }}
        />,
      ],
    );
  };
  return (
    <Button
      label='Create User'
      icon={faPlusCircle}
      iconSize='lg'
      onClick={() => createUserClick()}
    />
  );
}
