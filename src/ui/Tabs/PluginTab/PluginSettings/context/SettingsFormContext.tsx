import React, { ReactNode } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { KeyedObject } from '../../../../Types';
import SettingsFormModal from '../SettingsFormModal';
import PluginSettingsContextProvider from './PluginSettingsContext';

interface SettingsFormContextProps {
  values: KeyedObject;
  children: ReactNode;
}

export default function SettingsFormContextProvider(props: SettingsFormContextProps) {
  const { values, children } = props;

  console.log('Settings Values', values);

  const SettingsFormContext = useForm({
    defaultValues: values,
  });

  return <FormProvider {...SettingsFormContext}>{children}</FormProvider>;
}
