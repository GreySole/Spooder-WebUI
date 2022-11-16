import React from 'react';
import OSC from 'osc-js';
import './VolumeControl.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faVolumeMute, faVolumeHigh, faEye, faEyeSlash, faPlus, faMinus} from '@fortawesome/free-solid-svg-icons';

class VolumeControl extends React.Component{
    constructor(props){
        super(props);
        this.osc = props.osc;

        this.state = {
            inputs:{},
            meters:{inputs:{}},
            groups:{},
            isReady:false,
            oscSubIDs: {}
        }
        this.receiveMeter = this.receiveMeter.bind(this);
        this.getVolumes = this.getVolumes.bind(this);
        this.getVolume = this.getVolume.bind(this);
        this.setVolume = this.setVolume.bind(this);
        this.toggleMute = this.toggleMute.bind(this);
        this.volumeChanged = this.volumeChanged.bind(this);
        this.muteStateChanged = this.muteStateChanged.bind(this);
        this.programSceneChanged = this.programSceneChanged.bind(this);
        this.activateInputVolumeMeters = this.activateInputVolumeMeters.bind(this);

        this.setGroupVolume = this.setGroupVolume.bind(this);
        this.toggleGroupMute = this.toggleGroupMute.bind(this);
        this.expandGroup = this.expandGroup.bind(this);

    }

    componentDidMount(){
        
        this.setState(Object.assign(this.state, {
            isReady:true,
            oscSubIDs:{
                InputVolumeMeters:{address:"/obs/sound/InputVolumeMeters",id:this.osc.on("/obs/sound/InputVolumeMeters", this.receiveMeter)},
                InputVolumeMetersActivate:{address:"/obs/event/InputVolumeMeters", id:this.osc.on("/obs/event/InputVolumeMeters", this.activateInputVolumeMeters)},
                GetInputList: {address:"/obs/get/input/volumelist",id:this.osc.on("/obs/get/input/volumelist", this.getVolumes)},
                GetVolumes: {address:"/obs/get/input/volume",id:this.osc.on("/obs/get/input/volume", this.getVolume)},
                GetInputMute: {address:"/obs/get/input/mute",id:this.osc.on("/obs/get/input/mute", this.getMute)},
                InputVolumeChanged: {address:"/obs/event/InputVolumeChanged",id:this.osc.on("/obs/event/InputVolumeChanged", this.volumeChanged)},
                InputMuteStateChanged: {address:"/obs/event/InputMuteStateChanged",id:this.osc.on("/obs/event/InputMuteStateChanged", this.muteStateChanged)},
                currentProgramSceneChanged:{address:"/obs/event/CurrentProgramSceneChanged",id:this.osc.on("/obs/event/CurrentProgramSceneChanged", this.programSceneChanged)},
            }
        }));
        this.osc.send(new OSC.Message("/obs/event/InputVolumeMeters", 1));
        this.osc.send(new OSC.Message("/obs/get/input/volumelist"));
    }

    componentWillUnmount(){
        //return;
        for(let o in this.state.oscSubIDs){
            this.osc.off(this.state.oscSubIDs[o].address, this.state.oscSubIDs[o].id);
        }
        
        this.osc.send(new OSC.Message("/obs/event/InputVolumeMeters", 0));
    }

    activateInputVolumeMeters(){
        this.osc.send(new OSC.Message("/obs/event/InputVolumeMeters", 1));
    }

    programSceneChanged(data){
        console.log("PROGRAM",this.state.currentProgramScene, data.args[0]);
        this.osc.send(new OSC.Message("/obs/get/input/volumelist", 1));
    }

    getVolumes(data){
        let inputs = JSON.parse(data.args[0]);
        let groups = Object.assign(inputs.groups);
        let newGroups = {};
        let newVolumes = Object.assign(this.state.inputs);
        for(let i in inputs.items){
            if(inputs.items[i].volumeData != null){
                newVolumes[inputs.items[i].name] = inputs.items[i];
            }
            if(groups[inputs.items[i].name] != null){
                newGroups[inputs.items[i].name] = {
                    items:groups[inputs.items[i].name],
                    enabled:inputs.items[i].enabled,
                    expanded:false,
                    groupMuted:false,
                    id:inputs.items[i].id
                }
            }
        }

        for(let g in newGroups){
            let isMuted = true;
            for(let s in newGroups[g].items){
                if(newVolumes[newGroups[g].items[s].sourceName].volumeMuteData != null){
                    if(newVolumes[newGroups[g].items[s].sourceName].volumeMuteData.inputMuted == false){
                        isMuted = false;
                    }
                }
            }
            newGroups[g].groupMuted = isMuted;
        }
        
        this.setState(Object.assign(this.state, {inputs:newVolumes, groups:newGroups}));
    }

