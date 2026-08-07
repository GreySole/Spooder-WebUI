import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { KeyedObject } from '../../../Types';
import {
  FormTextInput,
  FormBoolSwitch,
  Stack,
  Box,
  TypeFace,
} from '@spooder/webui-component-library';
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
      <Stack spacing='medium' width='100%'>
        <TypeFace>
          Enter your OBS websocket credentials here. Click Remember to save the login to file!
        </TypeFace>
        <FormTextInput formKey='host' label='IP Address' />
        <FormTextInput formKey='port' label='Port' />
        <FormTextInput formKey='password' label='Password' password />
        <FormBoolSwitch formKey='remember' label={obsConfig.host ? 'Replace' : 'Remember'} />
        <Box>
          <ObsConnectButton />
        </Box>
      </Stack>
    </FormProvider>
  );
}
