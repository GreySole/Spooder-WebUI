import React from 'react';
import FormBoolSwitch from '../../../common/input/form/FormBoolSwitch';
import { useFormContext } from 'react-hook-form';
import DiscordAutoSendNgrok from './DiscordAutoSendNgrok';

export default function DiscordConfig() {
  const { watch } = useFormContext();
  const autoSendNgrok = watch('autosendngrok.enabled');
  return (
    <>
      {
        <>
          <div className='config-variable'>
            <FormBoolSwitch
              label='Send Ngrok Link to Channel on Startup'
              formKey='autosendngrok.enabled'
            />
            {autoSendNgrok ? <DiscordAutoSendNgrok formKey='' /> : null}
          </div>
          <div className='config-variable'>
            <FormBoolSwitch formKey='sharenotif' label='Auto Share DM Notification' />
          </div>
          <div className='config-variable'>
            <FormBoolSwitch formKey='crashreport' label='DM Crash Report' />
          </div>
        </>
      }
    </>
  );
}