import { Modal } from '@greysole/spooder-component-library';
import React, { createContext, ReactNode, useState, useContext } from 'react';
import CreateUserModalContent from '../CreateUserModalContent';

interface CreateModalContextProps {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const CreateModalContext = createContext<CreateModalContextProps | undefined>(undefined);

interface UserModalProviderProps {
  children: ReactNode;
}

export const CreateModalProvider = ({ children }: UserModalProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <CreateModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      <Modal
        title='Create User'
        isOpen={isOpen}
        onClose={closeModal}
        content={<CreateUserModalContent />}
      />
      {children}
    </CreateModalContext.Provider>
  );
};

export const useUserCreateModal = () => {
  const context = useContext(CreateModalContext);
  if (!context) {
    throw new Error('useCreateModal must be used within a CreateModalProvider');
  }
  return context;
};
