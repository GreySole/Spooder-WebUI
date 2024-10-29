import { KeyedObject } from '../../ui/Types';
import {
  useGetMonitorLogsQuery,
  useGetServerStateQuery,
  useGetSystemStatusQuery,
} from '../api/serverSlice';

export default function useServer() {
  function getServerState() {
    const { data, isLoading, error } = useGetServerStateQuery(null);
    return {
      data,
      isLoading,
      error,
    };
  }

  function getMonitorLogs() {
    const { data, isLoading, error } = useGetMonitorLogsQuery(null);
    return {
      data,
      isLoading,
      error,
    };
  }

  function getSystemStatus() {
    const { data, isLoading, error, refetch } = useGetSystemStatusQuery(null);
    return {
      data,
      isLoading,
      error,
      refetch,
    };
  }

  return {
    getServerState,
    getMonitorLogs,
    getSystemStatus,
  };
}
