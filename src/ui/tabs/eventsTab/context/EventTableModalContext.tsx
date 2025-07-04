import React, { createContext, useState, useContext, ReactNode, useRef } from 'react';
import EventTable from '../EventTable';
import EventTableModal from './EventTableModal';
import useEvents from '../../../../app/hooks/useEvents';
import EventTableFormContextProvider from './EventTableFormContext';

interface EventModalContextProps {
  open: () => void;
  close: () => void;
  cancel: () => void;
  setEventName: (eventName: string) => void;
  eventName: string;
  isOpen: boolean;
  resetFormRef: React.MutableRefObject<(() => void) | null>;
}

const EventTableModalContext = createContext<EventModalContextProps | undefined>(undefined);

export function EventTableModalProvider() {
  const [isOpen, setIsOpen] = useState(false);
  const [eventName, setEventName] = useState('');
  const { getEvents } = useEvents();
  const { events, groups, isLoading } = getEvents();
  const resetFormRef = useRef<(() => void) | null>(null);

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    // Reset the form when closing

    setIsOpen(false);
  };

  const cancelModal = () => {
    if (resetFormRef.current) {
      resetFormRef.current();
    }
    closeModal();
  };

  return (
    <EventTableModalContext.Provider
      value={{
        open: openModal,
        close: closeModal,
        cancel: cancelModal,
        isOpen,
        setEventName,
        eventName,
        resetFormRef,
      }}
    >
      <EventTableFormContextProvider defaultEvents={events} defaultGroups={groups}>
        <>
          <EventTableModal />
          <EventTable />
        </>
      </EventTableFormContextProvider>
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
