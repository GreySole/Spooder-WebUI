import React, { ReactNode } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

interface CreatePluginFormContextProviderProps {
  children: ReactNode;
}

export default function CreatePluginFormContextProvider(
  props: CreatePluginFormContextProviderProps,
) {
  const { children } = props;

  const CreatePluginForm = useForm({});

  return <FormProvider {...CreatePluginForm}>{children}</FormProvider>;
}
