import { FieldValues } from 'react-hook-form';
import {
  useCancelPendingUserMutation,
  useCreateUserMutation,
  useDeleteUserMutation,
  useEditUserMutation,
  useGetUsersQuery,
  useResetPasswordMutation,
  useSaveUsersMutation,
} from '../api/userSlice';

export default function useUsers() {
  function getUsers() {
    const { data, isLoading, error, refetch } = useGetUsersQuery(null);
    return { data, isLoading, error, refetch };
  }

  function getCreateUser() {
    const [createUserMutation, { data, isLoading, error }] = useCreateUserMutation();
    function createUser() {
      return createUserMutation(null);
    }
    return { createUser, data, isLoading, error };
  }

  function getEditUser() {
    const [editUserMutation, { data, isLoading, error }] = useEditUserMutation();
    function editUser(form: FieldValues) {
      return editUserMutation(form);
    }
    return { editUser, data, isLoading, error };
  }

  function getDeleteUser() {
    const [deleteUserMutation, { data, isLoading, error }] = useDeleteUserMutation();
    function deleteUser(id: string) {
      return deleteUserMutation(id);
    }
    return { deleteUser, data, isLoading, error };
  }

  function getCancelPendingUser() {
    const [cancelPendingUserMutation, { data, isLoading, error }] = useCancelPendingUserMutation();
    function cancelPendingUser(id: string) {
      return cancelPendingUserMutation(id);
    }
    return { cancelPendingUser, data, isLoading, error };
  }

  function getResetPassword() {
    const [resetPasswordMutation, { data, isLoading, error }] = useResetPasswordMutation();
    function resetPassword(userId: string) {
      return resetPasswordMutation(userId);
    }
    return { resetPassword, data, isLoading, error };
  }
  function getSaveUsers() {
    const [saveUsersMutation, { data, isLoading, error }] = useSaveUsersMutation();
    function saveUsers(form: FieldValues) {
      return saveUsersMutation(form);
    }
    return { saveUsers, data, isLoading, error };
  }
  return {
    getUsers,
    getCreateUser,
    getEditUser,
    getDeleteUser,
    getCancelPendingUser,
    getResetPassword,
    getSaveUsers,
  };
}
