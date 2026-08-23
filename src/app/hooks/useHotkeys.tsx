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

// Where Enter means "new line", not "submit". The listener below is on document, so without
// this every multi-line editor in the app - a Text or Template node's box, a plugin's code
// field - silently loses its line breaks for as long as any provider is mounted.
function acceptsLineBreak(target: EventTarget | null): boolean {
  const element = target as HTMLElement | null;
  return element?.tagName === 'TEXTAREA' || element?.isContentEditable === true;
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
      if (e.key === 'Enter' && !acceptsLineBreak(e.target)) {
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
