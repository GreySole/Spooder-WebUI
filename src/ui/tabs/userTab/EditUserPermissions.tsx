import { Expandable, BoolSwitch } from '@greysole/spooder-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface EditUserPermissionsProps {
  userId: string;
}

export default function EditUserPermissions(props: EditUserPermissionsProps) {
  const { userId } = props;
  const { watch, setValue } = useFormContext();
  const userPermissions = watch(`permissions.${userId}`);

  const togglePermission = (permission: string) => {
    let newPermissions = [...permission];
    if (newPermissions.includes(permission)) {
      newPermissions = newPermissions.slice(newPermissions.indexOf(permission), 1);
    } else {
      newPermissions.push(permission);
    }
    setValue(`permissions.${userId}`, newPermissions);
  };
  return (
    <Expandable label='Permissions'>
      <BoolSwitch
        label='Admin'
        value={userPermissions.includes('a')}
        onChange={() => togglePermission('a')}
      />
      <BoolSwitch
        label='Mod UI'
        value={userPermissions.includes('m')}
        onChange={() => togglePermission('m')}
      />
    </Expandable>
  );
}
