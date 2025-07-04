import { useGetResponseHandlersQuery } from '../api/moduleSlice';

export default function useModule() {
  function getResponseHandlers() {
    const { data, isLoading, error } = useGetResponseHandlersQuery(null);
    return {
      data,
      isLoading,
      error,
    };
  }

  return {
    getResponseHandlers,
  };
}
