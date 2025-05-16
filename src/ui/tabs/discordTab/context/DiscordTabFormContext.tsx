import React, { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

interface DiscordTabFormContextProviderProps {
  children: ReactNode;
  discordConfig: any;
}

export default function DiscordTabFormContextProvider(props: DiscordTabFormContextProviderProps) {
  const { discordConfig, children } = props;

  const DiscordTabForm = useForm({
    defaultValues: {
      ...discordConfig,
    },
  });

  return <FormProvider {...DiscordTabForm}>{children}</FormProvider>;
}
