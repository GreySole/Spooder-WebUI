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

export default function PluginAssetManager(props: PluginComponentProps) {
  const { pluginName } = props;
  const { plugins, isReady, reloadPlugins } = usePluginContext();
  const { deletePluginAsset, uploadPluginAsset } = usePlugins();

  const audioPreviewRef = useRef<HTMLMediaElement>(null);
  const [assetFilePreview, setAssetFilePreview] = useState<string>('');
  const hiddenAssetInput = useRef<HTMLInputElement>(null);

  if (!isReady) {
    return null;
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
    let deleteReq = await deletePluginAsset(pluginName, assetFilePreview);
    if (!deleteReq.error) {
      reloadPlugins();
      setAssetFilePreview('');
    }
  }

  async function browseFolder(assetName: string) {
    let folderPath = '';
    if (assetName === '/') {
      folderPath = '/';
    } else {
      folderPath = path.join(plugin.assetBrowserPath, assetName);
    }
    getAssets(pluginName, folderPath);
  }

  function getAssets(name: string, folderPath: string) {
    fetch('/browse_plugin_assets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ pluginname: name, folder: folderPath }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 'ok') {
          let newPlugins = Object.assign({}, plugins);
          newPlugins[name].assetBrowserPath = folderPath;
          newPlugins[name].assets = data.dirs.sort((a: string, b: string) => {
            const assetA = a.toUpperCase();
            const assetB = b.toUpperCase();

            if (assetA < assetB) {
              return -1;
            }

            if (assetB > assetA) {
              return 1;
            }

            return 0;
          });
          reloadPlugins();
        }
      })
      .catch((error) => {});
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

  if (plugin.assets == null) {
    getAssets(pluginName, plugin.assetBrowserPath);
    return null;
  }

  let pluginAssets = plugin.assets;
  let fileTable = [];
  let folderTable = [];
  for (let p in pluginAssets) {
    let fileType = getMediaType(pluginAssets[p]);
    let fileIcon = <h2>{fileType}</h2>;
    if (fileType == null) {
      folderTable.push(
        <div
          className='asset-entry'
          key={pluginAssets[p]}
          id={pluginAssets[p]}
          onClick={() => selectAsset(pluginAssets[p])}
          onDoubleClick={() => browseFolder(pluginAssets[p])}
        >
          <FontAwesomeIcon icon={faFolder} />
          {pluginAssets[p]}
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
        className='asset-entry'
        key={pluginAssets[p]}
        id={pluginAssets[p]}
        onClick={() => selectAsset(pluginAssets[p])}
      >
        {fileIcon}
        {pluginAssets[p]}
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
