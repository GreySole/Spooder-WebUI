import {
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
} from '../api/pluginSlice';

export default function usePlugins() {
  function getInstallPlugin() {
    const [installPluginMutation, { isLoading, isSuccess, error }] = useInstallPluginMutation();
    function installPlugin(file: File) {
      const form = new FormData();
      form.append('file', file);
      installPluginMutation(form);
    }

    return { installPlugin, isLoading, isSuccess, error };
  }

  function getUploadPluginAsset() {
    const [uploadPluginAssetMutation, { isLoading, isSuccess, error }] =
      useUploadPluginAssetMutation();
    function uploadPluginAsset(assetPath: string, form: FormData) {
      uploadPluginAssetMutation({ assetPath, form });
    }
    return { uploadPluginAsset, isLoading, isSuccess, error };
  }

  function getUploadPluginIcon() {
    const [uploadPluginIconMutation, { isLoading, isSuccess, error }] =
      useUploadPluginIconMutation();
    function uploadPluginIcon(assetPath: string, form: FormData) {
      uploadPluginIconMutation({ assetPath, form });
    }
    return { uploadPluginIcon, isLoading, isSuccess, error };
  }

  function getDeletePlugin() {
    const [deletePluginMutation, { isLoading, isSuccess, error }] = useDeletePluginMutation();
    function deletePlugin(pluginName: string) {
      deletePluginMutation(pluginName);
    }
    return { deletePlugin, isLoading, isSuccess, error };
  }

  function getDeletePluginAsset() {
    const [deletePluginAssetMutation, { isLoading, isSuccess, error }] =
      useDeletePluginAssetMutation();
    function deletePluginAsset(pluginName: string, assetName: string) {
      deletePluginAssetMutation({ pluginName, assetName });
    }
    return { deletePluginAsset, isLoading, isSuccess, error };
  }

  function getExportPlugin() {
    const [exportPluginMutation, { isLoading, isSuccess, error }] = useExportPluginMutation();
    function exportPlugin(pluginName: string) {
      exportPluginMutation(pluginName);
    }
    return { exportPlugin, isLoading, isSuccess, error };
  }

  function getRefreshPlugin() {
    const [refreshPluginMutation, { isLoading, isSuccess, error }] = useRefreshPluginMutation();
    function refreshPlugin(pluginName: string) {
      refreshPluginMutation(pluginName);
    }
    return { refreshPlugin, isLoading, isSuccess, error };
  }

  function getRefreshPlugins() {
    const [refreshPluginsMutation, { isLoading, isSuccess, error }] = useRefreshPluginsMutation();
    function refreshPlugins() {
      refreshPluginsMutation(null);
    }
    return { refreshPlugins, isLoading, isSuccess, error };
  }

  function getReinstallPlugin() {
    const [reinstallPluginMutation, { isLoading, isSuccess, error }] = useReinstallPluginMutation();
    function reinstallPlugin(pluginName: string) {
      reinstallPluginMutation(pluginName);
    }
    return { reinstallPlugin, isLoading, isSuccess, error };
  }

  function getCreatePlugin() {
    const [createPluginMutation, { isLoading, isSuccess, error }] = useCreatePluginMutation();
    function createPlugin(form: FormData) {
      createPluginMutation(form);
    }
    return { createPlugin, isLoading, isSuccess, error };
  }

  function getSavePlugin() {
    const [savePluginMutation, { isLoading, isSuccess, error }] = useSavePluginMutation();
    function savePlugin(pluginName: string, newData: any) {
      savePluginMutation({ pluginName, newData });
    }
    return { savePlugin, isLoading, isSuccess, error };
  }

  function getPlugins() {
    const { isLoading, error, data, refetch } = useGetPluginsQuery(null);
    return {
      isLoading,
      error,
      data,
      refetch,
    };
  }

  function getPluginAssets(pluginName: string, assetName: string) {
    const { isLoading, error, data, refetch } = useBrowsePluginAssetsQuery({
      pluginName,
      assetName,
    });
    return {
      isLoading,
      error,
      data,
      refetch,
    };
  }

  return {
    getInstallPlugin,
    getPlugins,
    getPluginAssets,
    getUploadPluginAsset,
    getUploadPluginIcon,
    getDeletePlugin,
    getDeletePluginAsset,
    getExportPlugin,
    getRefreshPlugin,
    getRefreshPlugins,
    getReinstallPlugin,
    getCreatePlugin,
    getSavePlugin,
  };
}
