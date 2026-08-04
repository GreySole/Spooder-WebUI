import { faExpandArrowsAlt, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import usePlugins from '../../../../app/hooks/usePlugins';
import React, { useRef } from 'react';
import {
  Box,
  Button,
  FormLoader,
  FormSelectDropdown,
  TypeFace,
  useDialog,
} from '@spooder/webui-component-library';
import { useFormContext } from 'react-hook-form';
import PluginAssetPreview from '../../../tabs/pluginTab/PluginAssetPreview';

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
  const { getPluginAssets, getUploadPluginAssets, getAssetUrl } = usePlugins();
  const { uploadPluginAssets } = getUploadPluginAssets();
  const { setValue, watch } = useFormContext();
  const { openDialog } = useDialog();

  const currentAsset = watch(formKey);

  console.log('ASSET FOLDER PATH', assetFolderPath);

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

  async function uploadAsset(files: FileList | null) {
    if (files && files.length > 0) {
      await uploadPluginAssets(pluginName, assetFolderPath, files);
      refetch();
      setValue(formKey, `${assetFolderPath}/${files[0].name}`);
    }
  }

  function handleClick() {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }

  return (
    <Box flexFlow='column'>
      <TypeFace fontWeight='bold'>{label}</TypeFace>
      {currentAsset ? (
        <Box height='100px'>
          <PluginAssetPreview assetFilePreview={currentAsset} assetPath={`assets/${pluginName}`} />
        </Box>
      ) : null}
      <Box>
        <FormSelectDropdown formKey={formKey} options={assetOptions} />

        <Box marginLeft='medium' spacing='small'>
          <Button icon={faFileImport} onClick={handleClick} />
        </Box>
      </Box>
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
