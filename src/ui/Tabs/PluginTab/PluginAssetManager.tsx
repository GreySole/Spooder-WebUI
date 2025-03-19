import React, { useRef, useState } from 'react';
import {
  faFolder,
  faImage,
  faVolumeHigh,
  faArrowLeft,
  faArrowUp,
  faHouse,
  faSync,
  faUpload,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import path from 'path-browserify';
import {
  FormLoader,
  getMediaType,
  getMediaHTML,
  Border,
  Box,
  Stack,
  ButtonRow,
  TypeFace,
  useTheme,
} from '@greysole/spooder-component-library';
import usePlugins from '../../../app/hooks/usePlugins';
import { PluginComponentProps } from '../../Types';
import { usePluginContext } from './context/PluginTabFormContext';

export default function PluginAssetManager(props: PluginComponentProps) {
  const { pluginName } = props;
  const { plugins, isReady, reloadPlugins } = usePluginContext();
  const { getDeletePluginAsset, getUploadPluginAssets, getPluginAssets } = usePlugins();
  const { deletePluginAsset } = getDeletePluginAsset();
  const { uploadPluginAssets, error: pluginUploadError } = getUploadPluginAssets();
  const { themeConstants } = useTheme();

  const audioPreviewRef = useRef<HTMLMediaElement>(null);
  const [assetFilePreview, setAssetFilePreview] = useState<string>('');
  const hiddenAssetInput = useRef<HTMLInputElement>(null);

  const [currentFolder, setCurrentFolder] = useState('/');
  const { data, isLoading, error, refetch } = getPluginAssets(pluginName, currentFolder);

  if (!isReady || isLoading) {
    return <FormLoader numRows={4} />;
  }

  const plugin = plugins?.[pluginName];

  function handleAssetUploadClick() {
    if (hiddenAssetInput.current) {
      hiddenAssetInput.current.click();
    }
  }

  function selectAsset(assetName: string) {
    let assetFilePreview = path.join(plugin.assetBrowserPath, assetName);
    if (getMediaType(assetName) == 'sound') {
      if (audioPreviewRef.current !== null) {
        audioPreviewRef.current.pause();
        audioPreviewRef.current.load();
      }
    }
    setAssetFilePreview(assetFilePreview);
  }

  async function deleteAsset() {
    deletePluginAsset(pluginName, assetFilePreview);
    if (!pluginUploadError) {
      setAssetFilePreview('');
      refetch();
    }
  }

  async function browseFolder(assetName: string) {
    let folderPath = '';
    if (assetName === '/') {
      folderPath = '/';
    } else {
      folderPath = path.join(currentFolder, assetName);
    }
    setCurrentFolder(folderPath);
    refetch();
  }

  async function uploadPluginAssetClick(files: FileList | null) {
    if (files === null) {
      return;
    }

    await uploadPluginAssets(pluginName, plugin.assetBrowserPath, files);

    refetch();
  }

  const fileTable = [];
  const folderTable = [];
  for (let p in data) {
    let fileType = getMediaType(data[p]);
    let fileIcon = <h2>{fileType}</h2>;
    if (fileType == null) {
      folderTable.push(
        <div
          className={'asset-entry' + (assetFilePreview.endsWith(data[p]) ? ' selected' : '')}
          key={data[p] + (assetFilePreview.endsWith(data[p]) ? ' selected' : '')}
          id={data[p]}
          onClick={() => selectAsset(data[p])}
          onDoubleClick={() => browseFolder(data[p])}
        >
          <FontAwesomeIcon icon={faFolder} />
          {data[p].substring(data[p].lastIndexOf('/') + 1)}
        </div>,
      );
      continue;
    } else if (fileType == 'image') {
      fileIcon = <FontAwesomeIcon icon={faImage} />;
    } else if (fileType == 'sound') {
      fileIcon = <FontAwesomeIcon icon={faVolumeHigh} />;
    }
    fileTable.push(
      <div
        className={'asset-entry' + (assetFilePreview.endsWith(data[p]) ? ' selected' : '')}
        key={data[p]}
        id={data[p]}
        onClick={() => selectAsset(data[p])}
      >
        {fileIcon}
        {data[p].substring(data[p].lastIndexOf('/') + 1)}
      </div>,
    );
  }

  let previewHTML = null;
  let previewAudio = null;
  if (assetFilePreview != null) {
    if (getMediaType(assetFilePreview) == 'sound') {
      previewAudio = path.join(plugin.assetPath, assetFilePreview);
      previewHTML = null;
    } else {
      previewAudio = null;
      previewHTML = getMediaHTML(path.join(plugin.assetPath, assetFilePreview));
    }
  }

  return (
    <Box width='100%' flexFlow='column' padding='medium'>
      <Stack spacing='small'>
        <ButtonRow
          buttonSize='large'
          iconSize='large'
          buttons={[
            { icon: faArrowLeft, onClick: () => browseFolder('..') },
            { icon: faArrowUp, onClick: () => browseFolder('/') },
            { icon: faHouse, onClick: () => browseFolder('/') },
            { icon: faSync, onClick: () => browseFolder('') },
          ]}
        />
        <TypeFace fontSize='large'>{plugin.assetBrowserPath}</TypeFace>
        <Box classes={['asset-select']} justifyContent='space-between' alignItems='center'>
          <Box width='50%' height='100%' flexFlow='column'>
            {folderTable}
            {fileTable}
          </Box>
          <Box height='100%' width='50%' justifyContent='center' alignItems='center'>
            {previewHTML}
            <audio id='audioPreview' ref={audioPreviewRef} controls>
              {previewAudio ? <source src={previewAudio}></source> : null}
            </audio>
          </Box>
        </Box>
        <ButtonRow
          buttonSize='large'
          iconSize='large'
          buttons={[
            { icon: faUpload, onClick: handleAssetUploadClick },
            { icon: faTrash, onClick: deleteAsset, color: themeConstants.delete },
          ]}
        />
        <input
          type='file'
          ref={hiddenAssetInput}
          multiple
          id='input-file'
          plugin-name={pluginName}
          onChange={(e) => uploadPluginAssetClick(e?.target?.files)}
          style={{ display: 'none' }}
        />
      </Stack>
    </Box>
  );
}