    getVolume(data){

        let volumeData = JSON.parse(data.args[0]);
        let newVolumes = Object.assign(this.state.volumes);
        newVolumes[volumeData.inputName] = volumeData.inputVolumeMul;
        this.setState(Object.assign(this.state, {volumes:newVolumes}));
        //console.log("GOT VOLUME",volumeData);

    }

    getMute(data){
        let muteObj = JSON.parse(data.args[0]);

        let newInputs = Object.assign(this.state.inputs);
        let newGroups = Object.assign(this.state.groups);
        newInputs[muteObj.inputName] = muteObj.inputMuted;
        for(let g in newGroups){
            let isMuted = true;
            for(let s in newGroups[g].items){
                if(newInputs[newGroups[g].items[s].sourceName].volumeMuteData != null){
                    if(newInputs[newGroups[g].items[s].sourceName].volumeMuteData.inputMuted == false){
                        isMuted = false;
                    }
                }
            }
            newGroups[g].groupMuted = isMuted;
        }
        this.setState(Object.assign(this.state, {inputs:newInputs, groups:newGroups}));
    }

    setVolume(e){
        let inputName = e.currentTarget.getAttribute("inputname");
        let value = e.currentTarget.value;
        //Math.pow(this.state.volumes[inputName],0.1)
        this.osc.send(new OSC.Message("/obs/set/input/volume", JSON.stringify({inputName:inputName, value:parseFloat(value)**2})));
    }

    volumeChanged(data){
        let volumeData = JSON.parse(data.args[0]);
        let newInputs = Object.assign(this.state.inputs);
        
        console.log("VOLUME CHANGED", volumeData);
    }

    muteStateChanged(data){
        let muteData = JSON.parse(data.args[0]);
        let newInputs = Object.assign(this.state.inputs);
        newInputs[muteData.inputName].volumeMuteData.inputMuted = muteData.inputMuted;
        console.log("MUTE CHANGED", muteData);
    }

    receiveMeter(data){
        let recMeters = JSON.parse(data.args[0]);
        if(this.state.isReady == true){
            //Meter decay
            for(let meter in recMeters.inputs){
                if(recMeters.inputs[meter].inputLevelsMul.length>0){
                    for(let speaker in recMeters.inputs[meter].inputLevelsMul){
                        recMeters.inputs[meter].inputLevelsMul[speaker][1] = Math.pow(recMeters.inputs[meter].inputLevelsMul[speaker][1],0.2);
                        if(this.state.meters.inputs[meter]?.inputLevelsMul[speaker] && recMeters.inputs[meter]?.inputLevelsMul[speaker]){
                            if(this.state.meters.inputs[meter].inputLevelsMul[speaker].length === recMeters.inputs[meter].inputLevelsMul[speaker].length){
                                if(recMeters.inputs[meter].inputLevelsMul[speaker][1] < this.state.meters.inputs[meter].inputLevelsMul[speaker][1]){
                                    recMeters.inputs[meter].inputLevelsMul[speaker][1] = this.state.meters.inputs[meter].inputLevelsMul[speaker][1]-0.005;
                                    if(recMeters.inputs[meter].inputLevelsMul[speaker][1]<0){recMeters.inputs[meter].inputLevelsMul[speaker][1] = 0}
                                }
                            }
                        }
                    }
                }
            }
            
            this.setState(Object.assign(this.state, {meters:recMeters}));
        }
        
    }

    truncate(str, n){
        return (str.length > n) ? str.substr(0, n-1) + '...' : str;
    }

