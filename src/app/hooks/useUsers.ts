import { FieldValues } from 'react-hook-form';
import { useGetUsersQuery, useResetPasswordMutation, useSaveUsersMutation } from '../api/userSlice';

export default function useUsers() {
  function getUsers() {
    const { data, isLoading, error } = useGetUsersQuery(null);
    return { data, isLoading, error };
  }
  function getResetPassword() {
    const [resetPasswordMutation, { data, isLoading, error }] = useResetPasswordMutation();
    function resetPassword(username: string) {
      resetPasswordMutation(username);
    }
    return { resetPassword, data, isLoading, error };
  }
  function getSaveUsers() {
    const [saveUsersMutation, { data, isLoading, error }] = useSaveUsersMutation();
    function saveUsers(form: FieldValues) {
      const formData = new FormData();
      for (const [key, value] of Object.entries(form)) {
        formData.append(key, value);
      }
      saveUsersMutation(formData);
    }
    return { saveUsers, data, isLoading, error };
  }
  return { getUsers, getResetPassword, getSaveUsers };
}
