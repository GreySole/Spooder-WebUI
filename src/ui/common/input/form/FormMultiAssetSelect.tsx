import { faFileImport, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import usePlugins from '../../../../app/hooks/usePlugins';
import React, { useRef, useState } from 'react';
import {
  Box,
  FormLoader,
  getMediaType,
  SelectDropdown,
  TypeFace,
} from '@spooder/webui-component-library';
import { useFormContext } from 'react-hook-form';
import { ASSET_PREVIEW_HEIGHT } from './FormAssetSelect';

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
// nodeLayout.ts - but the drop zone holds a horizontally-scrolling strip of picked assets
// instead of one preview, and the picker appends its selection instead of replacing the value.
export default function FormMultiAssetSelect(props: FormMultiAssetSelectProps) {
  const { formKey, label, assetType, pluginName, assetFolderPath } = props;
  const acceptedFormat = assetType != null ? assetType + '/*' : '*';
  const { getPluginAssets, getUploadPluginAssets } = usePlugins();
  const { uploadPluginAssets } = getUploadPluginAssets();
  const { setValue, watch } = useFormContext();

  const currentAssets: string[] = watch(formKey) ?? [];
  // Purely visual, matching FormAssetSelect's drop-active highlight.
  const [dropActive, setDropActive] = useState(false);
  // The picker is never bound to one of the array's own entries - it's a fire-once "add" control,
  // not an editor for an existing slot - so it keeps its own value and resets after each pick.
  const [pickerValue, setPickerValue] = useState('');

  const { data: assets, isLoading, error, refetch } = getPluginAssets(pluginName, assetFolderPath);
  const fileRef = useRef<HTMLInputElement>(null);

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
        // Unlike FormAssetSelect this box holds a variable amount of content (zero to many
        // chips), which would otherwise shrink it to fit - locking it to ASSET_PREVIEW_HEIGHT
        // keeps it at the same size the row budget (CONTROL_HEIGHTS.asset in nodeLayout.ts)
        // reserves, so the picker row underneath always lands where the layout expects it.
        style={{ height: ASSET_PREVIEW_HEIGHT }}
      >
        {currentAssets.length > 0 ? (
          <div className='asset-multi-list'>
            {currentAssets.map((assetPath, index) => (
              <span className='asset-multi-chip' key={`${assetPath}-${index}`}>
                <TypeFace>{assetPath.substring(assetPath.lastIndexOf('/') + 1)}</TypeFace>
                <button
                  type='button'
                  className='asset-multi-chip-remove'
                  title='Remove'
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAsset(index);
                  }}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </span>
            ))}
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
