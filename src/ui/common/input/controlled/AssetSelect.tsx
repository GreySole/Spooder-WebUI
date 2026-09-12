import { faExpandArrowsAlt, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import usePlugins from '../../../../app/hooks/usePlugins';
import React, { useRef } from 'react';
import {
  Box,
  Button,
  getMediaType,
  SelectDropdown,
  useDialog,
} from '@spooder/webui-component-library';
import PluginAssetPreview from '../../../tabs/pluginTab/PluginAssetPreview';

interface AssetSelectProps {
  label?: string;
  assetType?: string;
  pluginName: string;
  assetFolderPath: string;
  value: string;
  onChange: (value: string) => void;
}

export default function AssetSelect(props: AssetSelectProps) {
  const { label, assetType, pluginName, assetFolderPath, value, onChange } = props;
  const acceptedFormat = assetType != null ? assetType + '/*' : '*';
  const { getPluginAssets, getUploadPluginAssets } = usePlugins();
  const { data: assets, isLoading, error, refetch } = getPluginAssets(pluginName, assetFolderPath);
  const { uploadPluginAssets } = getUploadPluginAssets();
  const { openDialog } = useDialog();

  const fileRef = useRef<HTMLInputElement>(null);

  if (isLoading || error) {
    return null;
  }

  const assetOptions = [{ label: 'None', value: '' }];
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

  async function uploadAsset(files: FileList | null) {
    if (files && files.length > 0) {
      await uploadPluginAssets(pluginName, assetFolderPath, files);
      refetch();
    }
  }

  function handleClick() {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }

  return (
    <Box flexFlow='column'>
      {value ? (
        <Box height='100px'>
          <PluginAssetPreview assetFilePreview={value} assetPath={`assets/${pluginName}`} />
        </Box>
      ) : null}
      <SelectDropdown label={label} options={assetOptions} value={value} onChange={onChange} />
      <Box marginLeft='medium'>
        <Button icon={faFileImport} onClick={handleClick} />
      </Box>
      <input
        type='file'
        id={'input-file-' + label}
        ref={fileRef}
        accept={acceptedFormat}
        onChange={(e) => uploadAsset(e.target?.files)}
        style={{ display: 'none' }}
      />
    </Box>
  );
}
