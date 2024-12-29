import React, { createContext, useState, useContext, ReactNode } from 'react';
import Modal from '../../../common/input/general/Modal';
import EventGeneral from '../EventGeneral';
import EventCommands from '../EventCommands';
import EventTriggers from '../EventTriggers';
import { useFormContext } from 'react-hook-form';
import { EVENT_KEY } from '../FormKeys';

interface EventModalContextProps {
  open: () => void;
  close: () => void;
  setEventName: (eventName: string) => void;
}

interface EventModalContextProviderProps {
  children: ReactNode;
}

const EventTableModalContext = createContext<EventModalContextProps | undefined>(undefined);

export function EventTableModalProvider({ children }: EventModalContextProviderProps) {
  const { formState, watch } = useFormContext();
  const [isOpen, setIsOpen] = useState(false);
  const [eventName, setEventName] = useState('');
  const eventDisplayName = watch(`${EVENT_KEY}.${eventName}.name`);

  const openModal = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <EventTableModalContext.Provider value={{ open: openModal, close: closeModal, setEventName }}>
      {isOpen ? (
        <Modal
          title={eventDisplayName}
          pages={[
            {
              title: 'General',
              content: <EventGeneral eventName={eventName} />,
            },
            { title: 'Triggers', content: <EventTriggers eventName={eventName} /> },
            {
              title: 'Commands',
              content: <EventCommands eventName={eventName} />,
            },
          ]}
          footerContent={null}
          isOpen={isOpen}
          onClose={closeModal}
        />
      ) : null}
      {children}
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
