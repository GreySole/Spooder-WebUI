import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useFormContext } from "react-hook-form";
import FormAssetSelect from "../UI/common/input/form/FormAssetSelect";
import FormBoolSwitch from "../UI/common/input/form/FormBoolSwitch";
import FormEventSelect from "../UI/common/input/form/FormEventSelect";
import FormOBSSceneItemSelect from "../UI/common/input/form/FormOBSSceneItemSelect";
import FormRangeInput from "../UI/common/input/form/FormRangeInput";
import FormSelectDropdown from "../UI/common/input/form/FormSelectDropdown";
import FormTextAreaInput from "../UI/common/input/form/FormTextAreaInput";
import FormTextInput from "../UI/common/input/form/FormTextInput";
import FormUdpSelectDropdown from "../UI/common/input/form/FormUdpSelectDropdown";
import CodeEditor from '@uiw/react-textarea-code-editor';


interface PluginInputProps{
    formKey:string;
    label:string;
    type:string;
    defaultValue:any;
    isMulti:boolean;
    options:any;
}

export default function PluginInput(props:PluginInputProps){
    const {formKey, label, type, defaultValue, isMulti, options} = props;
    const {watch, register, setValue} = useFormContext();
    const value = watch(formKey, defaultValue);
        
    if(isMulti){
        if(typeof value == 'object'
        && type != "discord"
        && type != "obs"
        && !Array.isArray(value)){
            if(value == null){
                setValue(formKey, []);
            }else{
                setValue(formKey, Object.values(value));
            }
            
        }else if(typeof value == 'object'
        && (type == "discord" || type == "obs")
        && !Array.isArray(value)){
            setValue(formKey, [value]);
        }
    }else if(type == "discord" && value == null){
        setValue(formKey, {
            guild:"",
            channel:""
        });
    }

    function onMultiChanged(e:any){
        //TODO: Implement Multi Inputs
        /*let newSelects = Object.assign(_selects);
        
        if(type == "discord" || type == "obs"){
            if(newSelects[keyname] == null){
                 newSelects[keyname] = {};
            }
            let newObjSelect = Object.assign(newSelects[keyname]);
            newObjSelect[e.target.name] = e.target.value;
            newSelects[keyname] = newObjSelect;
        }else{
            newSelects[e.target.name] = e.target.value;
        }
        setState(Object.assign(state, {_selects:newSelects}));*/
    }

    function onChanged(e:any){
        
    }

    function getInput(type:string){
        let input = null;
        let value = null;
        let changeCB = isMulti?onMultiChanged:onChanged;
        if(isMulti == true){
            let defaultVal = defaultValue==null?null:defaultValue[0];
            if(value == null){
                value = defaultVal;
            }
        }else{
            //console.log(value, default);
            if(value == null){
                value = defaultValue;
            }else{
                value = value;
            }
            
        }
        //console.log("VALUE", keyname);
        switch(type){
            case "boolean":
            case "checkbox":
                //input = <input type="checkbox" name={keyname} defaultChecked={value} onChange={changeCB}/>
                return (
                    <FormBoolSwitch formKey={formKey}/>
                )
            break;
            case "select":
                const optionArray = [{label:'None', value:''}];
                
                for(let o in options.selections){
                    optionArray.push({label:options?.selections[o], value:o});
                }

                return <FormSelectDropdown formKey={formKey} label={label} options={optionArray}/>
            case "range":

                return <FormRangeInput formKey={formKey} label={label} min={options?.min} max={options?.max} step={options?.step} />
            case "code":
                return <CodeEditor className="response-code-editor" language="js" 
                placeholder="return 'Hello '+event.displayName"
                {...register(formKey)}/>
            case "textarea":
                return <FormTextAreaInput formKey={formKey} label={label} />;
            case "keyname":
                return <FormTextInput formKey={formKey} jsonFriendly/>
            case "asset":
                return <FormAssetSelect formKey={formKey} label={label} assetFolderPath={options?.folder} pluginName={''}/>
            
            break;
            case "udp":
                return <FormUdpSelectDropdown formKey={formKey} label={label}/>
            case "event":
                return <FormEventSelect formKey={formKey} label={label} />
            case "obs":
                return <FormOBSSceneItemSelect formKey={formKey} label={label}/>
            case "discord":
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

    function addMultiInput(newVal:any){
        let newValues = value!=null?[...value]:[];
        
        if(typeof newVal == "object" && !Array.isArray(newVal)){
            newValues.push(Object.assign({}, newVal));
        }else{
            newValues.push(newVal);
        }
        
        //console.log("NEW VALUES", newValues);
        let e = {
            target:{
                type:"multi",
                value:newValues
            }
        }
        onChanged(e);
    }

    function removeMultiInput(index:number){
        let newValues = [...value];
        newValues.splice(index, 1);
        let e = {
            target:{
                type:"multi",
                value:newValues
            }
        }
        onChanged(e);
    }

	/*function getUDPOptions(){
		let udpClients = udpClients;
		let optionHTML = [<option value='-1'>Disabled</option>,<option value='-2'>All</option>];
        for(let c in udpClients){
            optionHTML += [<option value={c}>{c}</option>];
        }
        
        return optionHTML;
	}*/
        
        if(isMulti == true){
            //console.log("DEFAULT", default);
            let defaultVal = defaultValue==null?null:defaultValue[0];
            let input = getInput(type);
            let varContainer = [] as any[];
            /*for(let v in value){
                if(type == "discord"){
                    
                    varContainer.push(
                        <div className="settings-form-var-button" key={v} index={v} onClick={()=>removeMultiInput(v)}>
                            { discord[value[v].guild] != null?
                            discord?.[value[v].guild].name+" -> "+discord?.[value[v].guild].channels[value[v].channel].name:Object.values(value[v]).join(", ")}
                        </div>
                    )
                }else if(type == "obs"){
                    varContainer.push(
                        <div className="settings-form-var-button" key={v} index={v} onClick={()=>removeMultiInput(v)}>
                            { obs.scenes != null?
                            obs.scenes[value[v].scene].sceneName+" -> "+obs.sceneItems[value[v].scene][value[v].item].sourceName:Object.values(value[v]).join(", ")}
                        </div>
                    )
                }else{
                    varContainer.push(
                        <div className="settings-form-var-button" key={v} index={v} onClick={()=>removeMultiInput(v)}>
                            {value[v]}
                        </div>
                    )
                }
                
            }*/
            
            //console.log("INPUT VALUE", input.props);

            //TODO: Fix Multi Input
            return <div className={"settings-form-input multi "+type}>
                {label}
                <div className="settings-form-multi-input">
                    <div className="settings-form-multi-ui">
                        {input}
                        <button className="settings-form-multi-add" type="button" onClick={()=>addMultiInput('')}><FontAwesomeIcon icon={faPlus}/></button>
                    </div>
                    <div className="settings-form-var-container">
                        {varContainer}
                    </div>
                </div>
            </div>
        }else{
            let input = getInput(type);
            return <div className={"settings-form-input "+type}>
                <label>{label}</label>
                {input}
            </div>
        }
}