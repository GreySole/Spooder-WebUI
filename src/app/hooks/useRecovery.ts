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
    function backupSettings() {
      backupSettingsMutation(null);
    }
    return { backupSettings, isLoading, isSuccess, error };
  }

  function getBackupPlugins() {
    const [backupPluginsMutation, { isLoading, isSuccess, error }] = useBackupPluginsMutation();
    function backupPlugins() {
      backupPluginsMutation(null);
    }
    return { backupPlugins, isLoading, isSuccess, error };
  }

  function getDeleteBackupSettings() {
    const [deleteBackupSettingsMutation, { isLoading, isSuccess, error }] =
      useDeleteBackupSettingsMutation();
    function deleteBackupSettings(backupName: string) {
      const fd = new FormData();
      fd.append('backupName', backupName);
      deleteBackupSettingsMutation(fd);
    }
    return { deleteBackupSettings, isLoading, isSuccess, error };
  }

  function getDeleteBackupPlugins() {
    const [deleteBackupPluginsMutation, { isLoading, isSuccess, error }] =
      useDeleteBackupPluginsMutation();
    function deleteBackupPlugins(backupName: string) {
      const fd = new FormData();
      fd.append('backupName', backupName);
      deleteBackupPluginsMutation(fd);
    }
    return { deleteBackupPlugins, isLoading, isSuccess, error };
  }

  function getRestoreSettings() {
    const [restoreSettingsMutation, { isLoading, isSuccess, error }] = useRestoreSettingsMutation();
    function restoreSettings(backupName: string, selections: KeyedObject) {
      const fd = new FormData();
      fd.append('backupName', backupName);
      fd.append('selections', JSON.stringify(selections));
      restoreSettingsMutation(fd);
    }
    return { restoreSettings, isLoading, isSuccess, error };
  }

  function getRestorePlugins() {
    const [restorePluginsMutation, { isLoading, isSuccess, error }] = useRestorePluginsMutation();
    function restorePlugins(backupName: string, selections: KeyedObject) {
      const fd = new FormData();
      fd.append('backupName', backupName);
      fd.append('selections', JSON.stringify(selections));
      restorePluginsMutation(fd);
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
    getRestoreSettings,
    getRestorePlugins,
  };
}
