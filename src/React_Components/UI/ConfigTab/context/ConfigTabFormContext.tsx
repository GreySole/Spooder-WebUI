import { ReactNode, createContext } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import useEvents from '../../../../app/hooks/useEvents';
import LoadingCircle from '../../LoadingCircle';
import { KeyedObject } from '../../../Types';

interface ConfigTabContextProviderProps {
  children: ReactNode;
  defaultConfig:KeyedObject;
}

export default function ConfigTabFormContextProvider(props: ConfigTabContextProviderProps) {
  const { children, defaultConfig } = props;

  const ConfigForm = useForm({
    defaultValues: {
      ...defaultConfig
    },
  });

  

  return <FormProvider {...ConfigForm}>{children}</FormProvider>;
}
