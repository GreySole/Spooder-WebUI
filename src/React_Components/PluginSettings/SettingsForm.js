import React, { createRef } from 'react';
import BoolSwitch from '../UI/BoolSwitch.js';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faFileImport, faTrash } from '@fortawesome/free-solid-svg-icons';

class SettingsForm extends React.Component{
    constructor(props){
        super(props);
        let newProps = Object.assign({},props);

        let values = newProps.values;
        let defaults = newProps.data.defaults;
        for(let d in defaults){
            if(values[d] == null){
                if(typeof defaults[d] == "object" && !Array.isArray(defaults[d])){
                    values[d] = {};
                }else if(typeof defaults[d] == "object" && Array.isArray(defaults[d])){
                    values[d] = [];
                }else{
                    values[d] = defaults[d];
                }
            }
            if(Array.isArray(defaults[d]) && !Array.isArray(values[d])){
                values[d] = [values[d]];
            }else if(!Array.isArray(defaults[d]) && Array.isArray(values[d])){
                values[d] = values[d][0];
            }
        }
        
        this.state = {
            pluginName:newProps.pluginName,
            form:newProps.data.form,
            defaults:newProps.data.defaults,
            values:newProps.values,
            keynameChanges:{},
            assets:{},
            discord:{},
            obs:{},
            udpClients:newProps.data.udpClients,
            saveSettings:newProps.saveSettings
        };

        this.onInputChange = this.onInputChange.bind(this);
        this.saveSettings = this.saveSettings.bind(this);
        this.getGlobalValue = this.getGlobalValue.bind(this);

        this.onAddForm = this.onAddForm.bind(this);
        this.onRemoveForm = this.onRemoveForm.bind(this);
    }

    componentDidMount(){
        this.getAssets(this.state.options?.folder);
        this.getOBSChannels();
        this.getDiscordChannels();
    }

    onInputChange(newData){
        
        let newValues = Object.assign(this.state.values);
        let nameChanges = Object.assign(this.state.keynameChanges);
        if(newData.subvar){
            if(newData.subvar == "keyname"){
                if(nameChanges[newData.inputName] == null){
                    nameChanges[newData.inputName] = {};
                }
                nameChanges[newData.inputName][newData.subname] = newData.value;
            }else{
                newValues[newData.inputName][newData.subname][newData.subvar] = newData.value;
            }
        }else{
            newValues[newData.inputName] = newData.value;
        }
        
        this.setState(Object.assign(this.state, {values:newValues, keynameChanges:nameChanges}),()=>{
            document.body.scrollLeft = 0;
        });
    }

    getGlobalValue(varname){
        return this.state.values[varname];
    }

    saveSettings(){
        for(let n in this.state.keynameChanges){
            for(let k in this.state.keynameChanges[n]){
                this.state.values[n][this.state.keynameChanges[n][k]] = Object.assign({},this.state.values[n][k]);
                delete this.state.values[n][k];
            }
            
        }
        this.state.saveSettings(this.state.pluginName,Object.assign({}, this.state.values));
    }

    getAssets(path){
        if(path == null){path=""}
        fetch("/get_plugin_assets", {
            method:"POST",
            body:JSON.stringify({
                pluginname:this.state.pluginName,
                folder:path
            }),
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
        })
        .then(data=>data.json())
        .then(data =>{
            //console.log("ASSETS GET", data);
            this.setState(Object.assign(this.state, {assets:data.dirs}));
        }).catch(e=>{
            console.log(e);
        })
    }

    translateCondition(condition){
        let newCondition = condition;
        switch(condition.toLowerCase()){
            case "equals":
                newCondition = "==";
            break;
            case "not equal":
                newCondition = "!=";
            break;
            case "less than":
                newCondition = "<";
            break;
            case "greater than":
                newCondition = ">";
            break;
            case "less than or equal to":
                newCondition = "<=";
            break;
            case "greater than or equal to":
                newCondition = ">=";
            break;
        }
        return newCondition;
    }

    onAddForm(subform, newKey, newForm){
        //console.log(subform, newKey, newForm);
        let newValues = Object.assign({}, this.state.values);
        newValues[subform][newKey] = newForm;
        this.setState(Object.assign(this.state, {values:newValues}),
        function(){
            document.querySelector("#"+subform+"-subform .settings-subform-clones").scrollLeft = document.querySelector("#"+subform+"-subform .settings-subform-clones").scrollWidth;
        });
    }

