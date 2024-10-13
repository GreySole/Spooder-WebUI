import { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import useShare from '../../../app/hooks/useShare';
import LoadingCircle from '../../common/LoadingCircle';
import React from 'react';

interface ShareFormContextProviderProps {
  children: ReactNode;
}

export default function ShareFormContextProvider(props: ShareFormContextProviderProps) {
  const { children } = props;
  const { getShares } = useShare();
  const { data, isLoading, error } = getShares();

  if (isLoading) {
    return <LoadingCircle />;
  }

  const ShareForm = useForm({
    defaultValues: data,
  });

  return <FormProvider {...ShareForm}>{children}</FormProvider>;
}
