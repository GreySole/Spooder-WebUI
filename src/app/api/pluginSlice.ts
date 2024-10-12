import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { KeyedObject, PluginsObject } from '../../ui/Types';

export const pluginApi = createApi({
  reducerPath: 'pluginApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin }),
  endpoints: (builder) => ({
    getPlugins: builder.query<PluginsObject, null>({
      query: () => '/plugins/get_list',
    }),
    browsePluginAssets: builder.query({
      query: ({ pluginName, assetName }) => ({
        url: `/plugins/browse_plugin_assets?pluginname=${pluginName}&folder=${assetName}`,
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
        url: '/plugins/install_plugin',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    uploadPluginAsset: builder.mutation({
      query: ({ assetPath, form }) => ({
        url: `/plugins/upload_plugin_asset/${assetPath}`,
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    uploadPluginIcon: builder.mutation({
      query: ({ assetPath, form }) => ({
        url: `/plugins/upload_plugin_icon/${assetPath}`,
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    deletePlugin: builder.mutation({
      query: (pluginID: string) => ({
        url: `/plugins/delete_plugin`,
        method: 'post',
        body: { pluginName: pluginID },
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    deletePluginAsset: builder.mutation({
      query: ({ pluginName, assetName }) => ({
        url: `/plugins/delete_plugin_asset`,
        method: 'post',
        body: { pluginName: pluginName, assetName: assetName },
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    exportPlugin: builder.mutation({
      query: (pluginID: string) => ({
        url: `/plugins/export_plugin/${pluginID}`,
        method: 'get',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    refreshPlugin: builder.mutation({
      query: (pluginName: string) => ({
        url: `/plugins/refresh_plugin?pluginname=${pluginName}`,
        method: 'get',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    refreshPlugins: builder.mutation({
      query: () => ({
        url: '/plugins/refresh_plugins',
        method: 'get',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    reinstallPlugin: builder.mutation({
      query: (pluginName: string) => ({
        url: `/plugins/reinstall_plugin?pluginname=${pluginName}`,
        method: 'get',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    createPlugin: builder.mutation({
      query: (form) => ({
        url: '/plugins/create_plugin',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    savePlugin: builder.mutation({
      query: ({ pluginName, newData }) => ({
        url: '/plugins/save_plugin',
        method: 'post',
        body: { pluginName, newData },
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
  useExportPluginMutation,
  useGetPluginsQuery,
  useInstallPluginMutation,
  useRefreshPluginMutation,
  useRefreshPluginsMutation,
  useReinstallPluginMutation,
  useSavePluginMutation,
  useUploadPluginAssetMutation,
  useUploadPluginIconMutation,
} = pluginApi;