    onRemoveForm(subform, keyname){
        //console.log(subform, keyname);
        let newValues = Object.assign({}, this.state.values);
        delete newValues[subform][keyname];
        this.setState(Object.assign(this.state, {values:newValues}));
    }

    getSpooderEvents(){
        fetch("/command_table")
        .then(response => response.json())
        .then(data => {
            this.setState(Object.assign(this.state, {spooder:{events:data.express.events, groups:data.express.groups}}))
        })
        .catch(e=>{
            console.log(e);
        })
    }

    getOBSChannels(){
        fetch("/obs/get_scenes")
        .then(response => response.json())
        .then(data => {
            this.setState(Object.assign(this.state, {obs:data}));
        })
        .catch(e=>{
            console.log(e);
        })
    }

    getDiscordChannels(){
        fetch("/discord/get_channels")
        .then(response => response.json())
        .then(data => {
            this.setState(Object.assign(this.state, {discord:data}));
        })
        .catch(e=>{
            console.log(e);
        })
    }

    render(){
        let elements = this.state.form;
        let inputTable = [];
        for(let e in elements){
            if(elements[e].type == "subform"){
                //console.log(this.state.defaults[e], e);
                inputTable.push(<PluginSubform key={this.state.assets!=null?e+Object.keys(this.state.assets).length+":"+Object.keys(this.state.discord).length+":"+Object.keys(this.state.obs).length:e}
                    keyname={e} 
                    pluginName={this.state.pluginName}
                    form={elements[e].form} 
                    label={elements[e].label}
                    default={this.state.defaults[e]} 
                    value={this.state.values[e]} 
                    udpClients={this.state.udpClients}
                    assets={this.state.assets}
                    discord={this.state.discord}
                    obs={this.state.obs}
                    onChange={this.onInputChange}
                    onAddForm={this.onAddForm}
                    onRemoveForm={this.onRemoveForm}
                    getGlobalValue={this.getGlobalValue}/>);
            }else{
                if(elements[e].showif){
                    if(this.state.values[elements[e].showif.variable] != null){
                        if(!eval(""+this.state.values[elements[e].showif.variable]+this.translateCondition(elements[e].showif.condition)+elements[e].showif.value)){
                            continue;
                        }
                    }
                }
                
                inputTable.push(<PluginInput key={this.state.assets!=null?e+Object.keys(this.state.assets).length+":"+Object.keys(this.state.discord).length+":"+Object.keys(this.state.obs).length:e}
                    keyname={e} 
                    pluginName={this.state.pluginName}
                    type={elements[e].type}
                    label={elements[e].label}
                    options={elements[e].options}
                    default={this.state.defaults[e]} 
                    value={this.state.values[e]} 
                    multi={elements[e]["multi-select"]} 
                    udpClients={this.state.udpClients}
                    assets={this.state.assets}
                    discord={this.state.discord}
                    obs={this.state.obs}
                    onChange={this.onInputChange}
                    getGlobalValue={this.getGlobalValue}/>);
            }
            
        }
        return <div className="settings-form-element">
                {inputTable}
                <div className="save-div"><button className='save-button' onClick={this.saveSettings}>Save</button><div className="save-status"></div></div>
                
            </div>
    }
}

class PluginSubform extends React.Component{
    constructor(props){
        super(props);
        this.state = Object.assign({},props);

        let values = this.state.value;
        let defaults = this.state.default;
        
        for(let v in values){
            for(let d in defaults){
                //console.log("DVs",values[v][d]);
                if(values[v][d] == null){
                    if(typeof defaults[d] == "object"){
                        values[v][d] = {};
                    }else{
                        values[v][d] = defaults[d];
                    }
                }
                if(Array.isArray(defaults[d]) && !Array.isArray(values[v][d]) && typeof values[v][d] != "object"){
                    values[v][d] = [values[v][d]];
                }else if(Array.isArray(defaults[d]) && !Array.isArray(values[v][d]) && typeof values[v][d] == "object"){
                    values[v][d] = Object.values(values[v][d]);
                }else if(!Array.isArray(defaults[d]) && Array.isArray(values[v][d])){
                    values[v][d] = values[v][d][0];
                }
            }
        }

        
        //console.log("VALUES",this.state.value);
        this.onChanged = this.onChanged.bind(this);
        this.addForm = this.addForm.bind(this);
        this.removeForm = this.removeForm.bind(this);
    }

