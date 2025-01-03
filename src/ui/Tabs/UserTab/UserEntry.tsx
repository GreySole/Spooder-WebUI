import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FormTextInput, BoolSwitch, Button } from '@greysole/spooder-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import useUsers from '../../../app/hooks/useUsers';

interface UserEntryProps {
  userKey: string;
}

export default function UserEntry(props: UserEntryProps) {
  const { userKey } = props;
  const { watch, setValue, unregister } = useFormContext();
  const userPermissions = watch(`trusted_users.permissions.${userKey}`);
  const hasPassword = watch(`trusted_users_pw.${userKey}`, false);
  const { getResetPassword } = useUsers();
  const { resetPassword } = getResetPassword();

  console.log('UserEntry', userKey, userPermissions, hasPassword);

  const safeDeleteUserPassword = () => {
    const deleteConfirm = confirm(
      `${userKey} will have to re-verify through their Twitch or Discord to set their password again. Is that okay?`,
    );

    if (deleteConfirm == true) {
      resetPassword(userKey);
    }
  };

  const deleteUser = () => {
    const deleteConfirm = confirm(`Are you sure you want to delete ${userKey}?`);

    if (deleteConfirm == true) {
      unregister(`trusted_users.permissions.${userKey}`);
      unregister(`trusted_users.verify.twitch.${userKey}`);
      unregister(`trusted_users.verify.discord.${userKey}`);
      unregister(`trusted_users_pw.${userKey}`);
    }
  };

  const togglePermission = (permission: string) => {
    let newPermissions = [...permission];
    if (newPermissions.includes(permission)) {
      newPermissions = newPermissions.slice(newPermissions.indexOf(permission), 1);
    } else {
      newPermissions.push(permission);
    }
    setValue(`trusted_users.permissions.${userKey}`, newPermissions);
  };

  return (
    <div key={userKey} className='user-container'>
      <div className='user-entry'>
        <FormTextInput formKey={`trusted_users.usernames.${userKey}`} label='Username' />
        <FormTextInput formKey={`trusted_users.displaynames.${userKey}`} label='Display Name' />
        <div className='user-section'>
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
        </div>
        <FormTextInput formKey={`trusted_users.verify.twitch.${userKey}`} label='Twitch Username' />
        <FormTextInput
          formKey={`trusted_users.verify.discord.${userKey}`}
          label='Discord User ID'
        />
      </div>
      <div>
        <Button label={''} icon={faTrash} iconSize='lg' onClick={() => deleteUser()} />
        {hasPassword ? (
          <Button label='Reset Password' onClick={() => safeDeleteUserPassword()} />
        ) : null}
      </div>
    </div>
  );
}
