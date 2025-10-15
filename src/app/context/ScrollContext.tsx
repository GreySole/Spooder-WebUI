import React, { createContext, useContext, ReactNode, useCallback, useRef, useEffect } from 'react';

interface ScrollContextType {
  scrollToTop: (options?: ScrollToOptions) => void;
  scrollToBottom: (options?: ScrollToOptions) => void;
  scrollToElement: (selector: string | Element, options?: ScrollToOptions) => void;
  scrollToPosition: (position: number, options?: ScrollToOptions) => void;
  getScrollPosition: () => {
    scrollTop: number;
    scrollLeft: number;
    scrollHeight: number;
    clientHeight: number;
  };
  isAtTop: () => boolean;
  isAtBottom: () => boolean;
  scrollContainerRef: React.RefObject<HTMLDivElement>;
}

export interface ScrollToOptions {
  behavior?: 'auto' | 'smooth';
  block?: 'start' | 'center' | 'end' | 'nearest';
  inline?: 'start' | 'center' | 'end' | 'nearest';
}

const ScrollContext = createContext<ScrollContextType | null>(null);

interface ScrollProviderProps {
  children: ReactNode;
}

export function ScrollProvider({ children }: ScrollProviderProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getScrollPosition = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollLeft, scrollHeight, clientHeight } = scrollContainerRef.current;
      return {
        scrollTop,
        scrollLeft,
        scrollHeight,
        clientHeight,
      };
    }
    return {
      scrollTop: 0,
      scrollLeft: 0,
      scrollHeight: 0,
      clientHeight: 0,
    };
  }, []);

  const scrollToTop = useCallback((options: ScrollToOptions = { behavior: 'smooth' }) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: options.behavior,
      });
    }
  }, []);

  const scrollToBottom = useCallback((options: ScrollToOptions = { behavior: 'smooth' }) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: options.behavior,
      });
    }
  }, []);

  const scrollToElement = useCallback(
    (
      selector: string | Element,
      options: ScrollToOptions = { behavior: 'smooth', block: 'center' },
    ) => {
      if (!scrollContainerRef.current) return;

      let element: Element | null = null;

      if (typeof selector === 'string') {
        element = scrollContainerRef.current.querySelector(selector);
      } else {
        element = selector;
      }

      if (element) {
        element.scrollIntoView({
          behavior: options.behavior,
          block: options.block,
          inline: options.inline,
        });
      }
    },
    [],
  );

  const scrollToPosition = useCallback(
    (position: number, options: ScrollToOptions = { behavior: 'smooth' }) => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: position,
          behavior: options.behavior,
        });
      }
    },
    [],
  );

  const isAtTop = useCallback(() => {
    if (scrollContainerRef.current) {
      return scrollContainerRef.current.scrollTop === 0;
    }
    return true;
  }, []);

  const isAtBottom = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      return Math.abs(scrollHeight - clientHeight - scrollTop) < 1;
    }
    return true;
  }, []);

  return (
    <ScrollContext.Provider
      value={{
        scrollToTop,
        scrollToBottom,
        scrollToElement,
        scrollToPosition,
        getScrollPosition,
        isAtTop,
        isAtBottom,
        scrollContainerRef,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
}

export function useScrollContext() {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScrollContext must be used within a ScrollProvider');
  }
  return context;
}
