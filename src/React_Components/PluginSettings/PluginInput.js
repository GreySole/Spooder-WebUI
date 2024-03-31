import React from 'react';
import BoolSwitch from '../UI/BoolSwitch.js';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons';

class PluginInput extends React.Component{
    constructor(props){
        super(props);
        this.state = Object.assign({},props);
        this.state._selects = {};
        
        if(this.state.multi == true){
            if(typeof this.state.value == 'object'
            && this.state.type != "discord"
            && this.state.type != "obs"
            && !Array.isArray(this.state.value)){
                if(this.state.value == null){
                    this.state.value = [];
                }else{
                    this.state.value = Object.values(this.state.value);
                }
                
            }else if(typeof this.state.value == 'object'
            && (this.state.type == "discord" || this.state.type == "obs")
            && !Array.isArray(this.state.value)){
                this.state.value = [this.state.value];
            }
        }else if(this.state.type == "discord" && this.state.value == null){
            this.state.value = {
                guild:"",
                channel:""
            };
        }

        this.onChanged = this.onChanged.bind(this);
        this.onMultiChanged = this.onMultiChanged.bind(this);
        this.getInput = this.getInput.bind(this);
        this.addMultiInput = this.addMultiInput.bind(this);
        this.removeMultiInput = this.removeMultiInput.bind(this);
    }

    onChanged(e){
        let newVal = null;
        if(e.target.type=="checkbox"){
            newVal = e.target.checked;
        }else if((this.state.type == "discord" || this.state.type == "obs") && !this.state.multi){
            newVal = Object.assign({}, this.state.value);
            newVal[e.target.name] = e.target.value;
        }else{
            newVal = e.target.value;
        }
        
        if(this.state.options?.jsonfriendly == true){
            e.target.value = newVal.replace(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/,"").replace(" ", "_");
        }
        console.log("NEW VAL", newVal)
        this.state.onChange({inputName:this.state.keyname, subname:this.state.subname, value:newVal});
        this.setState(Object.assign(this.state, {value:newVal}));
    }

    onMultiChanged(e){
        let newSelects = Object.assign(this.state._selects);
        console.log(e.target.value, e.target.name);
        
        if(this.state.type == "discord" || this.state.type == "obs"){
            if(newSelects[this.state.keyname] == null){
                 newSelects[this.state.keyname] = {};
            }
            let newObjSelect = Object.assign(newSelects[this.state.keyname]);
            newObjSelect[e.target.name] = e.target.value;
            newSelects[this.state.keyname] = newObjSelect;
        }else{
            newSelects[e.target.name] = e.target.value;
        }
        this.setState(Object.assign(this.state, {_selects:newSelects}));
    }

    handleAssetUploadClick = e => {
		let pluginName = e.currentTarget.getAttribute("keyname");
		document.querySelector("#input-file-"+this.state.keyname).click();
	}

    uploadAsset = async e => {
        if(e.target.files.length == 0){return;}
        let pluginName = this.state.pluginName;
        let path = this.state.options?.folder==null?pluginName:pluginName+"/"+this.state.options?.folder;
		var fd = new FormData();
        
		fd.append('file', e.target.files[0]);

		const requestOptions = {
			method: 'POST',
			body: fd
		};
		let uploadReq = await fetch('/upload_plugin_asset/'+path, requestOptions)
			.then(response => response.json());
		let newState = Object.assign({},this.state.assets);
		//console.log(uploadReq["newAssets"], newState);
        if(this.state.options?.folder == "" || this.state.options?.folder == null){
            newState["root"] = uploadReq["newAssets"];
        }else{
            newState[this.state.options.folder] = [];
            for(let file in uploadReq["newAssets"]){
                newState[this.state.options.folder].push(this.state.options?.folder+"/"+uploadReq["newAssets"][file]);
            }
        }
		
		this.setState(Object.assign(this.state, {assets:newState}));
    }

