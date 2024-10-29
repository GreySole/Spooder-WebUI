import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const recoveryApi = createApi({
  reducerPath: 'recoveryApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin + '/recovery' }),
  endpoints: (builder) => ({
    getSettingsBackups: builder.query({
      query: () => '/get_backups_settings',
    }),
    getPluginsBackups: builder.query({
      query: () => '/get_backups_plugins',
    }),
    checkInSettings: builder.mutation({
      query: (form) => ({
        url: '/checkin_settings',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    checkInPlugins: builder.mutation({
      query: (form) => ({
        url: '/checkin_plugins',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    backupSettings: builder.mutation({
      query: () => ({
        url: '/backup_settings',
        method: 'post',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    backupPlugins: builder.mutation({
      query: () => ({
        url: '/backup_plugins',
        method: 'post',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    deleteBackupSettings: builder.mutation({
      query: (form) => ({
        url: '/delete_backup_settings',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    deleteBackupPlugins: builder.mutation({
      query: (form) => ({
        url: '/delete_backup_plugins',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    restoreSettings: builder.mutation({
      query: (form) => ({
        url: '/restore_settings',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    restorePlugins: builder.mutation({
      query: (form) => ({
        url: '/restore_plugins',
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
  useGetSettingsBackupsQuery,
  useGetPluginsBackupsQuery,
  useCheckInSettingsMutation,
  useCheckInPluginsMutation,
  useBackupPluginsMutation,
  useBackupSettingsMutation,
  useDeleteBackupPluginsMutation,
  useDeleteBackupSettingsMutation,
  useRestorePluginsMutation,
  useRestoreSettingsMutation,
} = recoveryApi;
