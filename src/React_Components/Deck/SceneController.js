import React from 'react';
import OSC from 'osc-js';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTv, faArrowRight, faTableColumns} from '@fortawesome/free-solid-svg-icons';
import './SceneController.css';

class SceneController extends React.Component{

    constructor(props){
        super(props);
        this.osc = props.osc;

        this.state = {
            isReady:false,
            currentProgramScene:null,
            currentPreviewScene:null,
            studioMode:false,
            oscSubIDs:null,
            scenes:{}
        }

        this.getSceneList = this.getSceneList.bind(this);
        this.programSceneChanged = this.programSceneChanged.bind(this);
        this.previewSceneChanged = this.previewSceneChanged.bind(this);
        this.studioModeChanged = this.studioModeChanged.bind(this);
        this.toggleStudioMode = this.toggleStudioMode.bind(this);
        this.startTransition = this.startTransition.bind(this);
    }

    componentDidMount(){
        this.setState(Object.assign(this.state, {
            isReady:true,
            oscSubIDs:{
                sceneList: {address:"/obs/get/scene/list",id:this.osc.on("/obs/get/scene/list", this.getSceneList)},
                studioModeChanged: {address:"/obs/event/StudioModeStateChanged",id:this.osc.on("/obs/event/StudioModeStateChanged", this.studioModeChanged)},
                getStudioModeStatus: {address:"/obs/get/studiomode",id:this.osc.on("/obs/get/studiomode", this.studioModeChanged)},
                currentProgramSceneChanged:{address:"/obs/event/CurrentProgramSceneChanged",id:this.osc.on("/obs/event/CurrentProgramSceneChanged", this.programSceneChanged)},
                currentPreviewSceneChanged:{address:"/obs/event/CurrentPreviewSceneChanged",id:this.osc.on("/obs/event/CurrentPreviewSceneChanged", this.previewSceneChanged)}
            }
        }));
        this.osc.send(new OSC.Message("/obs/get/scene/list", 1));
        this.osc.send(new OSC.Message("/obs/get/studiomode", 1));
    }

    componentWillUnmount(){
        for(let o in this.state.oscSubIDs){
            this.osc.off(this.state.oscSubIDs[o].address, this.state.oscSubIDs[o].id);
        }
    }

    programSceneChanged(data){
        this.setState(Object.assign(this.state, {
            currentProgramScene:data.args[0]
        }));
    }

    previewSceneChanged(data){
        this.setState(Object.assign(this.state, {
            currentPreviewScene:data.args[0]
        }));
    }

    studioModeChanged(data){
        this.setState(Object.assign(this.state, {
            studioMode:data.args[0]
        }));
    }

    getSceneList(data){
        let sceneData = JSON.parse(data.args[0]);
        this.setState(Object.assign(this.state, {
            currentPreviewScene:sceneData.currentPreviewSceneName,
            currentProgramScene:sceneData.currentProgramSceneName,
            scenes:sceneData.scenes
        }))
    }

    setScene(sceneName){
        if(this.state.studioMode){
            this.osc.send(new OSC.Message("/obs/set/scene/preview", sceneName));
        }else{
            this.osc.send(new OSC.Message("/obs/set/scene/program", sceneName));
        }
        
    }

    toggleStudioMode(){
        this.osc.send(new OSC.Message("/obs/set/studiomode", !this.state.studioMode));
        this.setState(Object.assign(this.state,{studioMode:!this.state.studioMode}));
    }

    startTransition(){
        this.osc.send(new OSC.Message("/obs/transition/Trigger", 1));
    }

    truncate(str, n){
        return (str.length > n) ? str.substr(0, n-1) + '...' : str;
    }

    render(){

        let sceneButtons = [];
        for(let s in this.state.scenes){
            sceneButtons.push(
                <div onClick={()=>{this.setScene(this.state.scenes[s].sceneName)}} className={"scene-controller-scene-button "
                +(this.state.currentProgramScene==this.state.scenes[s].sceneName?"program ":"")
                +(this.state.currentPreviewScene==this.state.scenes[s].sceneName&&this.state.studioMode==true?"preview":"")}>
                    <h1>{this.truncate(this.state.scenes[s].sceneName, 12)}</h1><FontAwesomeIcon icon={faTv} size="2x"/></div>
            )
        }

        return <div className="deck-component deck-scene-controller">
            <label className="deck-component-label">Scenes</label>
            <div className="scene-controller-transition">
                <div onClick={this.toggleStudioMode} className={"scene-controller-studiomode-button "+(this.state.studioMode==true?"enabled":"")}>
                    <FontAwesomeIcon icon={faTableColumns} size="2x"/>
                </div>
                <div onClick={this.startTransition} className="scene-controller-transition-button">
                    <FontAwesomeIcon icon={faArrowRight} size="2x"/>
                </div>
            </div>
            <div className="scene-controller-container">
                {sceneButtons}
            </div>
        </div>
    }
}

export {SceneController}