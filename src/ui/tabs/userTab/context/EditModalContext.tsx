import { Box, Button, Modal, SaveButton } from '@greysole/spooder-component-library';
import React, { createContext, useState, useContext, ReactNode } from 'react';
import EditUserModalContent from '../EditUserModalContent';
import useUsers from '../../../../app/hooks/useUsers';

interface UserModalProviderProps {
  children: ReactNode;
}

// Edit Modal Context
interface EditModalContextProps {
  isOpen: boolean;
  username: string;
  userId: string;
  setUser: (userId: string, username: string) => void;
  openModal: () => void;
  closeModal: () => void;
}

const EditModalContext = createContext<EditModalContextProps | undefined>(undefined);

export function EditModalProvider({ children }: UserModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const { getSaveUsers } = useUsers();
  const { saveUsers } = getSaveUsers();

  const setUser = (userId: string, username: string) => {
    setUsername(username);
    setUserId(userId);
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <EditModalContext.Provider value={{ isOpen, username, userId, setUser, openModal, closeModal }}>
      <Modal
        title='Edit User'
        isOpen={isOpen}
        onClose={closeModal}
        content={<EditUserModalContent />}
        footerContent={
          <Box justifyContent='flex-end'>
            <SaveButton saveFunction={saveUsers} />
          </Box>
        }
      />
      {children}
    </EditModalContext.Provider>
  );
}

export const useUserEditModal = () => {
  const context = useContext(EditModalContext);
  if (!context) {
    throw new Error('useEditModal must be used within an EditModalProvider');
  }
  return context;
};
