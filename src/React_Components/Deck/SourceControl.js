import React from 'react';
import OSC from 'osc-js';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEye, faEyeSlash, faPlus, faMinus} from '@fortawesome/free-solid-svg-icons';
import './SourceControl.css';

class SourceControl extends React.Component{

    constructor(props){
        super(props);
        this.osc = props.osc;

        this.state = {
            isReady:false,
            currentProgramScene:null,
            currentPreviewScene:null,
            studioMode:false,
            oscSubIDs:null,
            sceneItems:{},
            groups:{},
            groupSceneItems:{}
        }

        this.getProgramScene = this.getProgramScene.bind(this);
        this.getSceneItemList = this.getSceneItemList.bind(this);
        this.getGroupList = this.getGroupList.bind(this);
        this.programSceneChanged = this.programSceneChanged.bind(this);
        this.previewSceneChanged = this.previewSceneChanged.bind(this);
        this.studioModeChanged = this.studioModeChanged.bind(this);
        this.sceneItemEnableStateChanged = this.sceneItemEnableStateChanged.bind(this);
        this.expandGroup = this.expandGroup.bind(this);
        //this.toggleStudioMode = this.toggleStudioMode.bind(this);
        //this.startTransition = this.startTransition.bind(this);
    }

    componentDidMount(){
        this.setState(Object.assign(this.state, {
            isReady:true,
            oscSubIDs:{
                sceneList: {address:"/obs/get/scene/program",id:this.osc.on("/obs/get/scene/program", this.getProgramScene)},
                sceneItemList: {address:"/obs/get/scene/itemlist",id:this.osc.on("/obs/get/scene/itemlist", this.getSceneItemList)},
                groupList:{address:"/obs/get/group/list",id:this.osc.on("/obs/get/group/list", this.getGroupList)},
                studioModeChanged: {address:"/obs/event/StudioModeStateChanged",id:this.osc.on("/obs/event/StudioModeStateChanged", this.studioModeChanged)},
                getStudioModeStatus: {address:"/obs/get/studiomode",id:this.osc.on("/obs/get/studiomode", this.studioModeChanged)},
                currentProgramSceneChanged:{address:"/obs/event/CurrentProgramSceneChanged",id:this.osc.on("/obs/event/CurrentProgramSceneChanged", this.programSceneChanged)},
                currentPreviewSceneChanged:{address:"/obs/event/CurrentPreviewSceneChanged",id:this.osc.on("/obs/event/CurrentPreviewSceneChanged", this.previewSceneChanged)},
                sceneItemEnableStateChanged:{address:"/obs/event/SceneItemEnableStateChanged",id:this.osc.on("/obs/event/SceneItemEnableStateChanged", this.sceneItemEnableStateChanged)},
            }
        }));
        
        this.osc.send(new OSC.Message("/obs/get/scene/itemlist", 1));
        this.osc.send(new OSC.Message("/obs/get/studiomode", 1));
    }

    componentWillUnmount(){
        for(let o in this.state.oscSubIDs){
            this.osc.off(this.state.oscSubIDs[o].address, this.state.oscSubIDs[o].id);
        }
    }

    programSceneChanged(data){
        this.osc.send(new OSC.Message("/obs/get/scene/itemlist", 1));
        this.setState(Object.assign(this.state, {
            currentProgramScene:data.args[0]
        }));
    }

    previewSceneChanged(data){
        this.setState(Object.assign(this.state, {
            currentPreviewScene:data.args[0]
        }));
    }

    sceneItemEnableStateChanged(data){
        let sceneItemData = JSON.parse(data.args[0]);
        
        if(Object.keys(this.state.groups).includes(sceneItemData.sceneName)){
            let newGroups = Object.assign(this.state.groups);
            for(let sceneItem in newGroups[sceneItemData.sceneName].items){
                console.log("CHANGING", newGroups[sceneItemData.sceneName].items[sceneItem].sceneItemId, sceneItemData.sceneItemId);
                if(newGroups[sceneItemData.sceneName].items[sceneItem].sceneItemId == sceneItemData.sceneItemId){
                    newGroups[sceneItemData.sceneName].items[sceneItem].sceneItemEnabled = sceneItemData.sceneItemEnabled;
                    break;
                }
            }
            this.setState(Object.assign(this.state, {groups:newGroups}));
        }else{
            let newItems = Object.assign(this.state.sceneItems);
            for(let item in newItems){
                if(newItems[item].id == sceneItemData.sceneItemId){
                    newItems[item].enabled = sceneItemData.sceneItemEnabled;
                    break;
                }
            }
            this.setState(Object.assign(this.state, {sceneItems:newItems}));
        }
        

        
    }

    studioModeChanged(data){
        console.log("STUDIO MODE CHANGED", data.args[0])
        this.setState(Object.assign(this.state, {
            studioMode:data.args[0]
        }));
    }

