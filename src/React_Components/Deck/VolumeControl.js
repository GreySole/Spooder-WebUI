import React from 'react';
import OSC from 'osc-js';
import './VolumeControl.css';
import {VolumeMeter} from './VolumeMeter.js';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faVolumeMute, faVolumeHigh, faEye, faEyeSlash} from '@fortawesome/free-solid-svg-icons';

class VolumeControl extends React.Component{
    constructor(props){
        super(props);
        this.osc = props.osc;

        

        this.state = {
            inputs:{},
            meters:{},
            groups:{},
            isReady:false,
            oscSubIDs: {}
        }
        this.receiveMeter = this.receiveMeter.bind(this);
        this.getVolumes = this.getVolumes.bind(this);
        this.getVolume = this.getVolume.bind(this);
        this.setVolume = this.setVolume.bind(this);
        this.toggleMute = this.toggleMute.bind(this);
    }

    componentDidMount(){
        
        this.setState(Object.assign(this.state, {
            isReady:true,
            oscSubIDs:{
                InputVolumeMeters:this.osc.on("/obs/sound/InputVolumeMeters", this.receiveMeter),
                GetInputList: this.osc.on("/obs/get/input/volumelist", this.getVolumes),
                GetVolumes: this.osc.on("/obs/get/input/volume", this.getVolume),
                GetInputMute: this.osc.on("/obs/get/input/mute", this.getMute),
            }
        }));
        this.osc.send(new OSC.Message("/obs/event/InputVolumeMeters", 1));
        this.osc.send(new OSC.Message("/obs/get/input/volumelist"));
    }

    componentWillUnmount(){
        //return;
        this.osc.off("/obs/sound/InputVolumeMeters", this.state.oscSubIDs.InputVolumeMeters);
        this.osc.off("/obs/get/input/volumelist", this.state.oscSubIDs.GetInputList);
        this.osc.off("/obs/get/input/volume", this.state.oscSubIDs.GetVolumes);
        this.osc.send(new OSC.Message("/obs/event/InputVolumeMeters", 0));
    }

    getVolumes(data){
        let inputs = JSON.parse(data.args[0]);
        let newVolumes = Object.assign(this.state.inputs);
        for(let i in inputs){
            newVolumes[i] = inputs[i].volumeData.inputVolumeMul;
            newVolumes[i] = {
                volume: inputs[i].volumeData.inputVolumeMul,
                muted: inputs[i].volumeMuteData.inputMuted,
            }
        }
        this.setState(Object.assign(this.state, {inputs:newVolumes}));
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
        newInputs[muteObj.inputName] = muteObj.inputMuted;
        this.setState(Object.assign(this.state, {inputs:newInputs}));
    }

    setVolume(e){
        let inputName = e.currentTarget.getAttribute("inputname");
        let value = e.currentTarget.value;
        //Math.pow(this.state.volumes[inputName],0.1)
        this.osc.send(new OSC.Message("/obs/set/input/volume", JSON.stringify({inputName:inputName, value:parseFloat(value)**2})));
    }

    receiveMeter(data){
        let recMeters = JSON.parse(data.args[0]);
        //console.log(recMeters);
        if(this.state.isReady == true){
            //console.log("Setting meter")
            this.setState(Object.assign(this.state, {meters:recMeters}));
        }
        
    }

    truncate(str, n){
        return (str.length > n) ? str.substr(0, n-1) + '...' : str;
    }

    toggleMute(e){
        let inputName = e.currentTarget.getAttribute("inputname");
        console.log(inputName);
        let inputMuted = !this.state.inputs[inputName].muted;
        let newInputs = Object.assign(this.state.inputs);
        this.osc.send(new OSC.Message("/obs/set/input/mute", JSON.stringify({inputName:inputName, inputMuted:inputMuted})));
        newInputs[inputName].muted = inputMuted;
        this.setState(Object.assign(this.state, {inputs:newInputs}));
    }

    render(){

        let meterElements = [];
        
        if(Object.keys(this.state.inputs).length == 0){
            return <div className="deck-component deck-volume-control"></div>;
        }
        for(let m in this.state.meters.inputs){
            let inputName = this.state.meters.inputs[m].inputName;
                meterElements.push(
                    <div className="deck-volume-meter" >
                        <div className="deck-volume-meter-label">
                            {this.truncate(this.state.meters.inputs[m].inputName, 16)}
                        </div>
                        <div className="deck-volume-meter-ui">
                            <div className="deck-volume-meter-bars" key={inputName+"-"+this.state.meters.inputs[m].inputLevelsMul.join(",")}>
                                <VolumeMeter lr="l" level={this.state.meters.inputs[m].inputLevelsMul} />
                                <VolumeMeter lr="r" level={this.state.meters.inputs[m].inputLevelsMul} />
                                
                            </div>
                            <div className="deck-volume-control-slider">
                                <input key={inputName+"- Volume - "+Object.keys(this.state.inputs).length} inputname={inputName} onChange={this.setVolume} orient={window.innerWidth<600?"horizontal":"vertical"} type="range" min={0} max={1} step={0.01} defaultValue={this.state.inputs[inputName].volume!=null?Math.sqrt(this.state.inputs[inputName].volume):0}/>
                            </div>
                            <div className="deck-source-buttons">
                                <button inputname={inputName} onClick={this.toggleMute}><FontAwesomeIcon icon={this.state.inputs[inputName].muted?faVolumeMute:faVolumeHigh}/></button>
                            </div>
                        </div>
                    </div>
                )
        }

        return <div className="deck-component deck-volume-control">
            {meterElements}
        </div>;
    }
}

export {VolumeControl};