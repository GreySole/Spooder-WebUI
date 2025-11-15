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
    getAutoBackupSettings: builder.query({
      query: () => '/get_auto_backup_settings',
    }),
    checkInSettings: builder.mutation({
      query: (form) => ({
        url: '/checkin_settings',
        method: 'post',
        body: form,
        headers: {},
      }),
    }),
    checkInPlugins: builder.mutation({
      query: (form) => ({
        url: '/checkin_plugins',
        method: 'post',
        body: form,
        headers: {},
      }),
    }),
    backupSettings: builder.mutation({
      query: (form) => ({
        url: '/backup_settings',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    backupPlugins: builder.mutation({
      query: (form) => ({
        url: '/backup_plugins',
        method: 'post',
        body: form,
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
      }),
    }),
    deleteBackupPlugins: builder.mutation({
      query: (form) => ({
        url: '/delete_backup_plugins',
        method: 'post',
        body: form,
      }),
    }),
    prepareRestoreSettings: builder.mutation({
      query: (form) => ({
        url: '/prepare_restore_settings',
        method: 'post',
        body: form,
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
    prepareRestorePlugins: builder.mutation({
      query: (form) => ({
        url: '/prepare_restore_plugins',
        method: 'post',
        body: form,
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

    setAutoBackupSettings: builder.mutation({
      query: (form) => ({
        url: '/set_auto_backup_settings',
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
  useGetAutoBackupSettingsQuery,
  useCheckInSettingsMutation,
  useCheckInPluginsMutation,
  useBackupPluginsMutation,
  useBackupSettingsMutation,
  useDeleteBackupPluginsMutation,
  useDeleteBackupSettingsMutation,
  usePrepareRestoreSettingsMutation,
  usePrepareRestorePluginsMutation,
  useRestorePluginsMutation,
  useRestoreSettingsMutation,
  useSetAutoBackupSettingsMutation,
} = recoveryApi;
