import { FieldValues } from 'react-hook-form';
import {
  useGetActiveSharesQuery,
  useGetSharesQuery,
  useSaveSharesMutation,
  useSetShareMutation,
  useVerifyShareTargetMutation,
} from '../api/shareSlice';
import { convertReactFormToFormData } from '@greysole/spooder-component-library';

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
    getShares,
    getActiveShares,
    getVerifyShareTarget,
    getSetShare,
    getSaveShares,
  };
}
