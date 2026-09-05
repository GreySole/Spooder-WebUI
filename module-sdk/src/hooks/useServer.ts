import { KeyedObject } from '../types';
import {
  useGetMonitorLogsQuery,
  useGetPublicUrlQuery,
  useGetServerStateQuery,
  useGetSystemStatusQuery,
  useSubscribeLiveLoggingMutation,
  useUnsubscribeLiveLoggingMutation,
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

  function getPublicUrl() {
    const { data, isLoading, error, refetch } = useGetPublicUrlQuery(null);
    return {
      data,
      isLoading,
      error,
      refetch,
    };
  }

  function useLiveLoggingActions() {
    const [subscribeLiveLogging] = useSubscribeLiveLoggingMutation();
    const [unsubscribeLiveLogging] = useUnsubscribeLiveLoggingMutation();
    return { subscribeLiveLogging, unsubscribeLiveLogging };
  }

  return {
    getServerState,
    getMonitorLogs,
    getSystemStatus,
    getPublicUrl,
    useLiveLoggingActions,
  };
}
