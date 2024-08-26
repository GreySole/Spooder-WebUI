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
  async function installPlugin(file: File) {
    const form = new FormData();
    form.append('file', file);
    const [installPlugin] = useInstallPluginMutation();
    try {
      const result = await installPlugin(form).unwrap();
      return {
        data: result,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error,
      };
    }
  }

  async function uploadPluginAsset(assetPath: string, form: FormData) {
    const [uploadPluginAsset] = useUploadPluginAssetMutation();

    try {
      const result = await uploadPluginAsset({ assetPath, form }).unwrap();
      return {
        data: result,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error,
      };
    }
  }

  async function uploadPluginIcon(assetPath: string, form: FormData) {
    const [uploadPluginIcon] = useUploadPluginIconMutation();
    uploadPluginIcon({ assetPath, form });
    try {
      const result = await uploadPluginIcon({ assetPath, form }).unwrap();
      return {
        data: result,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error,
      };
    }
  }

  async function deletePlugin(pluginName: string) {
    const [deletePlugin] = useDeletePluginMutation();
    try {
      const result = await deletePlugin(pluginName).unwrap();
      return {
        data: result,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error,
      };
    }
  }

  async function deletePluginAsset(pluginName: string, assetName: string) {
    const [deletePluginAsset] = useDeletePluginAssetMutation();
    try {
      const result = await deletePluginAsset({ pluginName, assetName }).unwrap();
      return {
        data: result,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error,
      };
    }
  }

  async function exportPlugin(pluginName: string) {
    const [exportPlugin] = useExportPluginMutation();
    try {
      const result = await exportPlugin(pluginName).unwrap();
      return {
        data: result,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error,
      };
    }
  }

  async function refreshPlugin(pluginName: string) {
    const [refreshPlugin] = useRefreshPluginMutation();
    try {
      const result = await refreshPlugin(pluginName).unwrap();
      return {
        data: result,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error,
      };
    }
  }

  async function refreshPlugins() {
    const [refreshPlugins] = useRefreshPluginsMutation();
    try {
      const result = await refreshPlugins(null).unwrap();
      return {
        data: result,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error,
      };
    }
  }

  async function reinstallPlugin(pluginName: string) {
    const [reinstallPlugin] = useReinstallPluginMutation();
    try {
      const result = await reinstallPlugin(pluginName).unwrap();
      return {
        data: result,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error,
      };
    }
  }

  async function createPlugin(form: FormData) {
    const [createPlugin] = useCreatePluginMutation();
    try {
      const result = await createPlugin(form).unwrap();
      return {
        data: result,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error,
      };
    }
  }

  async function savePlugin(pluginName: string, newData: any) {
    const [savePlugin] = useSavePluginMutation();
    try {
      const result = await savePlugin({ pluginName, newData }).unwrap();
      return {
        data: result,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error,
      };
    }
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

  function browsePluginAssets(pluginName: string, assetName: string) {
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
    getPlugins,
    createPlugin,
    installPlugin,
    reinstallPlugin,
    refreshPlugin,
    refreshPlugins,
    savePlugin,
    deletePlugin,
    deletePluginAsset,
    exportPlugin,
    browsePluginAssets,
    uploadPluginAsset,
    uploadPluginIcon,
  };
}
