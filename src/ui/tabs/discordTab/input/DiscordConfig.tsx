import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormBoolSwitch } from '@spooder/webui-component-library';
import DiscordAutoSendNgrok from './DiscordAutoSendNgrok';

export default function DiscordConfig() {
  const { watch } = useFormContext();
  const autoSendNgrok = watch('autosendngrok.enabled');
  return (
    <>
      <FormBoolSwitch
        label='Send Ngrok Link to Channel on Startup'
        formKey='autosendngrok.enabled'
      />
      {autoSendNgrok ? <DiscordAutoSendNgrok formKey='' /> : null}
      <FormBoolSwitch formKey='sharenotif' label='Auto Share DM Notification' />
      <FormBoolSwitch formKey='crashreport' label='DM Crash Report' />
    </>
  );
}
