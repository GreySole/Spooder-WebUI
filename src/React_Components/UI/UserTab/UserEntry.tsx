import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import BoolSwitch from '../common/input/controlled/BoolSwitch';
import useUsers from '../../../app/hooks/useUsers';
import { useFormContext } from 'react-hook-form';
import Button from '../common/input/controlled/Button';
import FormTextInput from '../common/input/form/FormTextInput';

interface UserEntryProps {
  userKey: string;
}

export default function UserEntry(props: UserEntryProps) {
  const { userKey } = props;
  const { watch, setValue, unregister } = useFormContext();
  const user = watch(`trusted_users.${userKey}`);
  const hasPassword = watch(`trusted_users_pw.${userKey}`, false);
  const { getResetPassword } = useUsers();
  const { resetPassword } = getResetPassword();

  console.log('UserEntry', userKey, user, hasPassword);

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
      unregister(`trusted_users.${userKey}`);
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
    setValue(`trusted_users.${userKey}.permission`, newPermissions);
  };

  return (
    <div key={userKey} className='user-container'>
      <div className='user-entry'>
        <FormTextInput formKey={`trusted_users.${userKey}.username`} label='Username' />
        <div className='user-section'>
          <BoolSwitch
            label='Admin'
            value={user.permission.includes('a')}
            onChange={() => togglePermission('a')}
          />
          <BoolSwitch
            label='Mod UI'
            value={user.permission.includes('m')}
            onChange={() => togglePermission('m')}
          />
        </div>
        <FormTextInput formKey={`trusted_users.${userKey}.verify.twitch`} label='Twitch Username' />
        <FormTextInput
          formKey={`trusted_users.${userKey}.verify.discord`}
          label='Discord User ID'
        />
      </div>
      <div className='user-actions'>
        <Button label={''} icon={faTrash} iconSize='lg' onClick={() => deleteUser()} />
        {hasPassword ? (
          <Button label='Reset Password' onClick={() => safeDeleteUserPassword()} />
        ) : null}
      </div>
    </div>
  );
}
