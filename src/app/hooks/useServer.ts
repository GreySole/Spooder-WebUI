import { useGetServerStateQuery } from '../api/serverSlice';

export default function useServer() {
  function getServerState() {
    const { data, isLoading, error } = useGetServerStateQuery(null);
    return {
      data,
      isLoading,
      error,
    };
  }

  return { getServerState };
}
