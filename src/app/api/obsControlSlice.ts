import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const obsControlApi = createApi({
  reducerPath: 'obsControlApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin + '/obs/control' }),
  endpoints: (builder) => ({
    startStream: builder.mutation({
      query: () => ({
        url: '/start_stream',
        method: 'get',
      }),
    }),
    stopStream: builder.mutation({
      query: () => ({
        url: '/stop_stream',
        method: 'get',
      }),
    }),
    startRecord: builder.mutation({
      query: () => ({
        url: '/start_record',
        method: 'get',
      }),
    }),
    stopRecord: builder.mutation({
      query: () => ({
        url: '/stop_record',
        method: 'get',
      }),
    }),
    pauseRecord: builder.mutation({
      query: () => ({
        url: '/pause_record',
        method: 'get',
      }),
    }),
    resumeRecord: builder.mutation({
      query: () => ({
        url: '/resume_record',
        method: 'get',
      }),
    }),
    transition: builder.mutation({
      query: () => ({
        url: '/transition',
        method: 'get',
      }),
    }),
    setStudioMode: builder.mutation({
      query: (form) => ({
        url: '/set_studio_mode',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    setCurrentPreviewScene: builder.mutation({
      query: (form) => ({
        url: '/set_current_preview_scene',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    setCurrentProgramScene: builder.mutation({
      query: (form) => ({
        url: '/set_current_program_scene',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    setInputMute: builder.mutation({
      query: (form) => ({
        url: '/set_input_mute',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    setInputVolume: builder.mutation({
      query: (form) => ({
        url: '/set_input_volume',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    setSceneItemEnabled: builder.mutation({
      query: (form) => ({
        url: '/set_scene_item_enabled',
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
  usePauseRecordMutation,
  useResumeRecordMutation,
  useSetCurrentPreviewSceneMutation,
  useSetCurrentProgramSceneMutation,
  useSetInputMuteMutation,
  useSetInputVolumeMutation,
  useSetSceneItemEnabledMutation,
  useSetStudioModeMutation,
  useStartRecordMutation,
  useStartStreamMutation,
  useStopRecordMutation,
  useStopStreamMutation,
  useTransitionMutation,
} = obsControlApi;
