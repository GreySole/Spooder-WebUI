import React from 'react';
import { useFormContext } from 'react-hook-form';
import LinkButton from '../../LinkButton';
import FormSelectDropdown from '../../common/input/form/FormSelectDropdown';
import FormTextInput from '../../common/input/form/FormTextInput';

export default function ExternalHandle() {
  const { watch } = useFormContext();
  const baseFormKey = 'network';
  const externalHandle = watch(`${baseFormKey}.externalhandle`, 'ngrok');
  const externalHTTPUrl = watch(`${baseFormKey}.external_http_url`, '');
  return (
    <div className='config-variable'>
      <label>
        Public Access
        <FormSelectDropdown
          label='External Handle'
          formKey={`${baseFormKey}.externalhandle`}
          options={[
            { label: 'Ngrok', value: 'ngrok' },
            { label: 'Custom', value: 'manual' },
          ]}
        />
        {externalHandle === 'ngrok' ? (
          <>
            <FormTextInput formKey={`${baseFormKey}.ngrokauthtoken`} />
          </>
        ) : (
          <>
            <FormTextInput formKey={`${baseFormKey}.external_http_url`} />
            <FormTextInput formKey={`${baseFormKey}.external_tcp_url`} />
          </>
        )}
      </label>
      <LinkButton text={'Copy Mod URL'} mode='copy' link={externalHTTPUrl + '/mod'} />
    </div>
  );
}