    toggleMute(e){
        let inputName = e.currentTarget.getAttribute("inputname");
        console.log(inputName);
        let inputMuted = !this.state.inputs[inputName].volumeMuteData.inputMuted;
        let newInputs = Object.assign(this.state.inputs);
        this.osc.send(new OSC.Message("/obs/set/input/mute", JSON.stringify({inputName:inputName, inputMuted:inputMuted})));
        newInputs[inputName].volumeMuteData.inputMuted = inputMuted;
        let newGroups = Object.assign(this.state.groups);
        for(let g in newGroups){
            let isMuted = true;
            for(let s in newGroups[g].items){
                if(newInputs[newGroups[g].items[s].sourceName].volumeMuteData != null){
                    if(newInputs[newGroups[g].items[s].sourceName].volumeMuteData.inputMuted == false){
                        isMuted = false;
                    }
                }
            }
            newGroups[g].groupMuted = isMuted;
        }
        this.setState(Object.assign(this.state, {inputs:newInputs, groups:newGroups}));
    }

    setGroupVolume(e){
        let inputName = e.currentTarget.getAttribute("inputname");
        let inputValue = e.currentTarget.value*2;
    }

    toggleGroupMute(e){
        let inputName = e.currentTarget.getAttribute("inputname");
        console.log(inputName);
        let newInputs = Object.assign(this.state.inputs);
        let newGroups = Object.assign(this.state.groups);
        let groupMuted = !newGroups[inputName].groupMuted;

        for(let s in newGroups[inputName].items){
            console.log(newGroups[inputName].items[s].sourceName);
            this.osc.send(new OSC.Message("/obs/set/input/mute", JSON.stringify({inputName:newGroups[inputName].items[s].sourceName, inputMuted:groupMuted})));
        }

        newGroups[inputName].groupMuted = groupMuted;

        this.setState(Object.assign(this.state, {groups:newGroups}));
    }

    expandGroup(e){
        let inputName = e.currentTarget.getAttribute("inputname");
        let newGroups = Object.assign(this.state.groups);
        newGroups[inputName].expanded = !newGroups[inputName].expanded;
        this.setState(Object.assign(this.state, {groups:newGroups}));
    }



