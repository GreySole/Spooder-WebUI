import React from 'react';
import useUsers from '../../app/hooks/useUsers';
import UserTabFormContextProvider from './userTab/context/UserTabFormContext';
import UserList from './userTab/UserList';
import CreateUserButton from './userTab/CreateUserButton';
import { CircleLoader, Box, SaveButton, Stack, Modal } from '@greysole/spooder-component-library';
import { Footer } from '../app/Footer';
import { CreateModalProvider } from './userTab/context/CreateModalContext';
import { EditModalProvider } from './userTab/context/EditModalContext';
import PageCircleLoader from '../common/input/general/PageCircleLoader';

export default function UserTab() {
  const { getUsers, getSaveUsers } = useUsers();
  const { data: users, isLoading, error } = getUsers();
  const { saveUsers } = getSaveUsers();

  if (isLoading) {
    return <PageCircleLoader />;
  }

  return (
    <UserTabFormContextProvider users={users}>
      <EditModalProvider>
        <CreateModalProvider>
          <Box width='100%' flexFlow='column' marginBottom='var(--footer-height)'>
            <UserList />
          </Box>
          <Footer showFooter={true}>
            <CreateUserButton />
            <SaveButton saveFunction={saveUsers} />
          </Footer>
        </CreateModalProvider>
      </EditModalProvider>
    </UserTabFormContextProvider>
  );
}
