import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PluginsObject } from '../../React_Components/Types';

export const pluginApi = createApi({
  reducerPath: 'pluginApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin }),
  endpoints: (builder) => ({
    getPlugins: builder.query<PluginsObject, null>({
      query: () => '/plugins',
    }),
    browsePluginAssets: builder.query({
      query: ({ pluginName, assetName }) => ({
        url: `/browse_plugin_assets?pluginname=${pluginName}&assetname=${assetName}`,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    installPlugin: builder.mutation({
      query: (form) => ({
        url: '/install_plugin',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    uploadPluginAsset: builder.mutation({
      query: ({ assetPath, form }) => ({
        url: `/upload_plugin_asset/${assetPath}`,
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    uploadPluginIcon: builder.mutation({
      query: ({ assetPath, form }) => ({
        url: `/upload_plugin_icon/${assetPath}`,
        method: 'post',
        body: form,
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
        url: `/export_plugin/${pluginID}`,
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
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    savePlugin: builder.mutation({
      query: ({ pluginName, newData }) => ({
        url: '/save_plugin',
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
