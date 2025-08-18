import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin + '/users' }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/data',
    }),
    createUser: builder.mutation({
      query: () => ({
        url: '/create_user',
        method: 'post',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    editUser: builder.mutation({
      query: (form) => ({
        url: '/edit_user',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/delete_user?id=${id}`,
        method: 'delete',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    cancelPendingUser: builder.mutation({
      query: (id) => ({
        url: `/cancel_pending_user?id=${id}`,
        method: 'delete',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    resetPassword: builder.mutation({
      query: (id) => ({
        url: `/reset_password?id=${id}`,
        method: 'get',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    saveUsers: builder.mutation({
      query: (form) => ({
        url: '/save_users',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useEditUserMutation,
  useDeleteUserMutation,
  useCancelPendingUserMutation,
  useResetPasswordMutation,
  useSaveUsersMutation,
} = userApi;
