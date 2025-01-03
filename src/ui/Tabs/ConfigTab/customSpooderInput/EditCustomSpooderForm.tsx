import { useForm, FormProvider } from 'react-hook-form';
import { KeyedObject } from '../../../Types';
import React, { ReactNode } from 'react';

interface EditCustomSpooderForm {
  data: KeyedObject;
  children: ReactNode;
}

export default function EditCustomSpooderForm(props: EditCustomSpooderForm) {
  const { data, children } = props;

  const customSpooderForm = useForm({
    defaultValues: data,
  });

  return <FormProvider {...customSpooderForm}>{children}</FormProvider>;
}
