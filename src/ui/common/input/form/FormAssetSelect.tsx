import { faFileImport } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import usePlugins from '../../../../app/hooks/usePlugins';
import React, { useRef, useState } from 'react';
import { Box, FormLoader, FormSelectDropdown, TypeFace } from '@spooder/webui-component-library';
import { useFormContext } from 'react-hook-form';
import PluginAssetPreview from '../../../tabs/pluginTab/PluginAssetPreview';

interface FormAssetSelectProps {
  formKey: string;
  label?: string;
  assetType?: string;
  pluginName: string;
  assetFolderPath: string;
}

// The preview box doubles as the upload control, so there is no separate upload button: the box
// is always drawn (dashed and empty when nothing is picked), takes a dropped file, and opens the
// file dialog when clicked. That gives the control one constant height whatever it holds - which
// is what lets a node card reserve the right room for it (see CONTROL_HEIGHTS in nodeLayout) -
// and makes drag-and-drop the obvious gesture rather than a hidden one.
export const ASSET_PREVIEW_HEIGHT = 100;

export default function FormAssetSelect(props: FormAssetSelectProps) {
  const { formKey, label, assetType, pluginName, assetFolderPath } = props;
  const acceptedFormat = assetType != null ? assetType + '/*' : '*';
  const { getPluginAssets, getUploadPluginAssets } = usePlugins();
  const { uploadPluginAssets } = getUploadPluginAssets();
  const { setValue, watch } = useFormContext();

  const currentAsset = watch(formKey);
  // Purely visual: the drop zone lights up while a file is over it, so it's clear the box will
  // take the drop rather than the browser navigating to the file.
  const [dropActive, setDropActive] = useState(false);

  const { data: assets, isLoading, error, refetch } = getPluginAssets(pluginName, assetFolderPath);
  const fileRef = useRef<HTMLInputElement>(null);

  if (isLoading || error) {
    return <FormLoader numRows={2} />;
  }

  const assetOptions = [{ label: 'None', value: '' }];
  for (let a in assets) {
    assetOptions.push({
      label: assets[a].substring(assets[a].lastIndexOf('/') + 1),
      value: assets[a],
    });
  }

  // `accept` filters the file dialog but says nothing about a drop, so the type is checked here
  // too - otherwise dragging a text file onto a sound field uploads it into the plugin's sound
  // folder and picks it. A file the browser reports no type for is let through: that's a
  // recognition failure, not a wrong file.
  function isAcceptedFile(file: File): boolean {
    return assetType == null || file.type === '' || file.type.startsWith(`${assetType}/`);
  }

  async function uploadAsset(files: FileList | null) {
    if (!files || files.length === 0 || !isAcceptedFile(files[0])) {
      return;
    }
    await uploadPluginAssets(pluginName, assetFolderPath, files);
    refetch();
    setValue(formKey, `${assetFolderPath}/${files[0].name}`);
  }

  // A filled preview may contain its own controls (an audio player), which have to stay usable -
  // so a click only opens the file dialog when it didn't land on one of them. The corner icon is
  // the affordance that always works, whatever the preview is showing.
  function handlePreviewClick(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest('audio, video, button, input, select')) {
      return;
    }
    fileRef.current?.click();
  }

  return (
    <Box flexFlow='column'>
      {/* Skipped when there's no label to draw: on a node card the row draws its own label
          above this control, and an empty one here would take a line the card hasn't
          budgeted for (see CONTROL_HEIGHTS in nodeLayout). */}
      {label ? <TypeFace fontWeight='bold'>{label}</TypeFace> : null}
      <div
        className='asset-drop-zone'
        data-empty={currentAsset ? undefined : 'true'}
        data-drop-active={dropActive ? 'true' : undefined}
        title={currentAsset ? 'Click or drop a file to replace' : 'Click or drop a file to upload'}
        onClick={handlePreviewClick}
        onDragOver={(e) => {
          // Both required: without preventDefault on dragover the drop event never fires, and
          // the browser opens the file in the tab instead.
          e.preventDefault();
          setDropActive(true);
        }}
        onDragLeave={(e) => {
          // dragleave also fires as the pointer crosses into a child (the preview, the upload
          // icon), which would flicker the highlight off and on. Only a leave that lands outside
          // the box counts.
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
        {currentAsset ? (
          <PluginAssetPreview assetFilePreview={currentAsset} assetPath={`assets/${pluginName}`} />
        ) : (
          <span className='asset-drop-zone-hint'>
            <FontAwesomeIcon icon={faFileImport} /> Drop a file, or click
          </span>
        )}
        {/* Pinned rather than in flow so it keeps its place over any preview content, and stays
            the one target a click can't miss. */}
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
      {/* Wrapped so the margin under the picker is the wrapper's, not the library select's -
          FormSelectDropdown renders its own label/select markup and nothing here should reach
          into it. */}
      <div className='asset-select-row'>
        <FormSelectDropdown formKey={formKey} options={assetOptions} />
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
