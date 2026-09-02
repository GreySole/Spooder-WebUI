import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { KeyedObject, PluginsObject } from '../../ui/Types';

export const pluginApi = createApi({
  reducerPath: 'pluginApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin + '/plugin' }),
  endpoints: (builder) => ({
    getPlugins: builder.query<PluginsObject, null>({
      query: () => '/get_list',
    }),
    getPluginSettings: builder.query<PluginsObject, string>({
      query: (pluginName: string) => '/get_plugin_settings?plugin=' + pluginName,
    }),
    getPluginSettingsForm: builder.query<PluginsObject, string>({
      query: (pluginName: string) => '/get_plugin_settings_form?plugin=' + pluginName,
    }),
    getPluginEventsForm: builder.query<PluginsObject, string>({
      query: (pluginName: string) => '/get_plugin_events_form?plugin=' + pluginName,
    }),
    browsePluginAssets: builder.query({
      query: ({ pluginName, folderPath }) => ({
        url: `/browse_plugin_assets?pluginname=${pluginName}&folder=${folderPath ? folderPath : '/'}`,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
      transformResponse: (data: KeyedObject) => {
        return data.dirs;
      },
    }),
    installPlugin: builder.mutation({
      query: (form) => ({
        url: '/install_plugin',
        method: 'post',
        body: form,
      }),
    }),
    // The repo installer has existed on the backend since plugin repos landed, but nothing
    // ever called it - so installing from a URL was only possible with curl. It is the escape
    // hatch for anything no registry lists.
    installPluginFromRepo: builder.mutation({
      query: (body: { url: string; mode?: 'release' | 'source'; branch?: string }) => ({
        url: '/install_plugin_from_repo',
        method: 'post',
        body,
      }),
    }),
    uploadPluginAssets: builder.mutation({
      query: (form) => ({
        url: `/upload_plugin_asset`,
        method: 'post',
        body: form,
      }),
    }),
    uploadPluginIcon: builder.mutation({
      query: (form) => ({
        url: `/upload_plugin_icon`,
        method: 'post',
        body: form,
      }),
    }),
    setPluginEnabled: builder.mutation({
      query: (body) => ({
        url: `/set_plugin_enabled`,
        method: 'post',
        body: body,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    setPluginDevMode: builder.mutation({
      query: (body) => ({
        url: `/set_plugin_dev_mode`,
        method: 'post',
        body: body,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    deletePlugin: builder.mutation({
      query: (pluginID: string) => ({
        url: `/delete_plugin`,
        method: 'post',
        body: { pluginName: pluginID },
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    deletePluginAsset: builder.mutation({
      query: ({ pluginName, assetName }) => ({
        url: `/delete_plugin_asset`,
        method: 'post',
        body: { pluginName: pluginName, assetName: assetName },
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    exportPlugin: builder.mutation({
      query: (pluginID: string) => ({
        url: `/export_plugin?pluginname=${pluginID}`,
        method: 'get',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    refreshPlugin: builder.mutation({
      query: (pluginName: string) => ({
        url: `/refresh_plugin?pluginname=${pluginName}`,
        method: 'get',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    refreshPlugins: builder.mutation({
      query: () => ({
        url: '/refresh_plugins',
        method: 'get',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    buildPlugin: builder.mutation({
      query: (pluginName: string) => ({
        url: `/build_plugin?pluginname=${pluginName}`,
        method: 'get',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    reinstallPlugin: builder.mutation({
      query: (pluginName: string) => ({
        url: `/reinstall_plugin?pluginname=${pluginName}`,
        method: 'get',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    createPlugin: builder.mutation({
      query: (form) => ({
        url: '/create_plugin',
        method: 'post',
        body: JSON.stringify(form),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    savePluginSettings: builder.mutation({
      query: (body) => ({
        url: '/save_plugin_settings',
        method: 'post',
        body: body,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
  }),
});

export const {
  useBrowsePluginAssetsQuery,
  useCreatePluginMutation,
  useDeletePluginAssetMutation,
  useDeletePluginMutation,
  useSetPluginEnabledMutation,
  useSetPluginDevModeMutation,
  useExportPluginMutation,
  useGetPluginsQuery,
  useGetPluginSettingsQuery,
  useGetPluginSettingsFormQuery,
  useGetPluginEventsFormQuery,
  useInstallPluginMutation,
  useInstallPluginFromRepoMutation,
  useRefreshPluginMutation,
  useRefreshPluginsMutation,
  useBuildPluginMutation,
  useReinstallPluginMutation,
  useSavePluginSettingsMutation,
  useUploadPluginAssetsMutation,
  useUploadPluginIconMutation,
} = pluginApi;
