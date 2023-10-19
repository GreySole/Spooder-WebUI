import React, { createRef } from 'react';
import PluginSubform from './PluginSubform';
import PluginInput from './PluginInput.js';

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

export default SettingsForm;