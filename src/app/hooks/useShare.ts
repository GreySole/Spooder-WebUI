import { FieldValues } from 'react-hook-form';
import {
  useCreateShareKeyMutation,
  useDeleteShareKeyMutation,
  useGetActiveSharesQuery,
  useGetSharesQuery,
  useSaveSharesMutation,
  useSetAutoShareMutation,
  useSetShareMutation,
  useVerifyShareTargetMutation,
} from '../api/shareSlice';
import { convertReactFormToFormData, KeyedObject } from '@greysole/spooder-component-library';

export default function useShare() {
  function getShares() {
    const { data, isLoading, error } = useGetSharesQuery(null);
    return {
      data,
      isLoading,
      error,
    };
  }

  function getActiveShares() {
    const { data, isLoading, error, refetch } = useGetActiveSharesQuery(null);
    return {
      data,
      isLoading,
      error,
      refetch,
    };
  }

  function getVerifyShareTarget() {
    const [verifyShareTarget, { data, isLoading, error }] = useVerifyShareTargetMutation();

    return {
      verifyShareTarget,
      data,
      isLoading,
      error,
    };
  }

  function getSetShare() {
    const [setShareMutation, { data, isLoading, error }] = useSetShareMutation();

    function setShare(
      shareId: string,
      enabled: boolean,
      joinMessage: string,
      leaveMessage: string,
    ) {
      return new Promise((res, rej) => {
        setShareMutation({
          shareId: shareId,
          enabled: enabled,
          joinMessage: joinMessage,
          leaveMessage: leaveMessage,
        })
          .then((data) => {
            res(data);
          })
          .catch((error) => {
            rej(error);
          });
      });
    }

    return {
      setShare,
      data,
      isLoading,
      error,
    };
  }

  function getSetAutoShare() {
    const [setAutoShareMutation, { data, isLoading, error }] = useSetAutoShareMutation();

    function setAutoShare(shareId: string, enabled: boolean) {
      return new Promise((res, rej) => {
        setAutoShareMutation({
          shareId: shareId,
          enabled: enabled,
        })
          .then((data) => {
            res(data);
          })
          .catch((error) => {
            rej(error);
          });
      });
    }

    return {
      setAutoShare,
      data,
      isLoading,
      error,
    };
  }

  function getCreateShareKey() {
    const [createShareKeyMutation, { data, isLoading, error }] = useCreateShareKeyMutation();

    function createShareKey(shareId: string) {
      return new Promise<KeyedObject>((res, rej) => {
        createShareKeyMutation({ shareId: shareId })
          .then((data) => {
            res(data);
          })
          .catch((error) => {
            rej(error);
          });
      });
    }

    return {
      createShareKey,
      data,
      isLoading,
      error,
    };
  }

  function getDeleteShareKey() {
    const [deleteShareKeyMutation, { data, isLoading, error }] = useDeleteShareKeyMutation();

    function deleteShareKey(shareId: string) {
      return new Promise((res, rej) => {
        deleteShareKeyMutation({ shareId: shareId })
          .then((data) => {
            res(data);
          })
          .catch((error) => {
            rej(error);
          });
      });
    }

    return {
      deleteShareKey,
      data,
      isLoading,
      error,
    };
  }

  function getSaveShares() {
    const [saveSharesMutation, { data, isLoading, error }] = useSaveSharesMutation();
    function saveShares(form: FieldValues) {
      console.log('SAVING', form);

      saveSharesMutation(form);
    }
    return {
      saveShares,
      data,
      isLoading,
      error,
    };
  }

  return {
    getCreateShareKey,
    getDeleteShareKey,
    getSetAutoShare,
    getShares,
    getActiveShares,
    getVerifyShareTarget,
    getSetShare,
    getSaveShares,
  };
}