    getInput(type){
        let input = null;
        let value = null;
        let changeCB = this.state.multi?this.onMultiChanged:this.onChanged;
        if(this.state.multi == true){
            let defaultVal = this.state.default==null?null:this.state.default[0];
            if(value == null){
                value = defaultVal;
            }
        }else{
            //console.log(this.state.value, this.state.default);
            if(this.state.value == null){
                value = this.state.default;
            }else{
                value = this.state.value;
            }
            
        }
        //console.log("VALUE", this.state.keyname);
        switch(type){
            case "boolean":
            case "checkbox":
                input = <input type="checkbox" name={this.state.keyname} defaultChecked={value} onChange={changeCB}/>
                //input = <BoolSwitch name={this.state.keyname} checked={value} onChange={changeCB} />
            break;
            case "select":
                
                let options = [];
                //console.log(this.state.options.required);
                if((this.state.options?.required == false || this.state.options?.required == null) && this.state.keyname!="keyname"){
                    options.push(<option value=''>None</option>);
                }
                
                for(let o in this.state.options.selections){
                    options.push(
                        <option value={o}>{this.state.options?.selections[o]}</option>
                    )
                }
                
                input = <select key={this.state.keyname} name={this.state.keyname} defaultValue={value} value={this.state._selects[this.state.keyname]} onChange={changeCB}>
                            {options}
                        </select>
            break;
            case "range":
                input = <label>
                        <input key={this.state.keyname} type={type} min={this.state.options?.min} max={this.state.options?.max} step={this.state.options?.step} name={this.state.keyname} defaultValue={value} onChange={changeCB}/>
                        {value}
                    </label>;
            break;
            case "code":
                input = <CodeEditor key={this.state.keyname} className="response-code-editor" name={this.state.keyname} language="js" 
                value={value} 
                onChange={changeCB}
                placeholder="return 'Hello '+event.displayName"/>
            break;
            case "textarea":
                input = <textarea key={this.state.keyname} name={this.state.keyname} defaultValue={value} onChange={changeCB}/>;
            break;
            case "keyname":
                input = <label key={this.state.keyname}><input type={type} name={this.state.keyname} defaultValue={value} onChange={changeCB}/></label>;
            break;
            case "asset":
                let assets = this.getAssetOptions(this.state.options?.assetType, this.state.options?.folder);
                let assetType = this.state.options?.assetType!=null?this.state.options.assetType+"/*":"*";
                
                input = <label key={this.state.keyname} name={this.state.keyname} htmlFor={'input-file-'+this.state.keyname} >
                            <select name={this.state.keyname} defaultValue={value} onChange={changeCB}>{assets}</select>
                            <button className="settings-form-asset-upload" onClick={this.handleAssetUploadClick}><FontAwesomeIcon icon={faFileImport} size="lg" /></button>
                            <input type='file' id={'input-file-'+this.state.keyname} name={this.state.keyname} accept={assetType} onChange={this.uploadAsset} style={{ display: 'none' }} />
                        </label>
            
            break;
            case "udp":
                let udpOptions = [];
                if((this.state.options?.required == false || this.state.options?.required == null) && this.state.keyname!="keyname"){
                    udpOptions.push(<option value={-1}>None</option>);
                }
                
                for(let u in this.state.udpClients){
                    udpOptions.push(
                        <option value={u}>{this.state.udpClients[u].name}</option>
                    )
                }
                input = <label key={this.state.keyname}>
                    <select name={this.state.keyname} onChange={changeCB}>
                        {udpOptions}
                    </select>
                </label>
            break;
            case "obs":
                console.log(this.state.obs);
                
                let sceneOptions = [<option value={-1}>Select Scene</option>];
                let itemOptions = [<option value={-1}>Select Item</option>];
                let obsVal = this.state.value!=null?this.state.value:{
                    scene:-1,
                    item:-1
                };

                if(Object.keys(this.state.obs).length > 0){
                    for(let d in this.state.obs.scenes){
                        sceneOptions.push(
                            <option value={d}>{this.state.obs.scenes[d].sceneName}</option>
                        );
                    }
    
                    if(this.state.multi == true){
                        let obsSelect = this.state._selects[this.state.keyname];
                        if(obsSelect != null){
                            if(obsSelect.scene != ""){
                                for(let c in this.state.obs.sceneItems[obsSelect.scene]){
                                    itemOptions.push(
                                        <option value={this.state.obs.sceneItems[obsSelect.scene][c].sceneItemId}>{this.state.obs.sceneItems[obsSelect.scene][c].sourceName}</option>
                                    );
                                }
                            }
                        }
                        
                    }else{
                        if(obsVal.scene != -1){
                            for(let c in this.state.obs.sceneItems[obsVal.scene]){
                                itemOptions.push(
                                    <option value={this.state.obs.sceneItems[obsVal.scene][c].sceneItemId}>{this.state.obs.sceneItems[obsVal.scene][c].sourceName}</option>
                                );
                            }
                        }
                    }
                    
                    console.log(this.state._selects);
                    input = <label key={this.state.keyname+sceneOptions.length+itemOptions.length+JSON.stringify(this.state._selects)}>
                        <select name="scene" defaultValue={obsVal.scene} value={this.state._selects[this.state.keyname]?.["scene"]} onChange={changeCB}>
                            {sceneOptions}
                        </select>
                        <select name="item" defaultValue={obsVal.item} value={this.state._selects[this.state.keyname]?.["item"]} onChange={changeCB}>
                            {itemOptions}
                        </select>
                    </label>;
                }else{
                    input = <label key={this.state.keyname+sceneOptions.length+itemOptions.length}>
                        No scenes found. Connect OBS to assign a scene item.
                    </label>;
                }
            break;
            case "discord":
                //console.log(this.state.discord);
                let guildOptions = [<option value={""}>Select Guild</option>];
                let channelOptions = [<option value={""}>Select Channel</option>];
                let discordVal = this.state.value!=null?this.state.value:{
                    guild:"",
                    channel:""
                }
                if(Object.keys(this.state.discord).length > 0){
                    for(let d in this.state.discord){
                        guildOptions.push(
                            <option value={d}>{this.state.discord[d].name}</option>
                        );
                        
                    }
    
                    if(this.state.multi == true){
                        let discordSelect = this.state._selects[this.state.keyname];
                        if(discordSelect != null){
                            if(discordSelect.guild != ""){
                                for(let c in this.state.discord[discordSelect.guild].channels){
                                    channelOptions.push(
                                        <option value={c}>{this.state.discord[discordSelect.guild].channels[c].name}</option>
                                    );
                                }
                            }
                        }
                        
                    }else{
                        if(discordVal.guild != "" && this.state.discord[discordVal.guild] != null){
                            for(let c in this.state.discord[discordVal.guild].channels){
                                channelOptions.push(
                                    <option value={c}>{this.state.discord[discordVal.guild].channels[c].name}</option>
                                );
                            }
                        }
                    }
                    
                    console.log(this.state._selects);
                    input = <label key={this.state.keyname+guildOptions.length+channelOptions.length+JSON.stringify(this.state._selects)}>
                        <select name="guild" defaultValue={discordVal.guild} value={this.state._selects[this.state.keyname]?.["guild"]} onChange={changeCB}>
                            {guildOptions}
                        </select>
                        <select name="channel" defaultValue={discordVal.channel} value={this.state._selects[this.state.keyname]?.["channel"]} onChange={changeCB}>
                            {channelOptions}
                        </select>
                    </label>;
                }else{
                    input = <label key={this.state.keyname+guildOptions.length+channelOptions.length}>
                        No guilds found. Invite your Spooder to a Discord server to assign a channel.
                    </label>;
                }
                
                //onMultiChanged
                
            break;
            default:
                input = <input key={this.state.keyname} type={type} name={this.state.keyname} defaultValue={value} onChange={changeCB}/>;
        }
        return input;
    }

