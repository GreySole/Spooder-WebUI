import { faFileImport } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import usePlugins from '../../../../app/hooks/usePlugins';
import React, { useRef } from 'react';
import SelectDropdown from './SelectDropdown';

interface AssetSelectProps {
  label?: string;
  assetType?: string;
  pluginName: string;
  assetFolderPath: string;
  value: string;
  onChange: (value: string) => void;
}

export default function FormAssetSelect(props: AssetSelectProps) {
  const { label, assetType, pluginName, assetFolderPath, value, onChange } = props;
  const acceptedFormat = assetType != null ? assetType + '/*' : '*';
  const { getPluginAssets, getUploadPluginAsset } = usePlugins();
  const { data: assets, isLoading, error, refetch } = getPluginAssets(pluginName, assetFolderPath);
  const { uploadPluginAsset } = getUploadPluginAsset();

  const fileRef = useRef<HTMLInputElement>(null);

  if (isLoading || error) {
    return null;
  }

  const assetOptions = [{ label: 'None', value: '' }];
  for (let a in assets) {
    assetOptions.push({
      label: assets[a],
      value: a,
    });
  }

  async function uploadAsset(files: FileList | null) {
    if (files && files.length > 0) {
      const path = assetFolderPath == null ? pluginName : pluginName + '/' + assetFolderPath;
      var fd = new FormData();

      fd.append('file', files[0]);

      uploadPluginAsset(assetFolderPath, fd);
      refetch();
    }
  }

  function handleClick() {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }

  return (
    <label>
      {label}
      <SelectDropdown label={label} options={assetOptions} value={value} onChange={onChange} />
      <button className='settings-form-asset-upload' onClick={handleClick}>
        <FontAwesomeIcon icon={faFileImport} size='lg' />
      </button>
      <input
        type='file'
        id={'input-file-' + label}
        ref={fileRef}
        accept={acceptedFormat}
        onChange={(e) => uploadAsset(e.target?.files)}
        style={{ display: 'none' }}
      />
    </label>
  );
}
