import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface OverlayContainerEntry {
  pluginName: string;
  displayName: string;
  enabled: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface OverlayContainerConfig {
  order: OverlayContainerEntry[];
}

export const overlayContainerApi = createApi({
  reducerPath: 'overlayContainerApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin + '/overlay_container' }),
  tagTypes: ['OverlayContainer'],
  endpoints: (builder) => ({
    getOverlayContainerConfig: builder.query<OverlayContainerConfig, void>({
      query: () => '/config',
      providesTags: ['OverlayContainer'],
    }),
    // The backend only reads pluginName/enabled/x/y/width/height back - displayName is
    // response-only, recomputed from the active plugin list on every GET.
    saveOverlayContainerConfig: builder.mutation<
      { status: string },
      { order: Omit<OverlayContainerEntry, 'displayName'>[] }
    >({
      query: (body) => ({ url: '/save', method: 'post', body }),
      invalidatesTags: ['OverlayContainer'],
    }),
  }),
});

export const { useGetOverlayContainerConfigQuery, useSaveOverlayContainerConfigMutation } =
  overlayContainerApi;
