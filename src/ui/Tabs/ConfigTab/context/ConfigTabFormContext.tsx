import React, { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { KeyedObject } from '../../../Types';

interface ConfigTabContextProviderProps {
  children: ReactNode;
  defaultConfig: KeyedObject;
}

export default function ConfigTabFormContextProvider(props: ConfigTabContextProviderProps) {
  const { children, defaultConfig } = props;

  const ConfigForm = useForm({
    defaultValues: {
      ...defaultConfig,
    },
  });

  return <FormProvider {...ConfigForm}>{children}</FormProvider>;
}
