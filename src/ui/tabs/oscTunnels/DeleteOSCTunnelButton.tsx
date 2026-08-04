import React from 'react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormContext } from 'react-hook-form';
import { Box, Button, Stack } from '@spooder/webui-component-library';

interface DeleteOSCTunnelButtonProps {
  formKey: string;
}

export default function DeleteOSCTunnelButton(props: DeleteOSCTunnelButtonProps) {
  const { formKey } = props;
  const { unregister } = useFormContext();
  return (
    <Stack spacing='none'>
      <Button icon={faTrash} onClick={() => unregister(formKey)} />
    </Stack>
  );
}
