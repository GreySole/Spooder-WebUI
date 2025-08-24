import { KeyedObject } from '@greysole/spooder-component-library';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import useShare from '../../../../app/hooks/useShare';
import PageCircleLoader from '../../../common/input/general/PageCircleLoader';

type ShareTabContextType = {
  shares: KeyedObject;
  refetch: () => void;
};

const ShareTabContext = createContext<ShareTabContextType | undefined>(undefined);

export const ShareTabProvider = ({ children }: { children: ReactNode }) => {
  const { getShares } = useShare();
  const { data: shares, isLoading, error, refetch } = getShares();

  if (isLoading) {
    return <PageCircleLoader />;
  }
  return (
    <ShareTabContext.Provider value={{ shares, refetch }}>{children}</ShareTabContext.Provider>
  );
};

export const useShareTab = () => {
  const context = useContext(ShareTabContext);
  if (!context) {
    throw new Error('useShareTab must be used within a ShareTabProvider');
  }
  return context;
};
