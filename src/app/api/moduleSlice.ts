import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface ModuleWidgetDescriptor {
  id: string;
  label: string;
  url: string;
}

export const moduleApi = createApi({
  reducerPath: 'moduleApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin }),
  endpoints: (builder) => ({
    getResponseHandlers: builder.query({
      query: () => '/module/get_response_handlers',
    }),
    // Keyed by module key (the src/integration/<key> folder name), same key installed
    // modules are registered under - see ModuleRoutes.ts's /widgets endpoint.
    getModuleWidgets: builder.query<{ [moduleKey: string]: ModuleWidgetDescriptor[] }, void>({
      query: () => '/module/widgets',
    }),
  }),
});

export const { useGetResponseHandlersQuery, useGetModuleWidgetsQuery } = moduleApi;