    onChanged(e){
        console.log(e);
        this.state.onChange({inputName:this.state.keyname, subname:e.subname, subvar:e.inputName, value:e.value});
    }

    translateCondition(condition){
        let newCondition = condition;
        switch(condition.toLowerCase()){
            case "equals":
                newCondition = "==";
            break;
            case "not equal":
                newCondition = "!=";
            break;
            case "less than":
                newCondition = "<";
            break;
            case "greater than":
                newCondition = ">";
            break;
            case "less than or equal to":
                newCondition = "<=";
            break;
            case "greater than or equal to":
                newCondition = ">=";
            break;
        }
        return newCondition;
    }

    addForm(){
        let newVals = Object.assign({},this.state.value);
        let renameCount = 1;
        if(newVals["newform"+renameCount] != null){
            while(newVals["newform"+renameCount] != null){
                renameCount++;
            }
        }
        let newKey = "newform"+renameCount;
        this.state.onAddForm(this.state.keyname, newKey, Object.assign({},this.state.default));
    }

    removeForm(keyname){
        this.state.onRemoveForm(this.state.keyname, keyname);
    }

    render(){
        
        let subElements = this.state.value;
        let form = this.state.form;
        //console.log("RENDER SUBFORM", subElements, form, this.state.default);
        let subClones = [];
        for(let se in subElements){
            
            let subInputs = [];
            for(let fe in form){
                //console.log("SUBFORM", se, fe)
                if(form[fe].showif){
                    
                    if(subElements[se][form[fe].showif.variable] != null){
                        let variable = subElements[se][form[fe].showif.variable];
                        if(typeof variable == "string"){variable = "'"+variable+"'"}
                        let value = form[fe].showif.value;
                        if(typeof value == "string"){value = "'"+value+"'"}
                        //console.log("SHOW IF",""+variable+this.translateCondition(form[fe].showif.condition)+value, value);
                        if(!eval(""+variable+this.translateCondition(form[fe].showif.condition)+value)){
                            //console.log("HIDE", se);
                            continue;
                        }
                    }else if(this.state.getGlobalValue(form[fe].showif.variable) != null){
                        
                        let variable = this.state.getGlobalValue(form[fe].showif.variable);
                        
                        if(typeof variable == "string"){variable = "'"+variable+"'"}
                        let value = form[fe].showif.value;
                        if(typeof value == "string"){value = "'"+value+"'"}
                        
                        if(!eval(""+variable+this.translateCondition(form[fe].showif.condition)+value)){
                            //console.log("HIDE", se);
                            continue;
                        }
                    }else{
                        continue;
                    }
                }
                //console.log(this.state.default);
                subInputs.push(
                        <PluginInput key={this.state.keyname+fe+Object.keys(this.state.assets).length+Object.keys(this.state.value).length+Object.keys(this.state.discord).length+Object.keys(this.state.obs).length} keyname={fe} subname={se}
                        pluginName={this.state.pluginName}
                        type={form[fe].type} 
                        label={form[fe].label} 
                        options={form[fe].options}
                        default={this.state.default?.[fe]} 
                        value={fe=="keyname"?se:subElements[se][fe]}
                        multi={form[fe]["multi-select"]} 
                        udpClients={this.state.udpClients}
                        assets={this.state.assets}
                        discord={this.state.discord}
                        obs={this.state.obs}
                        onChange={this.onChanged}/>
                )
            }
            subClones.push(
                <div className="settings-subform-clone">
                    {subInputs}
                    <button className="delete-button" onClick={()=>this.removeForm(se)}><FontAwesomeIcon icon={faTrash} /></button>
                </div>
            )
        }
        //console.log("RETURNING SUB CLONES", subClones);
        return <div id={this.state.keyname+"-subform"} className="settings-subform">
            <label className="settings-subform-label">{this.state.label}</label>
                <div key={this.state.keyname} className="settings-subform-clones">{subClones}</div>
                <button className="add-button" onClick={this.addForm}><FontAwesomeIcon icon={faPlus}/></button>
        </div>;
    }
}

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
        console.log(e.target.files);
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
		
        if(this.state.multi == true){
            let newSelects = Object.assign({}, this.state._selects);
            
            let newAsset = null;
            if(this.state.options.folder == null){
                newAsset = e.target.files[0].name;
            }else{
                newAsset = this.state.options?.folder+"/"+e.target.files[0].name;
            }
            newSelects[this.state.keyname] = newAsset;

            this.setState(Object.assign(this.state, {assets:newState, value:newAsset, _selects:newSelects}),
            ()=>{
                e.target.parentElement.querySelector("select[name="+this.state.keyname+"]").value = newAsset;
            });
        }else{
            let newAsset = null;
            if(this.state.options.folder == null){
                newAsset = e.target.files[0].name;
            }else{
                newAsset = this.state.options?.folder+"/"+e.target.files[0].name;
            }

            this.setState(Object.assign(this.state, {assets:newState, value:newAsset}),
            ()=>{
                
                e.target.parentElement.querySelector("select[name="+this.state.keyname+"]").value = newAsset;
                //console.log(e.target.parentElement.querySelector("select").value ,e.target.parentElement.querySelector("select"));
            });
        }
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
            case "keyname":
                input = <label key={this.state.keyname}><input type={type} name={this.state.keyname} defaultValue={value} onChange={changeCB}/></label>;
            break;
            case "asset":
                let assets = this.getAssetOptions(this.state.options?.assetType, this.state.options?.folder);
                let assetType = this.state.options?.assetType!=null?this.state.options.assetType+"/*":"*";

                if(value==null && this.state.options.required == true){
                    console.log(this.state.assets);
                    if(this.state.options.folder != null){
                        if(this.state.assets[this.state.options.folder]?.[0] != null){
                            changeCB({target:{value:this.state.assets[this.state.options.folder]?.[0]}});
                        }
                    }else{
                        changeCB({target:{value:this.state.assets[0]}});
                    }
                }
                
                input = <label key={this.state.keyname+Object.keys(this.state.assets).length} name={this.state.keyname} htmlFor={'input-file-'+this.state.keyname} >
                            <select name={this.state.keyname} defaultValue={value} onChange={changeCB}>{assets}</select>
                            <button className="settings-form-asset-upload" onClick={this.handleAssetUploadClick}><FontAwesomeIcon icon={faFileImport} size="lg" /></button>
                            <input type='file' id={'input-file-'+this.state.keyname} name={this.state.keyname} accept={assetType} onChange={this.uploadAsset.bind(this)} style={{ display: 'none' }} />
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

                let sceneIndex = -1;
                if(this.state.value!=null){
                    for(let d in this.state.obs.scenes){
                        if(this.state.obs.scenes[d].sceneName == this.state.value.scene){
                            sceneIndex = d;
                        }
                    }
                }

                if(Object.keys(this.state.obs).length > 0){
                    for(let d in this.state.obs.scenes){
                        sceneOptions.push(
                            <option value={this.state.obs.scenes[d].sceneName}>{this.state.obs.scenes[d].sceneName}</option>
                        );
                    }
    
                    if(this.state.multi == true){
                        let obsSelect = this.state._selects[this.state.keyname];
                        if(obsSelect != null){
                            let selectSceneIndex = -1;
                            if(obsSelect.scene!=""){
                                for(let d in this.state.obs.scenes){
                                    if(this.state.obs.scenes[d].sceneName == obsSelect.scene){
                                        selectSceneIndex = d;
                                    }
                                }
                            }
                            if(selectSceneIndex != -1){
                                for(let c in this.state.obs.sceneItems[selectSceneIndex]){
                                    itemOptions.push(
                                        <option value={this.state.obs.sceneItems[selectSceneIndex][c].sourceName}>{this.state.obs.sceneItems[selectSceneIndex][c].sourceName}</option>
                                    );
                                }
                            }
                        }
                        
                    }else{
                        if(sceneIndex != -1){
                            for(let c in this.state.obs.sceneItems[sceneIndex]){
                                itemOptions.push(
                                    <option value={this.state.obs.sceneItems[sceneIndex][c].sourceName}>{this.state.obs.sceneItems[sceneIndex][c].sourceName}</option>
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
                            { 
                            this.state.value[v].scene+" -> "+this.state.value[v].item}
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

export default SettingsForm;