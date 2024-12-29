import React, { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { KeyedObject } from '../../../Types';

interface ThemeTabContextProviderProps {
  children: ReactNode;
  defaultTheme: KeyedObject;
}

export default function ThemeTabFormContextProvider(props: ThemeTabContextProviderProps) {
  const { children, defaultTheme } = props;

  const ThemeForm = useForm({
    defaultValues: {
      ...defaultTheme,
    },
  });

  return <FormProvider {...ThemeForm}>{children}</FormProvider>;
}
