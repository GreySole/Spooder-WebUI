import {
  useBrowsePluginAssetsQuery,
  useCreatePluginMutation,
  useDeletePluginAssetMutation,
  useDeletePluginMutation,
  useExportPluginMutation,
  useGetPluginEventsFormQuery,
  useGetPluginSettingsFormQuery,
  useGetPluginSettingsQuery,
  useGetPluginsQuery,
  useInstallPluginMutation,
  useRefreshPluginMutation,
  useRefreshPluginsMutation,
  useReinstallPluginMutation,
  useSavePluginSettingsMutation,
  useSetPluginEnabledMutation,
  useUploadPluginAssetsMutation,
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

  function getUploadPluginAssets() {
    const [uploadPluginAssetsMutation, { isLoading, isSuccess, error }] =
      useUploadPluginAssetsMutation();
    function uploadPluginAssets(pluginName: string, assetPath: string, files: FileList) {
      console.log('uploadPluginAsset', pluginName, assetPath, files);
      const fd = new FormData();
      Array.from(files).forEach((file, index) => {
        fd.append(`files`, file);
      });
      fd.append('pluginName', pluginName);
      fd.append('assetPath', assetPath ?? '/');
      return uploadPluginAssetsMutation(fd);
    }
    return { uploadPluginAssets, isLoading, isSuccess, error };
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
      return deletePluginMutation(pluginName);
    }
    return { deletePlugin, isLoading, isSuccess, error };
  }

  function getSetPluginEnabled() {
    const [setPluginEnabledMutation, { isLoading, isSuccess, error }] =
      useSetPluginEnabledMutation();
    function setPluginEnabled(pluginName: string, isEnabled: boolean) {
      return setPluginEnabledMutation({ pluginName, isEnabled });
    }
    return { setPluginEnabled, isLoading, isSuccess, error };
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
    function createPlugin(
      internalName: string,
      pluginName: string,
      author: string,
      description: string,
    ) {
      createPluginMutation({ internalName, pluginName, author, description });
    }
    return { createPlugin, isLoading, isSuccess, error };
  }

  function getSavePluginSettings() {
    const [savePluginSettingsMutation, { isLoading, isSuccess, error }] =
      useSavePluginSettingsMutation();
    function savePluginSettings(pluginName: string, newData: any) {
      return savePluginSettingsMutation({ pluginName, newData });
    }
    return { savePluginSettings, isLoading, isSuccess, error };
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

  function getPluginSettings(pluginName: string) {
    const { isLoading, error, data, refetch } = useGetPluginSettingsQuery(pluginName);

    return {
      isLoading,
      error,
      data,
      refetch,
    };
  }

  function getPluginSettingsForm(pluginName: string) {
    const { isLoading, error, data } = useGetPluginSettingsFormQuery(pluginName);

    return {
      isLoading,
      error,
      data,
    };
  }

  function getPluginEventsForm(pluginName: string) {
    const { isLoading, error, data } = useGetPluginEventsFormQuery(pluginName);

    return {
      isLoading,
      error,
      data,
    };
  }

  function getPluginAssets(pluginName: string, folderPath: string) {
    const { isLoading, error, data, refetch } = useBrowsePluginAssetsQuery({
      pluginName,
      folderPath,
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
    getPluginSettings,
    getPluginSettingsForm,
    getPluginEventsForm,
    getPluginAssets,
    getUploadPluginAssets,
    getUploadPluginIcon,
    getDeletePlugin,
    getSetPluginEnabled,
    getDeletePluginAsset,
    getExportPlugin,
    getRefreshPlugin,
    getRefreshPlugins,
    getReinstallPlugin,
    getCreatePlugin,
    getSavePluginSettings,
  };
}
