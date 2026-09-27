import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type OverlayWidgetFieldType = 'text' | 'number' | 'color' | 'boolean' | 'select';

export interface OverlayWidgetField {
  label: string;
  type: OverlayWidgetFieldType;
  options?: { label: string; value: string }[];
  optionsFrom?: 'events' | 'eventKeys';
  dependsOn?: string;
  showIf?: { field: string; equals: any };
  min?: number;
  max?: number;
  step?: number;
}

// A built-in widget the overlay can draw. The settings form is described by the backend so a
// new widget needs no editor changes.
export interface OverlayWidgetDef {
  id: string;
  label: string;
  category: string;
  description: string;
  form: { [field: string]: OverlayWidgetField };
  defaults: { [field: string]: any };
  defaultSize: { width: number; height: number };
}

// One thing on a layout: a plugin's overlay page or a widget. `displayName` is response-only.
export interface OverlayLayer {
  id: string;
  type: 'plugin' | 'widget';
  pluginName?: string;
  widgetType?: string;
  displayName: string;
  settings?: { [key: string]: any };
  x: number;
  y: number;
  width: number;
  height: number;
}

// A widget layer is named by its Label setting when it has one, and by its widget type otherwise.
export function layerDisplayName(layer: OverlayLayer): string {
  const label = layer.type === 'widget' ? layer.settings?.label : undefined;
  return typeof label === 'string' && label.trim() !== '' ? label : layer.displayName;
}

export interface OverlayCanvasSize {
  width: number;
  height: number;
}

export interface OverlayContainerConfig {
  layout: string;
  canvas: OverlayCanvasSize;
  // Front-to-back: the first layer renders in front.
  layers: OverlayLayer[];
  plugins: { pluginName: string; displayName: string; category: string }[];
  widgets: OverlayWidgetDef[];
  eventKeys: { [eventName: string]: string[] };
}

export const overlayContainerApi = createApi({
  reducerPath: 'overlayContainerApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin + '/overlay_container' }),
  tagTypes: ['OverlayContainer', 'OverlayLayouts'],
  endpoints: (builder) => ({
    getOverlayContainerConfig: builder.query<OverlayContainerConfig, string>({
      query: (layout) => `/config?layout=${encodeURIComponent(layout)}`,
      providesTags: (_result, _error, layout) => [{ type: 'OverlayContainer', id: layout }],
    }),
    getOverlayLayouts: builder.query<{ layouts: string[] }, void>({
      query: () => '/layouts',
      providesTags: ['OverlayLayouts'],
    }),
    // Saving under a name that doesn't exist yet creates that layout.
    saveOverlayContainerConfig: builder.mutation<
      { status: string; layout: string },
      {
        layout: string;
        canvas: OverlayCanvasSize;
        layers: Omit<OverlayLayer, 'displayName'>[];
      }
    >({
      query: (body) => ({ url: '/save', method: 'post', body }),
      invalidatesTags: (_result, _error, { layout }) => [
        { type: 'OverlayContainer', id: layout },
        'OverlayLayouts',
      ],
    }),
    renameOverlayLayout: builder.mutation<{ status: string; layout: string }, { from: string; to: string }>({
      query: (body) => ({ url: '/rename', method: 'post', body }),
      invalidatesTags: ['OverlayContainer', 'OverlayLayouts'],
    }),
    deleteOverlayLayout: builder.mutation<{ status: string }, { layout: string }>({
      query: (body) => ({ url: '/delete', method: 'post', body }),
      invalidatesTags: ['OverlayContainer', 'OverlayLayouts'],
    }),
  }),
});

export const {
  useGetOverlayContainerConfigQuery,
  useGetOverlayLayoutsQuery,
  useSaveOverlayContainerConfigMutation,
  useRenameOverlayLayoutMutation,
  useDeleteOverlayLayoutMutation,
} = overlayContainerApi;
