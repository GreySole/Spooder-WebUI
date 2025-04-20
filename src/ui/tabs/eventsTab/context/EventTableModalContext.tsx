import React, { createContext, useState, useContext, ReactNode } from 'react';
import EventGeneral from '../EventGeneral';
import EventCommands from '../EventCommands';
import EventTriggers from '../EventTriggers';
import { useFormContext } from 'react-hook-form';
import { EVENT_KEY } from '../FormKeys';
import { Box, Button, Modal, MultiPageModal } from '@greysole/spooder-component-library';
import EventTable from '../EventTable';
import EventTableModal from './EventTableModal';

interface EventModalContextProps {
  open: () => void;
  close: () => void;
  setEventName: (eventName: string) => void;
  eventName: string;
  isOpen: boolean;
}

const EventTableModalContext = createContext<EventModalContextProps | undefined>(undefined);

export function EventTableModalProvider() {
  const [isOpen, setIsOpen] = useState(false);
  const [eventName, setEventName] = useState('');

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <EventTableModalContext.Provider
      value={{
        open: openModal,
        close: closeModal,
        isOpen,
        setEventName,
        eventName,
      }}
    >
      <EventTableModal />
      <EventTable />
    </EventTableModalContext.Provider>
  );
}

export const useEventTableModal = () => {
  const context = useContext(EventTableModalContext);
  if (context === undefined) {
    throw new Error('useEventTableModal must be used within an EventTableModalProvider');
  }
  return context;
};
