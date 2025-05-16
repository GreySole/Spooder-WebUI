import React, { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

interface ShareTabFormContextProviderProps {
  children: ReactNode;
  shares: any;
}

export default function ShareTabFormContextProvider(props: ShareTabFormContextProviderProps) {
  const { shares, children } = props;

  const ShareTabForm = useForm({
    defaultValues: {
      ...shares,
    },
  });

  return <FormProvider {...ShareTabForm}>{children}</FormProvider>;
}