    getProgramScene(data){
        let sceneData = JSON.parse(data.args[0]);
        if(sceneData.currentProgramSceneName != null){
            this.osc.send(new OSC.Message("/obs/get/scene/itemlist", sceneData.currentProgramSceneName));
        }
        this.setState(Object.assign(this.state, {
            currentProgramScene:sceneData.currentProgramSceneName,
        }));
    }

    getSceneItemList(data){
        
        let sceneItemData = JSON.parse(data.args[0]);

        let groupList = {};
        for(let g in sceneItemData.groups){
            groupList[g] = {
                items:sceneItemData.groups[g],
                expanded:false
            }
        }

        this.setState(Object.assign(this.state, {
            currentProgramScene:sceneItemData.currentProgramSceneName,
            sceneItems:sceneItemData.items,
            groups:groupList,
        }));
    }

    getGroupList(data){
        console.log("GROUP LIST", data);
    }

    setScene(sceneName){
        if(this.state.studioMode){
            this.osc.send(new OSC.Message("/obs/set/scene/preview", sceneName));
        }else{
            this.osc.send(new OSC.Message("/obs/set/scene/program", sceneName));
        }
        
    }

    toggleVisible(sceneName, sceneItemId, sceneItemEnabled){
        this.osc.send(new OSC.Message("/obs/set/source/enabled", JSON.stringify({
            sceneName:sceneName,
            sceneItemId:sceneItemId,
            sceneItemEnabled:sceneItemEnabled
        })));
    }

    expandGroup(e){
        let groupName = e.currentTarget.getAttribute("name");
        let newGroups = Object.assign(this.state.groups);
        newGroups[groupName].expanded = !newGroups[groupName].expanded;
        this.setState(Object.assign(this.state, {groups:newGroups}));
    }

    truncate(str, n){
        return (str.length > n) ? str.substr(0, n-1) + '...' : str;
    }

    render(){
        let groupElements = [];

        for(let g in this.state.groups){
            let thisGroupElement = null;
            let thisGroupSceneItem = null;
            for(let item in this.state.sceneItems){
                
                if(this.state.sceneItems[item].name == g){
                    thisGroupSceneItem = this.state.sceneItems[item];
                    
                }
            }

            //console.log("SOURCE ITEMS", thisGroup);
            
            let visibleIcon = faEye;
            if(thisGroupSceneItem.enabled){
                visibleIcon = faEye;
            }else{
                visibleIcon = faEyeSlash;
            }
            let groupSceneItems = [];
            if(this.state.groups[g].expanded){
                for(let s in this.state.groups[g].items){
                    groupSceneItems.push(
                        <div className="source-item">
                            <div className="source-item-name">
                            {this.state.groups[g].items[s].sourceName}
                        </div>
                        <div className="source-item-actions">
                            <FontAwesomeIcon name={this.state.groups[g].items[s].sourceName} icon={this.state.groups[g].items[s].sceneItemEnabled?faEye:faEyeSlash} size="3x" onClick={()=>{this.toggleVisible(g, this.state.groups[g].items[s].sceneItemId, !this.state.groups[g].items[s].sceneItemEnabled)}}/>
                        </div>
                        </div>
                    )
                }
            }
            thisGroupElement = <div className='source-group-item'>
                    <div className="source-group-item-name">
                        {this.truncate(thisGroupSceneItem.name,12)}
                    </div>
                    <div className="source-group-item-container">
                        <div className="source-group-item-actions">
                            <FontAwesomeIcon className="source-group-item-button" name={thisGroupSceneItem.name} icon={visibleIcon} size="3x" onClick={()=>{this.toggleVisible(this.state.currentProgramScene, thisGroupSceneItem.id, !thisGroupSceneItem.enabled)}}/>
                            <FontAwesomeIcon className="source-group-item-button" name={thisGroupSceneItem.name} icon={this.state.groups[g].expanded?faMinus:faPlus} onClick={this.expandGroup} size="2x"/>
                        </div>
                        <div className="source-group-item-subitems">
                            
                        </div>
                    </div>
                </div>;
            
            groupElements.push(
                <div className={"source-group-container "+(this.state.groups[g].expanded?"expanded":"")}>
                    {thisGroupElement}
                    {groupSceneItems}
                </div>
            )
        }

        let regularSceneItems = [];
        for(let s in this.state.sceneItems){
            if(!Object.keys(this.state.groups).includes(this.state.sceneItems[s].name)){
                regularSceneItems.push(
                    <div className="source-item">
                        <div className="source-item-name">
                        {this.truncate(this.state.sceneItems[s].name,12)}
                    </div>
                    <div className="source-item-actions">
                        <FontAwesomeIcon name={this.state.sceneItems[s].name} icon={this.state.sceneItems[s].enabled?faEye:faEyeSlash} size="3x" onClick={()=>{this.toggleVisible(this.state.currentProgramScene, this.state.sceneItems[s].id, !this.state.sceneItems[s].enabled)}}/>
                    </div>
                    </div>
                )
            }
        }

        return <div className="deck-component deck-source-controller">
            {groupElements}
            {regularSceneItems}
        </div>;
    }
}

export {SourceControl}