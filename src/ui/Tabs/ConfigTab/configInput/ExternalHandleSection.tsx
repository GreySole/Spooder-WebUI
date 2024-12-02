import React from 'react';
import { useFormContext } from 'react-hook-form';
import LinkButton from '../../../common/input/general/LinkButton';
import FormSelectDropdown from '../../../common/input/form/FormSelectDropdown';
import FormTextInput from '../../../common/input/form/FormTextInput';
import Stack from '../../../common/layout/Stack';
import Expandable from '../../../common/layout/Expandable';

export default function ExternalHandleSection() {
  const { watch } = useFormContext();
  const baseFormKey = 'network';
  const externalHandle = watch(`${baseFormKey}.externalhandle`, 'ngrok');
  const externalHTTPUrl = watch(`${baseFormKey}.external_http_url`, '');
  return (
    <Expandable label='Public Hosting'>
      <Stack spacing='medium' padding='medium'>
        <FormSelectDropdown
          label='External Handle'
          formKey={`${baseFormKey}.externalhandle`}
          options={[
            { label: 'Ngrok', value: 'ngrok' },
            { label: 'Custom', value: 'manual' },
          ]}
        />
        {externalHandle === 'ngrok' ? (
          <FormTextInput formKey={`${baseFormKey}.ngrokauthtoken`} />
        ) : (
          <>
            <FormTextInput formKey={`${baseFormKey}.external_http_url`} />
            <FormTextInput formKey={`${baseFormKey}.external_tcp_url`} />
          </>
        )}
        <LinkButton label={'Copy Mod URL'} mode='copy' link={externalHTTPUrl + '/mod'} />
      </Stack>
    </Expandable>
  );
}
