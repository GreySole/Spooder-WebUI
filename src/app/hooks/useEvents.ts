import { FieldValues } from 'react-hook-form';
import {
  useGetChatCommandsQuery,
  useGetEventGraphsQuery,
  useGetNodeManifestQuery,
  useGetOperationNodesQuery,
  useSaveEventGraphsMutation,
  useVerifyResponseScriptMutation,
} from '../api/eventSlice';
import { useToast } from '@spooder/webui-component-library';

export default function useEvents() {
  const { showError, showSuccess } = useToast();

  function getEvents() {
    const { data, isLoading, error, refetch } = useGetEventGraphsQuery(null);
    return {
      graphs: data?.graphs,
      groups: data?.groups,
      disabledGroups: data?.disabledGroups,
      isLoading,
      error,
      refetch,
    };
  }

  function getChatCommands() {
    const { data, isLoading, error } = useGetChatCommandsQuery(null);
    return {
      data,
      isLoading,
      error,
    };
  }

  function getNodeManifest() {
    const { data, isLoading, error } = useGetNodeManifestQuery(null);
    return {
      manifests: data,
      isLoading,
      error,
    };
  }

  function getOperationNodes() {
    const { data, isLoading, error } = useGetOperationNodesQuery(null);
    return {
      operationNodes: data,
      isLoading,
      error,
    };
  }

  function getSaveEvents() {
    const [saveEventGraphsMutation, { isLoading, isSuccess, error }] = useSaveEventGraphsMutation();
    function saveEvents(form: FieldValues, successText: string, errorText: string) {
      return saveEventGraphsMutation(form).then((response) => {
        if (response.error) {
          showError(errorText);
        } else {
          showSuccess(successText);
        }
        return response;
      });
    }

    return { saveEvents, isLoading, isSuccess, error };
  }

  function getVerifyResponseScript() {
    const [verifyResponseScriptMutation, { isLoading, isSuccess, error }] =
      useVerifyResponseScriptMutation();

    function verifyResponseScript(command: string, inputMessage: string, script: string) {
      const response = verifyResponseScriptMutation({
        command,
        message: inputMessage,
        script,
      });
      return response;
    }

    return { verifyResponseScript, isLoading, isSuccess, error };
  }

  return {
    getEvents,
    getChatCommands,
    getNodeManifest,
    getOperationNodes,
    getSaveEvents,
    getVerifyResponseScript,
  };
}
