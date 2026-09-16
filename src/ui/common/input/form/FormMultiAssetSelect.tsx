import { faFileImport, faPlay, faStop, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import usePlugins from '../../../../app/hooks/usePlugins';
import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  FormLoader,
  getMediaType,
  SelectDropdown,
  TypeFace,
  useDialog,
} from '@spooder/webui-component-library';
import { useFormContext } from 'react-hook-form';
import { ASSET_PREVIEW_HEIGHT } from './FormAssetSelect';
import PluginAssetPreview from '../../../tabs/pluginTab/PluginAssetPreview';

interface FormMultiAssetSelectProps {
  formKey: string;
  label?: string;
  assetType?: string;
  pluginName: string;
  assetFolderPath: string;
}

// The multi-select sibling of FormAssetSelect: the field's value is an array of asset paths
// rather than one. It keeps the exact same box/row structure (drop zone + picker row) so it
// costs no more card height than the single-asset control - see CONTROL_HEIGHTS.asset in
// nodeLayout.ts - but the drop zone holds a scrollable grid of small preview tiles instead of
// one preview, and the picker appends its selection instead of replacing the value.
export default function FormMultiAssetSelect(props: FormMultiAssetSelectProps) {
  const { formKey, label, assetType, pluginName, assetFolderPath } = props;
  const acceptedFormat = assetType != null ? assetType + '/*' : '*';
  const { getPluginAssets, getUploadPluginAssets } = usePlugins();
  const { uploadPluginAssets } = getUploadPluginAssets();
  const { setValue, watch } = useFormContext();
  const { openDialog, closeDialog } = useDialog();

  const currentAssets: string[] = watch(formKey) ?? [];
  // Purely visual: the drop zone lights up while a file is over it, so it's clear the box will
  // take the drop rather than the browser navigating to the file.
  const [dropActive, setDropActive] = useState(false);
  // The picker is never bound to one of the array's own entries - it's a fire-once "add" control,
  // not an editor for an existing slot - so it keeps its own value and resets after each pick.
  const [pickerValue, setPickerValue] = useState('');

  const { data: assets, isLoading, error, refetch } = getPluginAssets(pluginName, assetFolderPath);
  const fileRef = useRef<HTMLInputElement>(null);
  // Only one preview plays at a time - the currently playing tile's own Audio, so a second
  // click on it (or the tile unmounting/the card closing) can stop exactly that one.
  const playingAudioRef = useRef<HTMLAudioElement | null>(null);
  const [playingKey, setPlayingKey] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      playingAudioRef.current?.pause();
    };
  }, []);

  if (isLoading || error) {
    return <FormLoader numRows={2} />;
  }

  const assetOptions = [{ label: 'Add asset...', value: '' }];
  for (let a in assets) {
    // getPluginAssets lists everything under the plugin's asset folder regardless of kind, so
    // an image field would otherwise offer sounds (and vice versa) alongside the assets it
    // actually accepts.
    if (assetType != null && getMediaType(assets[a]) !== assetType) {
      continue;
    }
    assetOptions.push({
      label: assets[a].substring(assets[a].lastIndexOf('/') + 1),
      value: assets[a],
    });
  }

  function addAsset(assetPath: string) {
    if (!assetPath) {
      return;
    }
    setValue(formKey, [...currentAssets, assetPath]);
  }

  function removeAsset(index: number) {
    setValue(
      formKey,
      currentAssets.filter((_, i) => i !== index),
    );
  }

  function isAcceptedFile(file: File): boolean {
    return assetType == null || file.type === '' || file.type.startsWith(`${assetType}/`);
  }

  async function uploadAsset(files: FileList | null) {
    if (!files || files.length === 0 || !isAcceptedFile(files[0])) {
      return;
    }
    await uploadPluginAssets(pluginName, assetFolderPath, files);
    refetch();
    addAsset(`${assetFolderPath}/${files[0].name}`);
  }

  function handlePickerChange(value: string) {
    addAsset(value);
    setPickerValue('');
  }

  // Images get a dialog because a tile this small can't show any detail; sounds have no
  // meaningful "larger" view, so a click just plays them instead.
  function showImageDialog(assetFilePreview: string) {
    openDialog(
      assetFilePreview.substring(assetFilePreview.lastIndexOf('/') + 1),
      <Box width='100%' height='60vh'>
        <PluginAssetPreview assetFilePreview={assetFilePreview} assetPath={`assets/${pluginName}`} />
      </Box>,
      [<Button key='close' label='Close' onClick={() => closeDialog()} />],
    );
  }

  function stopSound() {
    playingAudioRef.current?.pause();
    playingAudioRef.current = null;
    setPlayingKey(null);
  }

  // A second click on the tile that's already playing stops it (the tile doubles as its own
  // stop button); clicking a different one swaps to that instead of layering sounds.
  function toggleSound(key: string, assetFilePreview: string) {
    const wasPlaying = playingKey === key;
    stopSound();
    if (wasPlaying) {
      return;
    }
    const audio = new Audio(`assets/${pluginName}/${assetFilePreview}`);
    audio.addEventListener('ended', () => {
      setPlayingKey((current) => (current === key ? null : current));
    });
    playingAudioRef.current = audio;
    setPlayingKey(key);
    audio.play();
  }

  function activateTile(key: string, assetFilePreview: string) {
    const mediaType = getMediaType(assetFilePreview);
    if (mediaType === 'image') {
      showImageDialog(assetFilePreview);
    } else if (mediaType === 'sound') {
      toggleSound(key, assetFilePreview);
    }
  }

  return (
    <Box flexFlow='column'>
      {label ? <TypeFace fontWeight='bold'>{label}</TypeFace> : null}
      <div
        className='asset-drop-zone asset-multi-drop-zone'
        data-empty={currentAssets.length === 0 ? 'true' : undefined}
        data-drop-active={dropActive ? 'true' : undefined}
        title='Click or drop a file to add it'
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDropActive(true);
        }}
        onDragLeave={(e) => {
          if (e.currentTarget.contains(e.relatedTarget as Node | null)) {
            return;
          }
          setDropActive(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDropActive(false);
          uploadAsset(e.dataTransfer?.files ?? null);
        }}
        style={{ height: ASSET_PREVIEW_HEIGHT }}
      >
        {currentAssets.length > 0 ? (
          <div className='asset-grid-list'>
            {currentAssets.map((assetFilePath, index) => {
              const mediaType = getMediaType(assetFilePath);
              const filename = assetFilePath.substring(assetFilePath.lastIndexOf('/') + 1);
              const key = `${assetFilePath}-${index}`;
              const isPlaying = playingKey === key;
              return (
                <div
                  key={key}
                  className='asset-grid-tile'
                  title={isPlaying ? `Stop ${filename}` : filename}
                  // Stopped so a click here doesn't also bubble to the drop zone, which opens
                  // the upload file picker - previously the only thing a click on a chip did.
                  onClick={(e) => {
                    e.stopPropagation();
                    activateTile(key, assetFilePath);
                  }}
                >
                  {mediaType === 'image' ? (
                    <img
                      className='asset-grid-thumb'
                      src={`assets/${pluginName}/${assetFilePath}`}
                      alt={filename}
                    />
                  ) : (
                    <FontAwesomeIcon
                      icon={isPlaying ? faStop : faPlay}
                      className='asset-grid-play-icon'
                    />
                  )}
                  <button
                    type='button'
                    className='asset-grid-remove'
                    title='Remove'
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isPlaying) {
                        stopSound();
                      }
                      removeAsset(index);
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <span className='asset-drop-zone-hint'>
            <FontAwesomeIcon icon={faFileImport} /> Drop files, or click
          </span>
        )}
        <button
          type='button'
          className='asset-drop-zone-upload'
          title='Upload a file'
          onClick={(e) => {
            e.stopPropagation();
            fileRef.current?.click();
          }}
        >
          <FontAwesomeIcon icon={faFileImport} />
        </button>
      </div>
      <div className='asset-select-row'>
        <SelectDropdown options={assetOptions} value={pickerValue} onChange={handlePickerChange} />
      </div>
      <input
        type='file'
        id={'input-file-' + formKey}
        ref={fileRef}
        accept={acceptedFormat}
        onChange={(e) => uploadAsset(e.target?.files)}
        style={{ display: 'none' }}
      />
    </Box>
  );
}
