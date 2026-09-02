import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface RegistrySource {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
  official: boolean;
  fetchedAt?: string | null;
  entryCount?: number;
  error?: string | null;
}

export interface CatalogEntry {
  id: string;
  kind: 'module' | 'plugin';
  name: string;
  summary: string;
  author: string;
  license: string;
  tags?: string[];
  icon?: string;
  homepage?: string;
  spooder: string;
  track: 'pinned' | 'latest';
  source: { id: string; name: string };
  compatible: boolean;
  installed: boolean;
  webuiInstalled?: boolean;
  webuiVersion?: string | null;
}

export type RestartVia = 'app' | 'supervisor' | 'manual';

export interface InstallResponse {
  status: string;
  name?: string;
  version?: string | null;
  pluginName?: string;
  restartRequired?: boolean;
  restartVia?: RestartVia;
}

export interface CatalogResponse {
  spooderVersion: string;
  sources: RegistrySource[];
  duplicates: { id: string; usedFrom: string; alsoIn: string[] }[];
  entries: CatalogEntry[];
}

export const registryApi = createApi({
  reducerPath: 'registryApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin + '/registry' }),
  // Adding or disabling a registry changes which entries exist, so both invalidate the
  // catalogue rather than leaving the list showing something that is no longer configured.
  tagTypes: ['Catalog'],
  endpoints: (builder) => ({
    getCatalog: builder.query<CatalogResponse, void>({
      query: () => '/catalog',
      providesTags: ['Catalog'],
    }),
    refreshCatalog: builder.mutation<CatalogResponse, void>({
      query: () => ({ url: '/refresh', method: 'post' }),
      invalidatesTags: ['Catalog'],
    }),
    addSource: builder.mutation<{ status: string }, { url: string; name?: string }>({
      query: (body) => ({ url: '/sources', method: 'post', body }),
      invalidatesTags: ['Catalog'],
    }),
    removeSource: builder.mutation<{ status: string }, { id: string }>({
      query: (body) => ({ url: '/sources/remove', method: 'post', body }),
      invalidatesTags: ['Catalog'],
    }),
    setSourceEnabled: builder.mutation<{ status: string }, { id: string; enabled: boolean }>({
      query: (body) => ({ url: '/sources/enabled', method: 'post', body }),
      invalidatesTags: ['Catalog'],
    }),
    // Install by id: the backend resolves which repo, which version and which hash, so the
    // browser never names an artifact to download.
    installEntry: builder.mutation<InstallResponse, { id: string }>({
      query: (body) => ({ url: '/install', method: 'post', body }),
      invalidatesTags: ['Catalog'],
    }),
    uninstallEntry: builder.mutation<InstallResponse, { id: string }>({
      query: (body) => ({ url: '/uninstall', method: 'post', body }),
      invalidatesTags: ['Catalog'],
    }),
    // Asked for separately from the install so the page can show what happened before the
    // process goes away.
    restartSpooder: builder.mutation<{ restarting: boolean; via: RestartVia }, { reason: string }>({
      query: (body) => ({ url: '/restart', method: 'post', body }),
    }),
  }),
});

export const {
  useGetCatalogQuery,
  useRefreshCatalogMutation,
  useAddSourceMutation,
  useRemoveSourceMutation,
  useSetSourceEnabledMutation,
  useInstallEntryMutation,
  useUninstallEntryMutation,
  useRestartSpooderMutation,
} = registryApi;
