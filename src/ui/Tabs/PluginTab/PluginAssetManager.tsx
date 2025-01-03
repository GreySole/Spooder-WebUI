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
} from '@greysole/spooder-component-library';
import useTheme from '@greysole/spooder-component-library/dist/types/context/ThemeContext';
import usePlugins from '../../../app/hooks/usePlugins';
import { PluginComponentProps } from '../../Types';
import { usePluginContext } from './context/PluginTabFormContext';

export default function PluginAssetManager(props: PluginComponentProps) {
  const { pluginName } = props;
  const { plugins, isReady, reloadPlugins } = usePluginContext();
  const { getDeletePluginAsset, getUploadPluginAsset, getPluginAssets } = usePlugins();
  const { deletePluginAsset } = getDeletePluginAsset();
  const { uploadPluginAsset, error: pluginUploadError } = getUploadPluginAsset();
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
      reloadPlugins();
      setAssetFilePreview('');
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

  async function uploadPluginAssetClick(file: File | undefined) {
    if (file === undefined) {
      return;
    }
    let assetPath = path.join(pluginName, plugin.assetBrowserPath);
    var fd = new FormData();
    fd.append('file', file);

    const requestOptions = {
      method: 'POST',
      body: fd,
    };
    let uploadReq = await uploadPluginAsset(assetPath, fd);

    reloadPlugins();
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
    <Border borderWidth='2px' borderColor={themeConstants.assets}>
      <Box width='100%' flexFlow='column' padding='medium'>
        <Stack spacing='small'>
          <ButtonRow
            buttons={[
              { icon: faArrowLeft, iconSize: 'lg', onClick: () => browseFolder('..') },
              { icon: faArrowUp, iconSize: 'lg', onClick: () => browseFolder('/') },
              { icon: faHouse, iconSize: 'lg', onClick: () => browseFolder('/') },
              { icon: faSync, iconSize: 'lg', onClick: () => browseFolder('') },
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
            buttons={[
              { icon: faUpload, iconSize: 'lg', onClick: handleAssetUploadClick },
              { icon: faTrash, iconSize: 'lg', onClick: deleteAsset, color: themeConstants.delete },
            ]}
          />
          <input
            type='file'
            id='input-file'
            plugin-name={pluginName}
            onChange={(e) => uploadPluginAssetClick(e?.target?.files?.[0])}
            style={{ display: 'none' }}
          />
        </Stack>
      </Box>
    </Border>
  );
}
