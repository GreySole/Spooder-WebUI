import { FieldValues } from 'react-hook-form';
import {
  useConnectObsMutation,
  useConnectRemoteMutation,
  useDisconnectRemoteMutation,
  useGetObsSettingsQuery,
  useGetObsStatusQuery,
  useGetScenesQuery,
  useSaveObsSettingsMutation,
} from '../api/obsSlice';
import {
  useGetCurrentPreviewSceneMutation,
  useGetCurrentProgramSceneMutation,
  useGetGroupListMutation,
  useGetGroupSceneItemListMutation,
  useGetInputListMutation,
  useGetInputMuteMutation,
  useGetInputVolumeMutation,
  useGetRecordStatusQuery,
  useGetSceneItemListMutation,
  useGetSceneListMutation,
  useGetStreamStatusQuery,
  useGetStudioModeEnabledMutation,
  useGetVolumeDeckMutation,
} from '../api/obsFetchSlice';
import {
  useGetOutpuStatusQuery,
  usePauseRecordMutation,
  useResumeRecordMutation,
  useSetCurrentPreviewSceneMutation,
  useSetCurrentProgramSceneMutation,
  useSetInputMuteMutation,
  useSetInputVolumeMutation,
  useSetSceneItemEnabledMutation,
  useSetStudioModeMutation,
  useStartRecordMutation,
  useStartStreamMutation,
  useStopRecordMutation,
  useStopStreamMutation,
  useTransitionMutation,
} from '../api/obsControlSlice';

