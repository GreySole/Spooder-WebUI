import {
  Expandable,
  Stack,
  FormSelectDropdown,
  FormTextInput,
  LinkButton,
} from '@spooder/webui-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import HostingHandle from './publicHosting/HostingHandle';

export default function ExternalHandleSection() {
  const { watch } = useFormContext();
  const baseFormKey = 'network';
  const externalHandle = watch(`${baseFormKey}.externalhandle`, 'ngrok');
  return (
    <Expandable label='Public Hosting'>
      <Stack spacing='medium' padding='medium'>
        <FormSelectDropdown
          label='External Handle'
          formKey={`${baseFormKey}.externalhandle`}
          options={[
            {
              label: 'Disabled',
              value: 'disabled',
            },

            {
              label: 'Ngrok',
              value: 'ngrok',
            },
            {
              label: 'Motherwolf (BETA)',
              value: 'motherwolf',
            },
            {
              label: 'Manual',
              value: 'manual',
            },
          ]}
        />
        <HostingHandle />
      </Stack>
    </Expandable>
  );
}
