import React from 'react';
import { useFormContext } from 'react-hook-form';
import FormAssetSelect from '../../../Common/input/form/FormAssetSelect';
import FormBoolSwitch from '../../../Common/input/form/FormBoolSwitch';
import FormEventSelect from '../../../Common/input/form/FormEventSelect';
import FormOBSSceneItemSelect from '../../../Common/input/form/FormOBSSceneItemSelect';
import FormRangeInput from '../../../Common/input/form/FormRangeInput';
import FormTextAreaInput from '../../../Common/input/form/FormTextAreaInput';
import FormTextInput from '../../../Common/input/form/FormTextInput';
import FormUdpSelectDropdown from '../../../Common/input/form/FormUdpSelectDropdown';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { KeyedObject } from '../../../Types';
import FormColorInput from '../../../Common/input/form/FormColorInput';
import FormCodeInput from '../../../Common/input/form/FormCodeInput';
import FormDiscordChannelSelect from '../../../Common/input/form/FormDiscordChannelSelect';
import FormSelectDropdown from '../../../Common/input/form/FormSelectDropdown';

interface PluginInputProps {
  pluginName: string;
  formKey: string;
  defaultValue: any;
  label: string;
  type: string;
  options: KeyedObject;
}

export default function PluginInput(props: PluginInputProps) {
  const { pluginName, formKey, defaultValue, label, type, options } = props;
  const { watch, register, setValue } = useFormContext();
  const value = watch(formKey, defaultValue);

  if (type == 'discord' && value === undefined) {
    setValue(formKey, {
      guild: '',
      channel: '',
    });
  }

  function getInput(type: string) {
    //console.log("VALUE", keyname);
    switch (type) {
      case 'boolean':
      case 'checkbox':
        //input = <input type="checkbox" name={keyname} defaultChecked={value} onChange={changeCB}/>
        return <FormBoolSwitch formKey={formKey} label={label} />;
      case 'color':
        return <FormColorInput formKey={formKey} label={label} />;
      case 'select':
        const optionArray = [{ label: 'None', value: '' }];

        for (let o in options.selections) {
          optionArray.push({ label: options?.selections[o], value: o });
        }

        return <FormSelectDropdown formKey={formKey} label={label} options={optionArray} />;
      case 'range':
        return (
          <FormRangeInput
            formKey={formKey}
            label={label}
            min={options?.min}
            max={options?.max}
            step={options?.step}
          />
        );
      case 'code':
        return <FormCodeInput formKey={formKey} label={label} />;
      case 'text':
        return <FormTextInput formKey={formKey} label={label} />;
      case 'password':
        return <FormTextInput formKey={formKey} label={label} password />;
      case 'textarea':
        return <FormTextAreaInput formKey={formKey} label={label} />;
      case 'asset':
        return (
          <FormAssetSelect
            formKey={formKey}
            label={label}
            assetFolderPath={options?.folder}
            pluginName={pluginName}
          />
        );
      case 'udp':
        return <FormUdpSelectDropdown formKey={formKey} label={label} />;
      case 'event':
        return <FormEventSelect formKey={formKey} label={label} />;
      case 'obs':
        return <FormOBSSceneItemSelect formKey={formKey} label={label} />;
      case 'discord':
        return <FormDiscordChannelSelect formKey={formKey} label={label} />;
      default:
        return <label>Invalid type: {type}</label>;
    }
  }

  const input = getInput(type);
  return <div className={'settings-form-input ' + type}>{input}</div>;
}
