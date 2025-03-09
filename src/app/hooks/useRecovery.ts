import { KeyedObject } from '../../ui/Types';
import {
  useBackupPluginsMutation,
  useBackupSettingsMutation,
  useCheckInPluginsMutation,
  useCheckInSettingsMutation,
  useDeleteBackupPluginsMutation,
  useDeleteBackupSettingsMutation,
  useGetPluginsBackupsQuery,
  useGetSettingsBackupsQuery,
  usePrepareRestorePluginsMutation,
  usePrepareRestoreSettingsMutation,
  useRestorePluginsMutation,
  useRestoreSettingsMutation,
} from '../api/recoverySlice';

export default function useRecovery() {
  function getSettingsBackups() {
    const { data, isLoading, error, refetch } = useGetSettingsBackupsQuery(null);
    return { data, isLoading, error, refetch };
  }

  function getPluginsBackups() {
    const { data, isLoading, error, refetch } = useGetPluginsBackupsQuery(null);
    return { data, isLoading, error, refetch };
  }

  function getCheckInSettings() {
    const [checkInSettingsMutation, { isLoading, isSuccess, error }] = useCheckInSettingsMutation();
    function checkInSettings(file: File) {
      console.log('checkInSettings', file);
      const fd = new FormData();
      fd.append('file', file);
      checkInSettingsMutation(fd);
    }
    return { checkInSettings, isLoading, isSuccess, error };
  }

  function getCheckInPlugins() {
    const [checkInPluginsMutation, { isLoading, isSuccess, error }] = useCheckInPluginsMutation();
    function checkInPlugins(file: File) {
      const fd = new FormData();
      fd.append('file', file);
      checkInPluginsMutation(fd);
    }
    return { checkInPlugins, isLoading, isSuccess, error };
  }

  function getBackupSettings() {
    const [backupSettingsMutation, { isLoading, isSuccess, error }] = useBackupSettingsMutation();
    function backupSettings(backupName: string) {
      return backupSettingsMutation({ backupName });
    }
    return { backupSettings, isLoading, isSuccess, error };
  }

  function getBackupPlugins() {
    const [backupPluginsMutation, { isLoading, isSuccess, error }] = useBackupPluginsMutation();
    function backupPlugins(backupName: string) {
      return backupPluginsMutation({ backupName });
    }
    return { backupPlugins, isLoading, isSuccess, error };
  }

  function getDeleteBackupSettings() {
    const [deleteBackupSettingsMutation, { isLoading, isSuccess, error }] =
      useDeleteBackupSettingsMutation();
    function deleteBackupSettings(backupName: string) {
      const fd = new FormData();
      fd.append('backupName', backupName);
      return deleteBackupSettingsMutation(fd);
    }
    return { deleteBackupSettings, isLoading, isSuccess, error };
  }

  function getDeleteBackupPlugins() {
    const [deleteBackupPluginsMutation, { isLoading, isSuccess, error }] =
      useDeleteBackupPluginsMutation();
    function deleteBackupPlugins(backupName: string) {
      const fd = new FormData();
      fd.append('backupName', backupName);
      return deleteBackupPluginsMutation(fd);
    }
    return { deleteBackupPlugins, isLoading, isSuccess, error };
  }

  function getPrepareRestoreSettings() {
    const [prepareRestoreSettingsMutation, { isLoading, isSuccess, error }] =
      usePrepareRestoreSettingsMutation();
    function prepareRestoreSettings(backupName: string, file?: File) {
      const fd = new FormData();
      fd.append('backupName', backupName);
      if (file) {
        fd.append('file', file);
      }
      return prepareRestoreSettingsMutation(fd);
    }
    return { prepareRestoreSettings, isLoading, isSuccess, error };
  }

  function getPrepareRestorePlugins() {
    const [prepareRestorePluginsMutation, { isLoading, isSuccess, error }] =
      usePrepareRestorePluginsMutation();
    function prepareRestorePlugins(backupName: string, file?: File) {
      const fd = new FormData();
      fd.append('backupName', backupName);
      if (file) {
        fd.append('file', file);
      }
      return prepareRestorePluginsMutation(fd);
    }
    return { prepareRestorePlugins, isLoading, isSuccess, error };
  }

  function getRestoreSettings() {
    const [restoreSettingsMutation, { isLoading, isSuccess, error }] = useRestoreSettingsMutation();
    function restoreSettings(backupName: string, selections: KeyedObject) {
      const fd = { backupName, selections };
      return restoreSettingsMutation(fd);
    }
    return { restoreSettings, isLoading, isSuccess, error };
  }

  function getRestorePlugins() {
    const [restorePluginsMutation, { isLoading, isSuccess, error }] = useRestorePluginsMutation();
    function restorePlugins(backupName: string, selections: KeyedObject) {
      const fd = { backupName, selections };
      return restorePluginsMutation(fd);
    }
    return { restorePlugins, isLoading, isSuccess, error };
  }

  return {
    getSettingsBackups,
    getPluginsBackups,
    getCheckInSettings,
    getCheckInPlugins,
    getBackupSettings,
    getBackupPlugins,
    getDeleteBackupSettings,
    getDeleteBackupPlugins,
    getPrepareRestoreSettings,
    getPrepareRestorePlugins,
    getRestoreSettings,
    getRestorePlugins,
  };
}
