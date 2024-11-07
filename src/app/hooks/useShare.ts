import { FieldValues } from 'react-hook-form';
import {
  useGetActiveSharesQuery,
  useGetSharesQuery,
  useSaveSharesMutation,
  useSetShareMutation,
  useVerifyShareTargetMutation,
} from '../api/shareSlice';
import { convertReactFormToFormData } from '../../ui/util/DataUtil';

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
    const { data, isLoading, error } = useGetActiveSharesQuery(null);
    return {
      data,
      isLoading,
      error,
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

    function setShare(shareId: string, enabled: boolean, message: string) {
      const fd = new FormData();
      fd.append('shareId', shareId);
      fd.append('enabled', enabled.toString());
      fd.append('message', message);
      return new Promise((res, rej) => {
        setShareMutation(fd)
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

      const formData = convertReactFormToFormData(form);

      saveSharesMutation(formData);
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
