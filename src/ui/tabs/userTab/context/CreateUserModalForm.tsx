import { Modal, Box, SaveButton } from '@greysole/spooder-component-library';
import React from 'react';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import useUsers from '../../../../app/hooks/useUsers';
import CreateUserModalContent from '../CreateUserModalContent';
import { useUserCreateModal } from './CreateModalContext';

export default function CreateModalForm() {
  const methods = useForm({
    defaultValues: {
      id: 'new',
      username: '',
      permissions: {
        mod: true,
      },
    },
  });

  const { closeModal, isOpen } = useUserCreateModal();

  const { getSaveUsers, getUsers } = useUsers();
  const { saveUsers } = getSaveUsers();
  const { refetch } = getUsers();

  const saveClickHandler = (values: FieldValues) => {
    saveUsers(values).then(() => {
      refetch();
      closeModal();
    });
  };

  return (
    <FormProvider {...methods}>
      <Modal
        title='Create User'
        isOpen={isOpen}
        onClose={closeModal}
        content={<CreateUserModalContent />}
        footerContent={
          <Box justifyContent='flex-end'>
            <SaveButton saveFunction={saveClickHandler} />
          </Box>
        }
      />
    </FormProvider>
  );
}
