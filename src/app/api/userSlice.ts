import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin + '/users' }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/data',
    }),
    resetPassword: builder.mutation({
      query: (username) => ({
        url: `/reset_password?username=${username}`,
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

export const { useGetUsersQuery, useResetPasswordMutation, useSaveUsersMutation } = userApi;
