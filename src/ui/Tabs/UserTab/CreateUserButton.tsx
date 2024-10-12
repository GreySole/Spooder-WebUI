import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import Button from '../../Common/input/controlled/Button';
import { useFormContext } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { KeyedObject } from '../../Types';

export default function CreateUserButton() {
  const { setValue, watch } = useFormContext();
  const users = watch('trusted_users');
  console.log('CREATE USERS', users);
  const createUser = () => {
    let newName = 'newuser';
    let newState = {} as KeyedObject;
    let renameCount = 1;
    const newUserId = uuidv4();

    const usernames = Object.keys(users).map((key) => users[key].username);

    console.log('USERNAMES', usernames);

    while (usernames.includes(newName + renameCount) == true) {
      if (usernames.includes(newName + renameCount) == false) {
        newName += renameCount;
        break;
      } else {
        renameCount++;
      }
    }
    if (usernames.includes(newName + renameCount) == false) {
      newName += renameCount;
    }

    newState.username = newName;

    newState.permission = [];
    newState.verify = {
      twitch: '',
      discord: '',
    };

    setValue(`trusted_users.${newUserId}`, newState);
    setValue(`trusted_users_pw.${newUserId}`, false);
  };
  return (
    <div className='plugin-install-button'>
      <Button label='Create User' icon={faPlusCircle} iconSize='lg' onClick={() => createUser()} />
    </div>
  );
}