    render(){

        let meterElements = [];
        let groupElements = [];
        let groupItemElements = {};
        let groupNames = [];
        let groupLevel = {};
        for(let g in this.state.groups){
            groupItemElements[g] = [];
            groupLevel[g] = {
                l:[0.0,0.0,0.0],
                r:[0.0,0.0,0.0],
                enabled:false
            };
        }
        if(Object.keys(this.state.inputs).length == 0){
            return <div className="deck-component deck-volume-control"></div>;
        }
       
        for(let m in this.state.meters.inputs){
            let inputName = this.state.meters.inputs[m].inputName;
            for(let g in this.state.groups){
                
                for(let s in this.state.groups[g].items){
                    if(this.state.groups[g].items[s].sourceName == inputName){
                        
                        groupNames.push(inputName);
                        groupLevel[g].enabled = true;
                        if(this.state.groups[g].expanded){
                            //console.log("PUSHING", inputName, "to", g);
                            groupItemElements[g].push(
                                <div className="deck-volume-meter" >
                                    <div className="deck-volume-meter-label">
                                        {this.truncate(this.state.meters.inputs[m].inputName, 16)}
                                    </div>
                                    <div className="deck-volume-meter-ui">
                                        <div className="deck-volume-meter-bars" key={inputName+"-"+this.state.meters.inputs[m].inputLevelsMul.join(",")}>
                                            <VolumeMeter lr="l" level={this.state.meters.inputs[m].inputLevelsMul[0]} />
                                            <VolumeMeter lr="r" level={this.state.meters.inputs[m].inputLevelsMul[1]} />
                                            
                                        </div>
                                        <div className="deck-volume-control-slider">
                                            <input key={inputName+"- Volume - "+Object.keys(this.state.inputs).length} inputname={inputName} onChange={this.setVolume} orient={window.innerWidth<600?"vertical":"vertical"} type="range" min={0} max={1} step={0.01} defaultValue={this.state.inputs[inputName].volumeData.inputVolumeMul!=null?Math.sqrt(this.state.inputs[inputName].volumeData.inputVolumeMul):0}/>
                                        </div>
                                        <div className="deck-source-buttons">
                                            <button inputname={inputName} onClick={this.toggleMute}><FontAwesomeIcon icon={this.state.inputs[inputName].volumeMuteData.inputMuted?faVolumeMute:faVolumeHigh}/></button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        
                        if(this.state.meters.inputs[m].inputLevelsMul.length > 0){
                            
                            if(this.state.meters.inputs[m].inputLevelsMul[0][1] > groupLevel[g].l[1]){
                               
                                groupLevel[g].l = this.state.meters.inputs[m].inputLevelsMul[0];
                                
                            }
                            if(this.state.meters.inputs[m].inputLevelsMul[1][1] > groupLevel[g].r[1]){
                                groupLevel[g].r = this.state.meters.inputs[m].inputLevelsMul[1];
                            }
                        }

                    }
                }
                
            }
            if(!groupNames.includes(inputName)){
                if(this.state.inputs[inputName] != null){
                    meterElements.push(
                        <div className="deck-volume-meter" >
                            <div className="deck-volume-meter-label">
                                {this.truncate(this.state.meters.inputs[m].inputName, 16)}
                            </div>
                            <div className="deck-volume-meter-ui">
                                <div className="deck-volume-meter-bars" key={inputName+"-"+this.state.meters.inputs[m].inputLevelsMul.join(",")}>
                                    <VolumeMeter lr="l" level={this.state.meters.inputs[m].inputLevelsMul[0]} />
                                    <VolumeMeter lr="r" level={this.state.meters.inputs[m].inputLevelsMul[1]} />
                                    
                                </div>
                                <div className="deck-volume-control-slider">
                                    <input key={inputName+"- Volume - "+Object.keys(this.state.inputs).length} inputname={inputName} onChange={this.setVolume} orient={window.innerWidth<600?"vertical":"vertical"} type="range" min={0} max={1} step={0.01} defaultValue={this.state.inputs[inputName].volumeData.inputVolumeMul!=null?Math.sqrt(this.state.inputs[inputName].volumeData.inputVolumeMul):0}/>
                                </div>
                                <div className="deck-source-buttons">
                                    <button inputname={inputName} onClick={this.toggleMute}><FontAwesomeIcon icon={this.state.inputs[inputName].volumeMuteData.inputMuted?faVolumeMute:faVolumeHigh}/></button>
                                </div>
                            </div>
                        </div>
                    );
                }
            }
        }
        
        for(let g in groupLevel){
            //console.log(groupLevel[g]);
            if(!groupLevel[g].enabled){continue;}
            groupElements.push(
                <div className="deck-volume-meter" >
                        <div className="deck-volume-meter-label">
                            {this.truncate(g, 16)}
                        </div>
                        <div className="deck-volume-meter-ui">
                            <div className="deck-volume-meter-bars" key={g+"-"+groupLevel[g].l[1]+groupLevel[g].r[1]}>
                                <VolumeMeter level={groupLevel[g].l} />
                                <VolumeMeter level={groupLevel[g].r} />
                                
                            </div>
                            <div className="deck-source-buttons">
                                <button inputname={g} onClick={this.expandGroup}><FontAwesomeIcon icon={this.state.groups[g].expanded?faMinus:faPlus}/></button>
                                <button inputname={g} onClick={this.toggleGroupMute}><FontAwesomeIcon icon={this.state.groups[g].groupMuted?faVolumeMute:faVolumeHigh}/></button>
                            </div>
                        </div>
                    </div>
            )

            if(this.state.groups[g].expanded){
                
                groupElements.push(groupItemElements[g]);
            }
        }

        return <div className="deck-component deck-volume-control">
            {groupElements}
            {meterElements}
        </div>;
    }
}

const VolumeMeter = (rawLevel)=>{
    let scaleDim = window.innerWidth<600?"Y":"Y";
        let levels = {
            level:0
        }

        if(rawLevel.level){
            
            levels.level = rawLevel.level[1];
        }else{
            levels = {
                level:0
            }
        }

        let levelStyle = {
            level:{clipPath:`polygon(${scaleDim=="X"?(levels.level*100):100}% ${scaleDim=="Y"?(100-levels.level*100):0}%, 0% ${scaleDim=="Y"?(100-levels.level*100):0}%, 0% 100%, ${scaleDim=="X"?(levels.level*100):100}% 100%)`},
        }
        
        return <div className="deck-volume-meter-bar" >
                <div className="deck-volume-meter-bar-peak"></div>
                <div className="deck-volume-meter-bar-level" style={levelStyle.level}></div>
                <div className="deck-volume-meter-bar-power"></div>
            </div>;
}

export {VolumeControl};