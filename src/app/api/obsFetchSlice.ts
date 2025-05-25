import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const obsFetchApi = createApi({
  reducerPath: 'obsFetchApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin + '/obs/fetch' }),
  endpoints: (builder) => ({
    getStreamStatus: builder.query({
      query: () => ({
        url: '/get_stream_status',
      }),
      transformResponse: (response: any) => response.data,
    }),
    getRecordStatus: builder.query({
      query: () => ({
        url: '/get_record_status',
      }),
      transformResponse: (response: any) => response.data,
    }),
    getInputMute: builder.mutation({
      query: () => ({
        url: '/get_input_mute',
        method: 'get',
      }),
    }),
    getInputVolume: builder.mutation({
      query: () => ({
        url: '/get_input_volume',
        method: 'get',
      }),
    }),
    getInputList: builder.mutation({
      query: () => ({
        url: '/get_input_list',
        method: 'get',
      }),
    }),
    getVolumeDeck: builder.mutation({
      query: () => ({
        url: '/get_volume_deck',
        method: 'get',
      }),
    }),
    getSceneList: builder.mutation({
      query: () => ({
        url: '/get_scene_list',
        method: 'get',
      }),
    }),
    getSceneItemList: builder.mutation({
      query: (sceneName) => ({
        url: '/get_scene_item_list?sceneName=' + sceneName,
        method: 'get',
      }),
    }),
    getGroupList: builder.mutation({
      query: () => ({
        url: '/get_group_list',
        method: 'get',
      }),
    }),
    getGroupSceneItemList: builder.mutation({
      query: (sceneName) => ({
        url: '/get_group_scene_item_list?sceneName=' + sceneName,
        method: 'get',
      }),
    }),
    getStudioModeEnabled: builder.mutation({
      query: () => ({
        url: '/get_studio_mode_enabled',
        method: 'get',
      }),
    }),
    getCurrentPreviewScene: builder.mutation({
      query: () => ({
        url: '/get_current_preview_scene',
        method: 'get',
      }),
    }),
    getCurrentProgramScene: builder.mutation({
      query: () => ({
        url: '/get_current_program_scene',
        method: 'get',
      }),
    }),
  }),
});

export const {
  useGetStreamStatusQuery,
  useGetRecordStatusQuery,
  useGetInputMuteMutation,
  useGetInputVolumeMutation,
  useGetInputListMutation,
  useGetVolumeDeckMutation,
  useGetSceneListMutation,
  useGetSceneItemListMutation,
  useGetGroupListMutation,
  useGetGroupSceneItemListMutation,
  useGetStudioModeEnabledMutation,
  useGetCurrentPreviewSceneMutation,
  useGetCurrentProgramSceneMutation,
} = obsFetchApi;
