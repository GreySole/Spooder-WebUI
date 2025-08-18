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
import {
  FormLoader,
  getMediaType,
  Border,
  Box,
  Stack,
  ButtonRow,
  TypeFace,
  useTheme,
  FileDropZone,
} from '@greysole/spooder-component-library';
import usePlugins from '../../../app/hooks/usePlugins';
import { PluginComponentProps } from '../../Types';
import { usePluginContext } from './context/PluginTabFormContext';
import PluginAssetPreview from './PluginAssetPreview';

export default function PluginAssetManager(props: PluginComponentProps) {
  const { pluginName } = props;
  const { plugins, isReady, reloadPlugins } = usePluginContext();
  const { getDeletePluginAsset, getUploadPluginAssets, getPluginAssets } = usePlugins();
  const { deletePluginAsset } = getDeletePluginAsset();
  const { uploadPluginAssets, error: pluginUploadError } = getUploadPluginAssets();
  const { themeConstants } = useTheme();

  const [assetFilePreview, setAssetFilePreview] = useState<string>('');
  const hiddenAssetInput = useRef<HTMLInputElement>(null);

  const [currentFolder, setCurrentFolder] = useState('/');
  const { data, isLoading, error, refetch } = getPluginAssets(pluginName, currentFolder);

  function pathJoin(...segments: string[]) {
    segments = segments.map((segment) => segment.replace(/(^\/+|\/+$)/g, ''));
    let parts: string[] = [];
    for (let segment of segments) {
      segment = segment.replace(/(^\/+|\/+$)/g, '');
      if (segment === '..') {
        if (parts.length > 0) {
          parts.pop();
        }
      } else if (segment !== '' && segment !== '.') {
        parts.push(segment);
      }
    }
    return '/' + parts.join('/');
  }

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
    let assetFilePreview = pathJoin(plugin.assetBrowserPath, assetName);
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
      folderPath = pathJoin(currentFolder, assetName);
    }
    setCurrentFolder(folderPath);
    refetch();
  }

  async function uploadPluginAssetClick(files: FileList | null) {
    if (files === null) {
      return;
    }

    await uploadPluginAssets(pluginName, currentFolder, files);

    refetch();
  }

  function handleDroppedFiles(files: FileList | File) {
    uploadPluginAssets(pluginName, currentFolder, files as FileList).then(() => {
      refetch();
    });
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

  return (
    <Box width='100%' height='100%' flexFlow='column' padding='medium'>
      <Stack spacing='small'>
        <ButtonRow
          buttonSize='large'
          iconSize='large'
          buttons={[
            { icon: faArrowLeft, onClick: () => browseFolder('..') },
            { icon: faArrowUp, onClick: () => browseFolder('..') },
            { icon: faHouse, onClick: () => browseFolder('/') },
            { icon: faSync, onClick: () => browseFolder('') },
          ]}
        />
        <TypeFace fontSize='large'>{currentFolder}</TypeFace>
        <Box className='asset-select' justifyContent='space-between' alignItems='center'>
          <Box width='100%' height='100%' flexFlow='column'>
            <FileDropZone
              width='100%'
              height='100%'
              handleFile={handleDroppedFiles}
              multiple
              disableClickToBrowse
            >
              <Box width='100%' height='100%' flexFlow='column' overflow='auto' padding='small'>
                {folderTable}
                {fileTable}
              </Box>
            </FileDropZone>
          </Box>
          <PluginAssetPreview assetFilePreview={assetFilePreview} assetPath={plugin.assetPath} />
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