    addMultiInput(newVal){
        let newValues = this.state.value!=null?[...this.state.value]:[];
        
        console.log(newVal, newValues);
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
        this.onChanged(e);
    }

    removeMultiInput(index){
        let newValues = [...this.state.value];
        newValues.splice(index, 1);
        let e = {
            target:{
                type:"multi",
                value:newValues
            }
        }
        this.onChanged(e);
    }

    getAssetOptions(mediaType, folder){
        //console.log("GET ASSETS", mediaType, this.state._assets);
        if(this.state.assets == null){return [];}
        if(folder == "" || folder == null){
            folder = "root";
        }
		let assets = this.state.assets;
        let options = {};
        let extensions = window.mediaExtensions;
        if(assets[folder] != null){
            
            for(let a in assets[folder]){
                let astring = assets[folder][a];
                if(extensions[mediaType] == null){
                    if(folder != "root"){
                        options[astring] = astring.substring(folder.length+1);
                    }else{
                        options[astring] = astring;
                    }
                    
                }else{
                    if(extensions[mediaType].includes(astring.substring(astring.lastIndexOf(".")))){
                        if(folder != "root"){
                            options[astring] = astring.substring(folder.length+1);
                        }else{
                            options[astring] = astring;
                        }
                        
                    }
                }
            }
        }

        //console.log(options);
        let optionHTML = [];
        if(this.state.options?.required == false || this.state.options?.required == null){
            optionHTML.push(<option value=''>None</option>);
        }
        
        for(let o in options){
            optionHTML.push(<option value={o} >{options[o]}</option>);
        }
        
        return optionHTML;
	}

