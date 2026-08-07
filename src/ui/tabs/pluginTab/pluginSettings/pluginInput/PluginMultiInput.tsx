import React from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormContext } from 'react-hook-form';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { KeyedObject } from '../../../../Types';
import OBSSceneItemSelect from '../../../../common/input/controlled/OBSSceneItemSelect';
import { useState } from 'react';
import {
  BoolSwitch,
  SelectDropdown,
  RangeInput,
  TextAreaInput,
  Button,
  Box,
  TypeFace,
} from '@spooder/webui-component-library';
import AssetSelect from '../../../../common/input/controlled/AssetSelect';
import UdpSelectDropdown from '../../../../common/input/controlled/UdpSelectDropdown';
import EventSelect from '../../../../common/input/controlled/EventSelect';
import { usePluginSettingsContext } from '../context/PluginSettingsContext';
import PluginMultiInputValueArray from './PluginMultiInputValueArray';
import DiscordChannelSelect from '../../../../common/input/controlled/DiscordChannelSelect';

interface PluginMultiInputProps {
  formKey: string;
  label: string;
  type: string;
  options: KeyedObject;
}

export default function PluginMultiInput(props: PluginMultiInputProps) {
  const { formKey, label, type, options } = props;
  const { pluginName, form, defaults } = usePluginSettingsContext();
  const { getValues, setValue } = useFormContext();
  const defaultValue = defaults[formKey];
  const [value, setInputValue] = useState(defaultValue);

  function addMultiInput() {
    const valueArray = getValues(formKey) || [];
    const newValue = [...valueArray];
    newValue.push(value);
    setValue(formKey, newValue);
  }

  function removeMultiInput(index: number) {
    const valueArray = getValues(formKey) || [];
    const newValue = [...valueArray];
    newValue.splice(index, 1);
    setValue(formKey, newValue);
  }

  function onChanged(e: any) {
    console.log('VALUE', e);
    setInputValue(e);
  }

  function getInput(type: string) {
    //console.log("VALUE", keyname);
    switch (type) {
      case 'boolean':
      case 'checkbox':
        return <BoolSwitch value={value} onChange={onChanged} />;
        break;
      case 'select':
        const optionArray = [{ label: 'None', value: '' }];

        for (let o in options.selections) {
          optionArray.push({ label: options?.selections[o], value: o });
        }

        return (
          <SelectDropdown label={label} options={optionArray} value={value} onChange={onChanged} />
        );
      case 'range':
        return (
          <RangeInput
            label={label}
            min={options?.min}
            max={options?.max}
            step={options?.step}
            value={value}
            onChange={onChanged}
          />
        );
      case 'code':
        return (
          <CodeEditor
            className='response-code-editor'
            language='js'
            placeholder="return 'Hello '+event.displayName"
            value={value}
            onChange={onChanged}
          />
        );
      case 'textarea':
        return <TextAreaInput label={label} value={value} onChange={onChanged} />;
      case 'asset':
        return (
          <AssetSelect
            label={label}
            assetFolderPath={options?.folder}
            pluginName={pluginName}
            value={value}
            onChange={onChanged}
          />
        );

        break;
      case 'udp':
        return <UdpSelectDropdown label={label} value={value} onChange={onChanged} />;
      case 'event':
        return <EventSelect label={label} value={value} onChange={onChanged} />;
      case 'obs':
        return <OBSSceneItemSelect label={label} value={value} onChange={onChanged} />;
      case 'discord':
        return <DiscordChannelSelect label={label} value={value} onChange={onChanged} />;
      default:
        return <label>Invalid type: {type}</label>;
    }
  }

  //console.log("DEFAULT", default);
  const input = getInput(type);

  //console.log("INPUT VALUE", input.props);

  //TODO: Fix Multi Input
  return (
    <Box flexFlow='column'>
      <Box>{input}</Box>
      <Box alignItems='center' marginTop='small'>
        <PluginMultiInputValueArray formKey={formKey} removeMultiInput={removeMultiInput} />
        <Box marginLeft='small'>
          <Button icon={faPlus} onClick={() => addMultiInput()} />
        </Box>
      </Box>
    </Box>
  );
}
