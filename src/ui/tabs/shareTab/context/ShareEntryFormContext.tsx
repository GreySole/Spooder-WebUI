import React, { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

interface ShareEntryFormContextProviderProps {
  children: ReactNode;
  shareKey: string;
  shareData: any;
}

export default function ShareEntryFormContextProvider(props: ShareEntryFormContextProviderProps) {
  const { shareData, children } = props;

  const shareEntryForm = useForm({
    defaultValues: shareData,
    mode: 'onChange',
  });

  return <FormProvider {...shareEntryForm}>{children}</FormProvider>;
}