	getUDPOptions(){
		let udpClients = this.state._udpClients;
		let optionHTML = [<option value='-1'>Disabled</option>,<option value='-2'>All</option>];
        for(let c in udpClients){
            optionHTML += [<option value={c}>{c}</option>];
        }
        
        return optionHTML;
	}

    render(){
        let label = <label>{this.state.label}</label>;
        
        if(this.state.multi == true){
            //console.log("DEFAULT", this.state.default);
            let defaultVal = this.state.default==null?null:this.state.default[0];
            let input = this.getInput(this.state.type, defaultVal);
            let varContainer = [];
            for(let v in this.state.value){
                if(this.state.type == "discord"){
                    console.log(this.state.value[v], this.state);
                    varContainer.push(
                        <div className="settings-form-var-button" key={v} index={v} onClick={()=>this.removeMultiInput(v)}>
                            { this.state.discord[this.state.value[v].guild] != null?
                            this.state.discord?.[this.state.value[v].guild].name+" -> "+this.state.discord?.[this.state.value[v].guild].channels[this.state.value[v].channel].name:Object.values(this.state.value[v]).join(", ")}
                        </div>
                    )
                }else if(this.state.type == "obs"){
                    varContainer.push(
                        <div className="settings-form-var-button" key={v} index={v} onClick={()=>this.removeMultiInput(v)}>
                            { this.state.obs.scenes != null?
                            this.state.obs.scenes[this.state.value[v].scene].sceneName+" -> "+this.state.obs.sceneItems[this.state.value[v].scene][this.state.value[v].item].sourceName:Object.values(this.state.value[v]).join(", ")}
                        </div>
                    )
                }else{
                    varContainer.push(
                        <div className="settings-form-var-button" key={v} index={v} onClick={()=>this.removeMultiInput(v)}>
                            {this.state.value[v]}
                        </div>
                    )
                }
                
            }
            
            //console.log("INPUT VALUE", input.props);
            return <div className={"settings-form-input multi "+this.state.type}>
                {label}
                <div className="settings-form-multi-input">
                    <div className="settings-form-multi-ui">
                        {input}
                        <button className="settings-form-multi-add" type="button" onClick={()=>this.addMultiInput(this.state._selects[this.state.keyname])}><FontAwesomeIcon icon={faPlus}/></button>
                    </div>
                    <div className="settings-form-var-container">
                        {varContainer}
                    </div>
                </div>
            </div>
        }else{
            let input = this.getInput(this.state.type);
            return <div className={"settings-form-input "+this.state.type}>
                {label}
                {input}
            </div>
        }
    }
}

export default PluginInput;