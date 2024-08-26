import { faFileImport } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import usePlugins from '../../../../../app/hooks/usePlugins';
import FormSelectDropdown from './FormSelectDropdown';
import { useRef } from 'react';

interface FormAssetSelectProps {
  formKey: string;
  label?: string;
  assetType?: string;
  pluginName: string;
  assetFolderPath: string;
}

/*function getAssetOptions(mediaType, folder) {
  //console.log("GET ASSETS", mediaType, _assets);
  if (assets == null) {
    return [];
  }
  if (folder == '' || folder == null) {
    folder = 'root';
  }
  let assets = assets;
  let options = {};
  let extensions = window.mediaExtensions;
  if (assets[folder] != null) {
    for (let a in assets[folder]) {
      let astring = assets[folder][a];
      if (extensions[mediaType] == null) {
        if (folder != 'root') {
          options[astring] = astring.substring(folder.length + 1);
        } else {
          options[astring] = astring;
        }
      } else {
        if (extensions[mediaType].includes(astring.substring(astring.lastIndexOf('.')))) {
          if (folder != 'root') {
            options[astring] = astring.substring(folder.length + 1);
          } else {
            options[astring] = astring;
          }
        }
      }
    }
  }

  //console.log(options);
  let optionHTML = [];
  if (options?.required == false || options?.required == null) {
    optionHTML.push(<option value=''>None</option>);
  }

  for (let o in options) {
    optionHTML.push(<option value={o}>{options[o]}</option>);
  }

  return optionHTML;
}*/

export default function FormAssetSelect(props: FormAssetSelectProps) {
  const { formKey, label, assetType, pluginName, assetFolderPath } = props;
  const acceptedFormat = assetType != null ? assetType + '/*' : '*';
  const { browsePluginAssets, uploadPluginAsset } = usePlugins();
  const {
    data: assets,
    isLoading,
    error,
    refetch,
  } = browsePluginAssets(pluginName, assetFolderPath);
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

      await uploadPluginAsset(assetFolderPath, fd);
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
      <FormSelectDropdown formKey={formKey} label={label} options={assetOptions} />
      <button className='settings-form-asset-upload' onClick={handleClick}>
        <FontAwesomeIcon icon={faFileImport} size='lg' />
      </button>
      <input
        type='file'
        id={'input-file-' + formKey}
        ref={fileRef}
        accept={assetType}
        onChange={(e) => uploadAsset(e.target?.files)}
        style={{ display: 'none' }}
      />
    </label>
  );
}
