import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

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

export default PluginSubform;