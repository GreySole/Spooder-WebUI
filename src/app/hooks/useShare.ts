import { FieldValues } from 'react-hook-form';
import {
  useCreateShareKeyMutation,
  useCreateShareMutation,
  useDeleteShareKeyMutation,
  useDeleteShareMutation,
  useGetActiveSharesQuery,
  useGetSharesQuery,
  useSaveShareMutation,
  useSaveSharesMutation,
  useSetAutoShareMutation,
  useSetShareMutation,
  useVerifyShareTargetMutation,
} from '../api/shareSlice';
import { convertReactFormToFormData, KeyedObject } from '@spooder/webui-component-library';
import { useCreateUserMutation, useDeleteUserMutation } from '../api/userSlice';

export default function useShare() {
  function getShares() {
    const { data, isLoading, error, refetch } = useGetSharesQuery(null);
    return {
      data,
      isLoading,
      error,
      refetch,
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
    const [verifyShareTargetMutation, { data, isLoading, error }] = useVerifyShareTargetMutation();
    function verifyShareTarget(shareUser: string) {
      return verifyShareTargetMutation({ shareuser: shareUser, shareplatform: 'twitch' });
    }
    return {
      verifyShareTarget,
      data,
      isLoading,
      error,
    };
  }

  function getCreateShare() {
    const [createShareMutation, { data, isLoading, error }] = useCreateShareMutation();
    function createShare(streamingPlatforms: KeyedObject) {
      return createShareMutation({ streamingPlatforms });
    }
    return {
      createShare,
      data,
      isLoading,
      error,
    };
  }

  function getDeleteShare() {
    const [deleteShareMutation, { data, isLoading, error }] = useDeleteShareMutation();
    function deleteShare(shareId: string) {
      return deleteShareMutation({ shareId: shareId });
    }
    return {
      deleteShare,
      data,
      isLoading,
      error,
    };
  }

  function getSaveShare() {
    const [saveShareMutation, { data, isLoading, error }] = useSaveShareMutation();
    function saveShare(shareId: string, shareData: FieldValues) {
      return saveShareMutation({ shareId, shareData });
    }
    return {
      saveShare,
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

  return {
    getCreateShare,
    getDeleteShare,
    getSaveShare,
    getCreateShareKey,
    getDeleteShareKey,
    getSetAutoShare,
    getShares,
    getActiveShares,
    getVerifyShareTarget,
    getSetShare,
  };
}
