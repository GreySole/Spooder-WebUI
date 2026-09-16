import { FieldValues } from 'react-hook-form';
import {
  useDeleteEventStorageValueMutation,
  useGetChatCommandsQuery,
  useGetEventGraphsQuery,
  useGetEventStorageQuery,
  useGetNodeManifestQuery,
  useGetOperationNodesQuery,
  useSaveEventGraphsMutation,
  useSetEventStorageValueMutation,
  useTriggerNowMutation,
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

  function getEventStorage(eventName: string) {
    const { data, isLoading, error, refetch } = useGetEventStorageQuery(eventName);
    return {
      values: data,
      isLoading,
      error,
      refetch,
    };
  }

  function getSetEventStorageValue() {
    const [setEventStorageValueMutation, { isLoading, error }] = useSetEventStorageValueMutation();
    function setEventStorageValue(eventName: string, key: string, value: unknown) {
      return setEventStorageValueMutation({ eventName, key, value }).then((response) => {
        if (response.error) {
          showError('An error occurred while saving the value.');
        }
        return response;
      });
    }

    return { setEventStorageValue, isLoading, error };
  }

  function getDeleteEventStorageValue() {
    const [deleteEventStorageValueMutation, { isLoading, error }] = useDeleteEventStorageValueMutation();
    function deleteEventStorageValue(eventName: string, key: string) {
      return deleteEventStorageValueMutation({ eventName, key }).then((response) => {
        if (response.error) {
          showError('An error occurred while deleting the key.');
        }
        return response;
      });
    }

    return { deleteEventStorageValue, isLoading, error };
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

  function getTriggerNow() {
    const [triggerNowMutation, { isLoading, error }] = useTriggerNowMutation();

    function triggerNow(eventName: string, nodeId: string) {
      return triggerNowMutation({ eventName, nodeId }).then((response) => {
        if (response.error) {
          showError(
            (response.error as { data?: { message?: string } })?.data?.message ??
              'Failed to fire the trigger.',
          );
        } else {
          showSuccess('Trigger fired.');
        }
        return response;
      });
    }

    return { triggerNow, isLoading, error };
  }

  return {
    getEvents,
    getChatCommands,
    getNodeManifest,
    getOperationNodes,
    getSaveEvents,
    getEventStorage,
    getSetEventStorageValue,
    getDeleteEventStorageValue,
    getVerifyResponseScript,
    getTriggerNow,
  };
}
