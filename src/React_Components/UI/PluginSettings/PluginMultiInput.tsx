import React from 'react';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormContext } from 'react-hook-form';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { KeyedObject } from '../../Types';
import BoolSwitch from '../common/input/controlled/BoolSwitch';
import SelectDropdown from '../common/input/controlled/SelectDropdown';
import RangeInput from '../common/input/controlled/RangeInput';
import AssetSelect from '../common/input/controlled/AssetSelect';
import TextAreaInput from '../common/input/controlled/TextAreaInput';
import UdpSelectDropdown from '../common/input/controlled/UdpSelectDropdown';
import EventSelect from '../common/input/controlled/EventSelect';
import OBSSceneItemSelect from '../common/input/controlled/OBSSceneItemSelect';
import { useState } from 'react';

interface PluginMultiInputProps {
  pluginName: string;
  formKey: string;
  defaultValue: any;
  label: string;
  type: string;
  options: KeyedObject;
}

export default function PluginInput(props: PluginMultiInputProps) {
  const { pluginName, formKey, defaultValue, label, type, options } = props;
  const { watch, register, setValue } = useFormContext();
  const valueArray = watch(formKey, []);
  const [value, setInputValue] = useState(defaultValue);

  if (typeof value == 'object' && type != 'discord' && type != 'obs' && !Array.isArray(value)) {
    if (value == null) {
      setValue(formKey, []);
    } else {
      setValue(formKey, Object.values(value));
    }
  } else if (
    typeof value == 'object' &&
    (type == 'discord' || type == 'obs') &&
    !Array.isArray(value)
  ) {
    setValue(formKey, [value]);
  }

  function onChanged(e: any) {
    setInputValue(e);
  }

  function getInput(type: string) {
    //console.log("VALUE", keyname);
    switch (type) {
      case 'boolean':
      case 'checkbox':
        //input = <input type="checkbox" name={keyname} defaultChecked={value} onChange={changeCB}/>
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
        //console.log(discord);
        /*let guildOptions = [<option value={""}>Select Guild</option>];
                let channelOptions = [<option value={""}>Select Channel</option>];
                let discordVal = value!=null?value:{
                    guild:"",
                    channel:""
                }
                if(Object.keys(discord).length > 0){
                    for(let d in discord){
                        guildOptions.push(
                            <option value={d}>{discord[d].name}</option>
                        );
                        
                    }
    
                    if(multi == true){
                        let discordSelect = _selects[keyname];
                        if(discordSelect != null){
                            if(discordSelect.guild != ""){
                                for(let c in discord[discordSelect.guild].channels){
                                    channelOptions.push(
                                        <option value={c}>{discord[discordSelect.guild].channels[c].name}</option>
                                    );
                                }
                            }
                        }
                        
                    }else{
                        if(discordVal.guild != "" && discord[discordVal.guild] != null){
                            for(let c in discord[discordVal.guild].channels){
                                channelOptions.push(
                                    <option value={c}>{discord[discordVal.guild].channels[c].name}</option>
                                );
                            }
                        }
                    }
                    
                    input = <label key={keyname+guildOptions.length+channelOptions.length+JSON.stringify(_selects)}>
                        <select name="guild" defaultValue={discordVal.guild} value={_selects[keyname]?.["guild"]} onChange={changeCB}>
                            {guildOptions}
                        </select>
                        <select name="channel" defaultValue={discordVal.channel} value={_selects[keyname]?.["channel"]} onChange={changeCB}>
                            {channelOptions}
                        </select>
                    </label>;
                }else{
                    input = <label key={keyname+guildOptions.length+channelOptions.length}>
                        No guilds found. Invite your Spooder to a Discord server to assign a channel.
                    </label>;
                }*/

        break;
      default:
        return <label>Invalid type: {type}</label>;
    }
  }

  function addMultiInput() {
    const newValue = [...valueArray];
    newValue.push(value);
    setValue(formKey, newValue);
  }

  function removeMultiInput(index: number) {
    const newValue = [...valueArray];
    newValue.splice(index, 1);
    setValue(formKey, newValue);
  }

  //console.log("DEFAULT", default);
  const input = getInput(type);
  const varContainer = [] as any[];
  for (let v in value) {
    /*if (type == 'discord') {
      varContainer.push(
        <div className='settings-form-var-button' key={v} onClick={() => removeMultiInput(v)}>
          {discord[value[v].guild] != null
            ? discord?.[value[v].guild].name +
              ' -> ' +
              discord?.[value[v].guild].channels[value[v].channel].name
            : Object.values(value[v]).join(', ')}
        </div>,
      );
    } else if (type == 'obs') {
      varContainer.push(
        <div
          className='settings-form-var-button'
          key={v}
          onClick={() => removeMultiInput(parseInt(v))}
        >
          {obs.scenes != null
            ? obs.scenes[value[v].scene].sceneName +
              ' -> ' +
              obs.sceneItems[value[v].scene][value[v].item].sourceName
            : Object.values(value[v]).join(', ')}
        </div>,
      );
    } else {
      
    }*/

    varContainer.push(
      <div
        className='settings-form-var-button'
        key={v}
        onClick={() => removeMultiInput(parseInt(v))}
      >
        {value[v]}
      </div>,
    );
  }

  //console.log("INPUT VALUE", input.props);

  //TODO: Fix Multi Input
  return (
    <div className={'settings-form-input multi ' + type}>
      <div className='settings-form-multi-input'>
        <div className='settings-form-multi-ui'>
          {input}
          <button className='settings-form-multi-add' type='button' onClick={() => addMultiInput()}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
        <div className='settings-form-var-container'>{varContainer}</div>
      </div>
    </div>
  );
}
