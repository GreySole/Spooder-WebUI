import {
  Box,
  FormTextInput,
  Expandable,
  BoolSwitch,
  TextInput,
  Stack,
} from '@greysole/spooder-component-library';
import React from 'react';

export default function CreateUserModalContent() {
  const [permissions, setPermissions] = React.useState<string>('m');
  const [username, setUsername] = React.useState<string>('');

  const togglePermission = (permission: string) => {
    let newPermissions = [...permission];
    if (newPermissions.includes(permission)) {
      newPermissions = newPermissions.slice(newPermissions.indexOf(permission), 1);
    } else {
      newPermissions.push(permission);
    }
    setPermissions(newPermissions.join(''));
  };
  return (
    <Stack spacing='medium'>
      <TextInput
        label='Username'
        value={username}
        onInput={(value) => {
          setUsername(value);
        }}
      />

      <Expandable label='Permissions'>
        <BoolSwitch
          label='Admin'
          value={permissions.includes('a')}
          onChange={() => togglePermission('a')}
        />
        <BoolSwitch
          label='Mod UI'
          value={permissions.includes('m')}
          onChange={() => togglePermission('m')}
        />
        <BoolSwitch
          label='Share UI'
          value={permissions.includes('s')}
          onChange={() => togglePermission('s')}
        />
      </Expandable>
    </Stack>
  );
}
