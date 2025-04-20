import { FormTextInput } from '@greysole/spooder-component-library';
import React from 'react';

export default function DiscordLoginSettings() {
  return (
    <>
      <FormTextInput formKey={`master`} label='Master User ID' />
      <FormTextInput formKey={`token`} label='Bot Token' password />
    </>
  );
}
