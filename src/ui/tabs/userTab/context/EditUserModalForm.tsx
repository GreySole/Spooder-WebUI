import { Modal, Box, SaveButton } from '@spooder/webui-component-library';
import React, { useEffect } from 'react';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import useUsers from '../../../../app/hooks/useUsers';
import { useUserEditModal } from './EditModalContext';
import EditUserModalContent from '../EditUserModalContent';

export default function UserModalForm() {
  const { closeModal, isOpen, username, userId, displayName } = useUserEditModal();
  const methods = useForm({
    defaultValues: {
      id: userId,
      username: username,
      display_name: displayName,
      permissions: {
        mod: true,
      },
    },
  });

  const { getEditUser, getUsers } = useUsers();
  const { editUser } = getEditUser();
  const { refetch } = getUsers();

  useEffect(() => {
    methods.reset({
      id: userId,
      username: username,
      display_name: displayName,
      permissions: {
        mod: true,
      },
    });
  }, [userId]);

  const saveClickHandler = (values: FieldValues) => {
    editUser(values).then(() => {
      refetch();
      closeModal();
    });
  };

  const closeModalClick = () => {
    methods.reset();
    closeModal();
  };

  return (
    <FormProvider {...methods}>
      <Modal
        title='Edit User'
        isOpen={isOpen}
        onClose={closeModalClick}
        content={<EditUserModalContent />}
        footerContent={
          <Box justifyContent='flex-end'>
            <SaveButton saveFunction={saveClickHandler} />
          </Box>
        }
      />
    </FormProvider>
  );
}
