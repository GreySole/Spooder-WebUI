import { faX } from '@fortawesome/free-solid-svg-icons';
import { Box, Button, Columns, Icon, TypeFace } from '@greysole/spooder-component-library';
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the dialog context
interface DialogContextType {
  isOpen: boolean;
  openDialog: (title: string, content: ReactNode, buttons: ReactNode[]) => void;
  closeDialog: () => void;
}

// Create the context with a default value
const DialogContext = createContext<DialogContextType | undefined>(undefined);

// Provider component
export const DialogContextProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<ReactNode>(null);
  const [buttons, setButtons] = useState<ReactNode[]>([<Button label='OK' onClick={() => {}} />]);

  const openDialog = (title: string, content: ReactNode, buttons: ReactNode[]) => {
    setTitle(title);
    setContent(content);
    setButtons(buttons);
    setIsOpen(true);
  };
  const closeDialog = () => setIsOpen(false);

  return (
    <DialogContext.Provider value={{ isOpen, openDialog, closeDialog }}>
      <div
        className={isOpen ? 'dialog open' : 'dialog'}
        style={{ display: isOpen ? 'flex' : 'none' }}
        onClick={(e) => {
          closeDialog();
        }}
      >
        <div className='dialog-window' onClick={(e) => e.stopPropagation()}>
          <div className='dialog-header'>
            <TypeFace fontSize='large'>{title}</TypeFace>
            <div className='dialog-close'>
              <Button
                icon={faX}
                iconSize='large'
                onClick={() => {
                  closeDialog();
                }}
              />
            </div>
          </div>
          <div className='dialog-content'>{content}</div>
          <div className='dialog-buttons'>
            <Box width='100%' justifyContent='flex-end' padding='small'>
              <Columns spacing='small'>{buttons}</Columns>
            </Box>
          </div>
        </div>
      </div>
      {children}
    </DialogContext.Provider>
  );
};

// Custom hook for consuming the context
export const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialogContext must be used within a DialogContextProvider');
  }
  return context;
};
