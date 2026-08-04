import { FormTextInput } from '@spooder/webui-component-library';
import React from 'react';

export default function DiscordLoginSettings() {
  return (
    <>
      <FormTextInput formKey={`master`} label='Master User ID' />
      <FormTextInput formKey={`clientId`} label='Client ID' />
      <FormTextInput formKey={`token`} label='Bot Token' password />
    </>
  );
}
