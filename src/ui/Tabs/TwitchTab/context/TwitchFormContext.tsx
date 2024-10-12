import React, { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

interface TwitchTabFormContextProviderProps {
  children: ReactNode;
  twitchConfig: any;
}

export default function TwitchTabFormContextProvider(props: TwitchTabFormContextProviderProps) {
  const { twitchConfig, children } = props;

  const TwitchTabForm = useForm({
    defaultValues: {
      ...twitchConfig,
    },
  });

  return <FormProvider {...TwitchTabForm}>{children}</FormProvider>;
}
