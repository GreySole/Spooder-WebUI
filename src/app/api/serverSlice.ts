import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const serverApi = createApi({
  reducerPath: 'serverApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin }),
  endpoints: (builder) => ({
    getServerState: builder.query({
      query: () => 'server_state',
    }),
    getSettingsBackups: builder.query({
      query: () => '/recovery/get_backups_settings',
    }),
    getPluginsBackups: builder.query({
      query: () => '/recovery/get_backups_plugins',
    }),
    checkInSettings: builder.mutation({
      query: (form) => ({
        url: '/recovery/checkin_settings',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    checkInPlugins: builder.mutation({
      query: (form) => ({
        url: '/recovery/checkin_plugins',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    backupSettings: builder.mutation({
      query: () => ({
        url: '/recovery/backup_settings',
        method: 'post',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    backupPlugins: builder.mutation({
      query: () => ({
        url: '/recovery/backup_plugins',
        method: 'post',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    deleteBackupSettings: builder.mutation({
      query: (form) => ({
        url: '/recovery/delete_backup_settings',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    deleteBackupPlugins: builder.mutation({
      query: (form) => ({
        url: '/recovery/delete_backup_plugins',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    restoreSettings: builder.mutation({
      query: (form) => ({
        url: '/recovery/restore_settings',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    restorePlugins: builder.mutation({
      query: (form) => ({
        url: '/recovery/restore_plugins',
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
  useGetServerStateQuery,
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
} = serverApi;
