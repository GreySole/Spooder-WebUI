import { faFileImport } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import usePlugins from '../../../../app/hooks/usePlugins';
import React, { useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { useUploadPluginAssetMutation } from '../../../../app/api/pluginSlice';
import { FormLoader, FormSelectDropdown } from '@greysole/spooder-component-library';

interface FormAssetSelectProps {
  formKey: string;
  label?: string;
  assetType?: string;
  pluginName: string;
  assetFolderPath: string;
}

export default function FormAssetSelect(props: FormAssetSelectProps) {
  const { formKey, label, assetType, pluginName, assetFolderPath } = props;
  const acceptedFormat = assetType != null ? assetType + '/*' : '*';
  const { getPluginAssets } = usePlugins();
  const { setValue } = useFormContext();
  const [uploadPluginAsset] = useUploadPluginAssetMutation();
  const { data: assets, isLoading, error, refetch } = getPluginAssets(pluginName, assetFolderPath);
  const fileRef = useRef<HTMLInputElement>(null);

  console.log('ASSETS', pluginName, assetFolderPath);

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

  async function uploadAsset(files: FileList | null) {
    if (files && files.length > 0) {
      const assetPath = `${assetFolderPath}/${files[0].name}`;
      var fd = new FormData();

      fd.append('file', files[0]);

      await uploadPluginAsset({ assetPath, fd }).unwrap();
      setValue(formKey, assetPath);
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
      <FormSelectDropdown formKey={formKey} options={assetOptions} />
      <button className='settings-form-asset-upload' onClick={handleClick}>
        <FontAwesomeIcon icon={faFileImport} size='lg' />
      </button>
      <input
        type='file'
        id={'input-file-' + formKey}
        ref={fileRef}
        accept={acceptedFormat}
        onChange={(e) => uploadAsset(e.target?.files)}
        style={{ display: 'none' }}
      />
    </label>
  );
}
