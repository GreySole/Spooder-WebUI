import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export const HotkeysContext = createContext({
  save: () => {},
  enter: () => {},
});

interface HotkeysProps {
  children: ReactNode;
  save?: any;
  enter?: any;
}

export function useHotkeys() {
  return useContext(HotkeysContext);
}

export function HotkeysProvider(props: HotkeysProps) {
  const { children, save, enter } = props;

  useEffect(() => {
    const keyListener = (e: any) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        if (save) {
          save();
        }
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (enter) {
          enter();
        }
      }
    };
    document.addEventListener('keydown', keyListener);

    return () => {
      document.removeEventListener('keydown', keyListener);
    };
  }, [save, enter]);

  const value = { save, enter };

  return <HotkeysContext.Provider value={value}>{children}</HotkeysContext.Provider>;
}
