import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { KeyedObject } from '../../../Types';
import { FormTextInput, FormBoolSwitch } from '@greysole/spooder-component-library';
import ObsConnectButton from './ObsConnectButton';

interface ObsLoginProps {
  obsConfig: KeyedObject;
}

export default function ObsLogin(props: ObsLoginProps) {
  const { obsConfig } = props;

  const ObsLogin = useForm({
    defaultValues: {
      ...obsConfig,
    },
  });

  return (
    <FormProvider {...ObsLogin}>
      <div className='obs-login-info'>
        <FormTextInput formKey='url' label='IP Address' />
        <FormTextInput formKey='port' label='Port' />
        <FormTextInput formKey='password' label='Password' password />
        <FormBoolSwitch formKey='remember' label='Remember' />
        <ObsConnectButton />
      </div>
    </FormProvider>
  );
}
