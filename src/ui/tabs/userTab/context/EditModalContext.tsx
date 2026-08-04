import { Box, Button, Modal, SaveButton } from '@spooder/webui-component-library';
import React, { createContext, useState, useContext, ReactNode } from 'react';
import EditUserModalContent from '../EditUserModalContent';
import useUsers from '../../../../app/hooks/useUsers';
import { FieldValues } from 'react-hook-form';
import EditUserModalForm from './EditUserModalForm';

interface UserModalProviderProps {
  children: ReactNode;
}

// Edit Modal Context
interface EditModalContextProps {
  isOpen: boolean;
  username: string;
  displayName: string;
  userId: string;
  setUser: (username: string) => void;
  openModal: () => void;
  closeModal: () => void;
}

const EditModalContext = createContext<EditModalContextProps | undefined>(undefined);

export function EditModalProvider({ children }: UserModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [userId, setUserId] = useState('');
  const { getUsers } = useUsers();
  const { data } = getUsers();

  const setUser = (username: string) => {
    const userId = data.trusted_users.user_names[username];
    setUsername(username);
    setUserId(userId);
    setDisplayName(data.trusted_users.display_names[userId]);
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <EditModalContext.Provider
      value={{
        isOpen,
        username,
        displayName,
        userId,
        setUser,
        openModal,
        closeModal,
      }}
    >
      <EditUserModalForm />
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
