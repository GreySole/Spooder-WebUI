import {
  FormBoolSwitch,
  FormColorInput,
  FormSelectDropdown,
  FormRangeInput,
  FormTextInput,
  FormTextAreaInput,
  FormNumberInput,
  translateCondition,
  Box,
  TypeFace,
} from '@greysole/spooder-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import FormOBSSceneItemSelect from '../../../../common/input/form/FormOBSSceneItemSelect';
import FormUdpSelectDropdown from '../../../../common/input/form/FormUdpSelectDropdown';
import { KeyedObject } from '../../../../Types';
import FormDiscordChannelSelect from '../../../../common/input/form/FormDiscordChannelSelect';
import FormEventSelect from '../../../../common/input/form/FormEventSelect';
import FormAssetSelect from '../../../../common/input/form/FormAssetSelect';
import FormCodeInput from '../../../../common/input/form/FormCodeInput';
import { usePluginSettingsContext } from '../context/PluginSettingsContext';

//Added default values to be overridden by subforms
interface PluginInputProps {
  formKey: string;
  label: string;
  type: string;
  options: KeyedObject;
}

export default function PluginInput(props: PluginInputProps) {
  const { formKey, label, type, options } = props;
  const { pluginName } = usePluginSettingsContext();

  function getInput(type?: string) {
    switch (type) {
      case 'boolean':
      case 'checkbox':
        return <FormBoolSwitch formKey={formKey} label={label} />;
      case 'color':
        return <FormColorInput formKey={formKey} label={label} />;
      case 'select':
        const optionArray = [{ label: 'None', value: '' }];

        for (let o in options?.selections) {
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
      case 'number':
        return <FormNumberInput formKey={formKey} label={label} />;
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
        return <TypeFace>Invalid type: {type}</TypeFace>;
    }
  }

  const input = getInput(type);
  return <Box>{input}</Box>;
}
