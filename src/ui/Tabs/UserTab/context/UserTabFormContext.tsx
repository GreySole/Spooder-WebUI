import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';

interface UserTabFormContextProviderProps {
  children: React.ReactNode;
  users: any;
}

export default function UserTabFormContextProvider(props: UserTabFormContextProviderProps) {
  const { users, children } = props;

  const UserTabForm = useForm({
    defaultValues: {
      ...users,
    },
  });

  return <FormProvider {...UserTabForm}>{children}</FormProvider>;
}