export default function useOBS() {
  function getConnectObs() {
    const [connectObsMutation, { isLoading, isSuccess, error }] = useConnectObsMutation();
    function connectObs(host: string, port: number, password: string, remember: boolean) {
      return connectObsMutation({
        host,
        port,
        password,
        remember,
      });
    }

    return { connectObs, isLoading, isSuccess, error };
  }

  function getConnectObsRemote() {
    const [connectObsRemoteMutation, { isLoading, isSuccess, error }] = useConnectRemoteMutation();
    function connectObsRemote() {
      return connectObsRemoteMutation(null);
    }

    return { connectObsRemote, isLoading, isSuccess, error };
  }

  function getDisconnectObsRemote() {
    const [disconnectObsRemoteMutation, { isLoading, isSuccess, error }] =
      useDisconnectRemoteMutation();
    function disconnectObsRemote() {
      return disconnectObsRemoteMutation(null);
    }

    return { disconnectObsRemote, isLoading, isSuccess, error };
  }

  function getObsStatus() {
    const { data, isLoading, error, refetch } = useGetObsStatusQuery(null);
    return { data, isLoading, error, refetch };
  }

  function getObsSettings() {
    const { data, isLoading, error } = useGetObsSettingsQuery(null);
    return { data, isLoading, error };
  }

  function getScenes() {
    const { data, isLoading, error } = useGetScenesQuery(null);
    return { data, isLoading, error };
  }

  function getObsFetchApi() {
    function getStreamStatusQuery() {
      const { data, isLoading, error, refetch } = useGetStreamStatusQuery(null);
      return { data, isLoading, error, refetch };
    }

    function getRecordStatusQuery() {
      const { data, isLoading, error, refetch } = useGetRecordStatusQuery(null);
      return { data, isLoading, error, refetch };
    }

    function getInputMuteQuery() {
      const [getInputMuteMutation, { isLoading, isSuccess, error }] = useGetInputMuteMutation();
      function getInputMute() {
        return getInputMuteMutation(null);
      }

      return { getInputMute, isLoading, isSuccess, error };
    }

    function getInputVolumeQuery() {
      const [getInputVolumeMutation, { isLoading, isSuccess, error }] = useGetInputVolumeMutation();
      function getInputVolume() {
        return getInputVolumeMutation(null);
      }

      return { getInputVolume, isLoading, isSuccess, error };
    }

    function getInputListQuery() {
      const [getInputListMutation, { isLoading, isSuccess, error }] = useGetInputListMutation();
      function getInputList() {
        return getInputListMutation(null);
      }

      return { getInputList, isLoading, isSuccess, error };
    }

    function getSceneListQuery() {
      const [getSceneListMutation, { isLoading, isSuccess, error }] = useGetSceneListMutation();
      function getSceneList() {
        return getSceneListMutation(null);
      }

      return { getSceneList, isLoading, isSuccess, error };
    }

    function getSceneItemListQuery() {
      const [getSceneItemListMutation, { isLoading, isSuccess, error }] =
        useGetSceneItemListMutation();
      function getSceneItemList(sceneName: string) {
        return getSceneItemListMutation(sceneName);
      }

      return { getSceneItemList, isLoading, isSuccess, error };
    }

    function getVolumeDeckQuery() {
      const [getVolumeDeckMutation, { isLoading, isSuccess, error }] = useGetVolumeDeckMutation();
      function getVolumeDeck() {
        return getVolumeDeckMutation(null);
      }

      return { getVolumeDeck, isLoading, isSuccess, error };
    }

    function getGroupListQuery() {
      const [getGroupListMutation, { isLoading, isSuccess, error }] = useGetGroupListMutation();
      function getGroupList() {
        return getGroupListMutation(null);
      }

      return { getGroupList, isLoading, isSuccess, error };
    }

    function getGroupSceneItemListQuery() {
      const [getGroupSceneItemListMutation, { isLoading, isSuccess, error }] =
        useGetGroupSceneItemListMutation();
      function getGroupSceneItemList(sceneName: string) {
        return getGroupSceneItemListMutation(sceneName);
      }

      return { getGroupSceneItemList, isLoading, isSuccess, error };
    }

    function getStudioModeEnabledQuery() {
      const [getStudioModeEnabledMutation, { isLoading, isSuccess, error }] =
        useGetStudioModeEnabledMutation();
      function getStudioModeEnabled() {
        return getStudioModeEnabledMutation(null);
      }

      return { getStudioModeEnabled, isLoading, isSuccess, error };
    }

    function getCurrentPreviewSceneQuery() {
      const [getCurrentPreviewSceneMutation, { isLoading, isSuccess, error }] =
        useGetCurrentPreviewSceneMutation();
      function getCurrentPreviewScene() {
        return getCurrentPreviewSceneMutation(null);
      }

      return { getCurrentPreviewScene, isLoading, isSuccess, error };
    }

    function getCurrentProgramSceneQuery() {
      const [getCurrentProgramSceneMutation, { isLoading, isSuccess, error }] =
        useGetCurrentProgramSceneMutation();
      function getCurrentProgramScene() {
        return getCurrentProgramSceneMutation(null);
      }

      return { getCurrentProgramScene, isLoading, isSuccess, error };
    }

    return {
      getStreamStatusQuery,
      getRecordStatusQuery,
      getInputMuteQuery,
      getInputVolumeQuery,
      getInputListQuery,
      getVolumeDeckQuery,
      getSceneListQuery,
      getSceneItemListQuery,
      getGroupListQuery,
      getGroupSceneItemListQuery,
      getStudioModeEnabledQuery,
      getCurrentPreviewSceneQuery,
      getCurrentProgramSceneQuery,
    };
  }

  function getObsControlApi() {
    function getOutputStatus() {
      const { data, isLoading, error, refetch } = useGetOutpuStatusQuery(null);
      return { data, isLoading, error, refetch };
    }

    function getStartStream() {
      const [startStreamMutation, { isLoading, isSuccess, error }] = useStartStreamMutation();
      function startStream() {
        return startStreamMutation(null);
      }
      return { startStream, isLoading, isSuccess, error };
    }

    function getStopStream() {
      const [stopStreamMutation, { isLoading, isSuccess, error }] = useStopStreamMutation();
      function stopStream() {
        return stopStreamMutation(null);
      }
      return { stopStream, isLoading, isSuccess, error };
    }

    function getStartRecord() {
      const [startRecordMutation, { isLoading, isSuccess, error }] = useStartRecordMutation();
      function startRecord() {
        return startRecordMutation(null);
      }
      return { startRecord, isLoading, isSuccess, error };
    }

    function getStopRecord() {
      const [stopRecordMutation, { isLoading, isSuccess, error }] = useStopRecordMutation();
      function stopRecord() {
        return stopRecordMutation(null);
      }
      return { stopRecord, isLoading, isSuccess, error };
    }

    function getPauseRecord() {
      const [pauseRecordMutation, { isLoading, isSuccess, error }] = usePauseRecordMutation();
      function pauseRecord() {
        return pauseRecordMutation(null);
      }
      return { pauseRecord, isLoading, isSuccess, error };
    }
    function getResumeRecord() {
      const [resumeRecordMutation, { isLoading, isSuccess, error }] = useResumeRecordMutation();
      function resumeRecord() {
        return resumeRecordMutation(null);
      }
      return { resumeRecord, isLoading, isSuccess, error };
    }
    function getTransition() {
      const [transitionMutation, { isLoading, isSuccess, error }] = useTransitionMutation();
      function transition() {
        return transitionMutation(null);
      }
      return { transition, isLoading, isSuccess, error };
    }
    function getSetStudioMode() {
      const [setStudioModeMutation, { isLoading, isSuccess, error }] = useSetStudioModeMutation();
      function setStudioMode(studioModeEnabled: boolean) {
        return setStudioModeMutation({ studioModeEnabled });
      }
      return { setStudioMode, isLoading, isSuccess, error };
    }

    function getSetCurrentPreviewScene() {
      const [setCurrentPreviewSceneMutation, { isLoading, isSuccess, error }] =
        useSetCurrentPreviewSceneMutation();
      function setCurrentPreviewScene(sceneName: string) {
        return setCurrentPreviewSceneMutation({ sceneName });
      }
      return { setCurrentPreviewScene, isLoading, isSuccess, error };
    }

    function getSetCurrentProgramScene() {
      const [setCurrentProgramSceneMutation, { isLoading, isSuccess, error }] =
        useSetCurrentProgramSceneMutation();
      function setCurrentProgramScene(sceneName: string) {
        return setCurrentProgramSceneMutation({ sceneName });
      }
      return { setCurrentProgramScene, isLoading, isSuccess, error };
    }

    function getSetInputMute() {
      const [setInputMuteMutation, { isLoading, isSuccess, error }] = useSetInputMuteMutation();
      function setInputMute(inputName: string, inputMuted: boolean) {
        return setInputMuteMutation({ inputName, inputMuted });
      }
      return { setInputMute, isLoading, isSuccess, error };
    }

    function getSetInputVolume() {
      const [setInputVolumeMutation, { isLoading, isSuccess, error }] = useSetInputVolumeMutation();
      function setInputVolume(inputName: string, inputVolumeMul: boolean) {
        return setInputVolumeMutation({ inputName, inputVolumeMul });
      }
      return { setInputVolume, isLoading, isSuccess, error };
    }

    function getSetSceneItemEnabled() {
      const [setSceneItemEnabledMutation, { isLoading, isSuccess, error }] =
        useSetSceneItemEnabledMutation();
      function setSceneItemEnabled(
        sceneName: string,
        sceneItemId: string,
        sceneItemEnabled: boolean,
      ) {
        return setSceneItemEnabledMutation({ sceneName, sceneItemId, sceneItemEnabled });
      }
      return { setSceneItemEnabled, isLoading, isSuccess, error };
    }

    return {
      getOutputStatus,
      getStartStream,
      getStopStream,
      getStartRecord,
      getStopRecord,
      getPauseRecord,
      getResumeRecord,
      getTransition,
      getSetStudioMode,
      getSetCurrentPreviewScene,
      getSetCurrentProgramScene,
      getSetInputMute,
      getSetInputVolume,
      getSetSceneItemEnabled,
    };
  }

  async function getSaveObsSettings() {
    const [saveObsSettingsMutation, { isLoading, isSuccess, error }] = useSaveObsSettingsMutation();
    function saveObsSettings(form: FieldValues) {
      return saveObsSettingsMutation(form);
    }

    return { saveObsSettings, isLoading, isSuccess, error };
  }

  return {
    getConnectObs,
    getConnectObsRemote,
    getDisconnectObsRemote,
    getObsStatus,
    getObsSettings,
    getScenes,
    getSaveObsSettings,
    getObsFetchApi,
    getObsControlApi,
  };
}
