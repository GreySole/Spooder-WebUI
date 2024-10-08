import React from 'react';
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
import { getMediaType, getMediaHTML } from '../Helpers';
import { useRef, useState } from 'react';
import { PluginComponentProps } from '../../Types';
import { usePluginContext } from './context/PluginTabFormContext';
import usePlugins from '../../../app/hooks/usePlugins';
import LoadingCircle from '../LoadingCircle';

export default function PluginAssetManager(props: PluginComponentProps) {
  const { pluginName } = props;
  const { plugins, isReady, reloadPlugins } = usePluginContext();
  const { getDeletePluginAsset, getUploadPluginAsset, getPluginAssets } = usePlugins();
  const { deletePluginAsset } = getDeletePluginAsset();
  const { uploadPluginAsset, error: pluginUploadError } = getUploadPluginAsset();

  const audioPreviewRef = useRef<HTMLMediaElement>(null);
  const [assetFilePreview, setAssetFilePreview] = useState<string>('');
  const hiddenAssetInput = useRef<HTMLInputElement>(null);

  const [currentFolder, setCurrentFolder] = useState('/');
  const { data, isLoading, error, refetch } = getPluginAssets(pluginName, currentFolder);

  if (!isReady || isLoading) {
    return <LoadingCircle />;
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
          className='asset-entry'
          key={data[p]}
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
      <div className='asset-entry' key={data[p]} id={data[p]} onClick={() => selectAsset(data[p])}>
        {fileIcon}
        {data[p].substring(data[p].lastIndexOf('/') + 1)}
      </div>,
    );
  }

  let previewHTML = null;
  let previewAudio = '';
  if (assetFilePreview != null) {
    if (getMediaType(assetFilePreview) == 'sound') {
      previewAudio = path.join(plugin.assetPath, assetFilePreview);
    } else {
      previewHTML = getMediaHTML(path.join(plugin.assetPath, assetFilePreview));
    }
  }

  return (
    <div className='asset-container'>
      <div className='asset-buttons'>
        <button className='asset-button upload'>
          <FontAwesomeIcon icon={faArrowLeft} size='lg' />
        </button>
        <button
          className='asset-button'
          onClick={() => {
            browseFolder('..');
          }}
        >
          <FontAwesomeIcon icon={faArrowUp} size='lg' />
        </button>
        <button
          className='asset-button'
          onClick={() => {
            browseFolder('/');
          }}
        >
          <FontAwesomeIcon icon={faHouse} size='lg' />
        </button>
        <button
          className='asset-button refresh'
          onClick={() => {
            browseFolder('');
          }}
        >
          <FontAwesomeIcon icon={faSync} size='lg' />
        </button>
      </div>
      <div className='asset-folder-text'>{plugin.assetBrowserPath}</div>
      <div className='asset-select'>
        <div className='asset-fileselect'>
          {folderTable}
          {fileTable}
        </div>
        <div className='asset-preview'>
          {previewHTML}
          <audio id='audioPreview' ref={audioPreviewRef} controls>
            <source src={previewAudio}></source>
          </audio>
        </div>
      </div>
      <div className='asset-buttons'>
        <div className='asset-button upload' onClick={handleAssetUploadClick} plugin-name={name}>
          <FontAwesomeIcon icon={faUpload} size='lg' />
        </div>
        <div className='asset-button delete' onClick={deleteAsset}>
          <FontAwesomeIcon icon={faTrash} size='lg' />
        </div>
      </div>
      <input
        type='file'
        id='input-file'
        plugin-name={pluginName}
        onChange={(e) => uploadPluginAssetClick(e?.target?.files?.[0])}
        style={{ display: 'none' }}
      />
    </div>
  );
}
