import { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import useShare from '../../../app/hooks/useShare';
import React from 'react';
import { FormLoader } from '@greysole/spooder-component-library';

interface ShareFormContextProviderProps {
  children: ReactNode;
}

export default function ShareFormContextProvider(props: ShareFormContextProviderProps) {
  const { children } = props;
  const { getShares } = useShare();
  const { data, isLoading, error } = getShares();

  if (isLoading) {
    return <FormLoader numRows={4} />;
  }

  const ShareForm = useForm({
    defaultValues: data,
  });

  return <FormProvider {...ShareForm}>{children}</FormProvider>;
}
