import {
  Box,
  Button,
  ButtonRow,
  TypeFace,
  useDialog,
  useToast,
} from '@greysole/spooder-component-library';
import useUsers from '../../../app/hooks/useUsers';
import { faEdit, faDeleteLeft, faTrash, faCopy } from '@fortawesome/free-solid-svg-icons';
import React from 'react';

interface PendingUserEntryProps {
  inviteCode: string;
}

export default function PendingUserEntry({ inviteCode }: PendingUserEntryProps) {
  const { getCancelPendingUser, getUsers } = useUsers();
  const { openDialog, closeDialog } = useDialog();
  const { refetch } = getUsers();
  const { cancelPendingUser } = getCancelPendingUser();
  const { showSuccess } = useToast();
  const copyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      showSuccess('Invite code copied to clipboard');
    } catch (error) {
      const textarea = document.createElement('textarea');
      textarea.value = inviteCode;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showSuccess('Invite code copied to clipboard');
    }
  };
  const deletePendingUser = () => {
    openDialog(
      'Confirm Deletion',
      <TypeFace>Are you sure you want to delete this pending user?</TypeFace>,
      [
        <Button label='Cancel' onClick={closeDialog} />,
        <Button
          label='Delete'
          onClick={() => {
            cancelPendingUser(inviteCode).then(() => refetch());
            closeDialog();
          }}
        />,
      ],
    );
  };
  return (
    <Box justifyContent='space-between' alignItems='center'>
      <TypeFace>{inviteCode}</TypeFace>
      <ButtonRow
        buttonSize='medium'
        iconSize='large'
        buttons={[
          { icon: faCopy, onClick: copyInviteCode },
          { icon: faTrash, onClick: deletePendingUser },
        ]}
      />
    </Box>
  );
}
