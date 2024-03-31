import React from 'react';
import OSC from 'osc-js';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircle, faStream, faCog, faPause, faPlay} from '@fortawesome/free-solid-svg-icons';
import './OutputController.css';
import BoolSwitch from '../UI/BoolSwitch.js';

class OutputController extends React.Component{
    constructor(props){
        super(props);
        this.osc = props.osc;

        this.state = {
            isReady:false,
            oscSubIDs:null,
            streamStatus:{},
            recordStatus:{},
            openSettings:false,
            settings:{}
        };

        this.toggleStream = this.toggleStream.bind(this);
        this.toggleRecord = this.toggleRecord.bind(this);
        this.toggleRecordPause = this.toggleRecordPause.bind(this);
        this.recordStateChanged = this.recordStateChanged.bind(this);
        this.streamStateChanged = this.streamStateChanged.bind(this);
        this.getStatus = this.getStatus.bind(this);
        this.activateInterval = this.activateInterval.bind(this);
        this.openSettings = this.openSettings.bind(this);
        this.getSettings = this.getSettings.bind(this);
        this.saveSettings = this.saveSettings.bind(this);
        this.closeSettings = this.closeSettings.bind(this);
        this.onSettingChange = this.onSettingChange.bind(this);
    }

    statusInterval = null;

    componentDidMount(){
        this.getSettings();
        this.setState(Object.assign(this.state, {
            isReady:true,
            oscSubIDs:{
                Status: {address:"/obs/get/status",id:this.osc.on("/obs/get/status", this.getStatus)},
                RecordStateChange: {address:"/obs/event/RecordStateChanged",id:this.osc.on("/obs/event/RecordStateChanged", this.recordStateChanged)},
                StreamStateChange:{address:"/obs/event/StreamStateChanged",id:this.osc.on("/obs/event/StreamStateChanged", this.streamStateChanged)},
                IntervalActivate:{address:"/obs/event/InputVolumeMeters", id:this.osc.on("/obs/status/interval", this.activateInterval)},
            }
        }));
        
        this.osc.send(new OSC.Message("/obs/get/status", "stream|record"));
    }

    componentWillUnmount(){
        //return;
        for(let o in this.state.oscSubIDs){
            this.osc.off(this.state.oscSubIDs[o].address, this.state.oscSubIDs[o].id);
        }
        this.osc.send(new OSC.Message("/obs/status/interval", 0));
    }

    getSettings(){
        fetch("/obs/get_output_settings")
        .then(response => response.json())
        .then(data=>{
            let newSettings = Object.assign(this.state.settings, data);
            this.setState(Object.assign(this.state, {settings:newSettings}));
        })
    }

    saveSettings(){
        fetch("/obs/save_output_settings", {
            method:"POST",
            headers: {'Content-Type': 'application/json', 'Accept':'application/json'},
            body:JSON.stringify(Object.assign({}, this.state.settings))
        }).then(response => response.json())
        .then(data=>{
            this.setState(Object.assign(this.state, {openSettings:false}));
        })
    }

    activateInterval(){
        this.osc.send(new OSC.Message("/obs/status/interval", 1));
    }

    getStatus(data){
        
        let statusData = JSON.parse(data.args[0]);
        if((statusData.stream.outputActive == true || statusData.record.outputActive == true) && this.state.streamStatus.stream == null){
            this.osc.send(new OSC.Message("/obs/status/interval", 1));
        }
        this.setState(Object.assign(this.state, {streamStatus:statusData.stream, recordStatus:statusData.record}));
    }

    toggleStream(){
        this.osc.send(new OSC.Message("/obs/stream", "toggle"));
        if(this.state.streamStatus.outputActive == false){
            this.osc.send(new OSC.Message("/obs/status/interval", 1));
        }
    }

    toggleRecord(){
        this.osc.send(new OSC.Message("/obs/record", "toggle"));
        if(this.state.recordStatus.outputActive == false){
            this.osc.send(new OSC.Message("/obs/status/interval", 1));
        }
    }

    toggleRecordPause(){
        this.osc.send(new OSC.Message("/obs/record", this.state.recordStatus.outputPaused?"resume":"pause"));
    }

    streamStateChanged(data){
        let streamObj = JSON.parse(data.args[0]);
        let newStreamStatus = Object.assign(this.state.streamStatus);
        newStreamStatus.outputActive = streamObj.outputActive;
        
        this.setState(Object.assign(this.state, {streamStatus:newStreamStatus}));
    }

    recordStateChanged(data){
        let recordObj = JSON.parse(data.args[0]);
        let newRecordStatus = Object.assign(this.state.recordStatus);
        newRecordStatus.outputActive = recordObj.outputActive;
        
        this.setState(Object.assign(this.state, {recordStatus:newRecordStatus}));
    }

    convertBytes(bytes){
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

    openSettings(){
        this.setState(Object.assign(this.state, {openSettings:true}));
    }

    closeSettings(){
        this.getSettings();
        this.setState(Object.assign(this.state, {openSettings:false}));
    }

    onSettingChange(e){
        let newSettings = Object.assign({}, this.state.settings);
        newSettings[e.target.name] = e.target.checked;
        this.setState(Object.assign(this.state, {settings:newSettings}));
    }

    render(){

        let streamStatusEl = null;
        let recordStatusEl = null;

        if(this.state.streamStatus.outputActive != null){
            streamStatusEl = <div className="output-controller-stream-status">
                <h1>{this.state.streamStatus.outputTimecode}</h1>
                <h1>Skipped: {this.state.streamStatus.outputSkippedFrames} ({Math.floor((this.state.streamStatus.outputSkippedFrames/this.state.streamStatus.outputTotalFrames)*100)}%)</h1>
                <h1>Out Data: {this.convertBytes(this.state.streamStatus.outputBytes)}</h1>
            </div>
        }

        if(this.state.recordStatus.outputActive != null){
            recordStatusEl = <div className="output-controller-record-status">
                <h1>{this.state.recordStatus.outputTimecode}</h1>
                <h1>Out Data: {this.convertBytes(this.state.recordStatus.outputBytes)}</h1>
            </div>
        }

        let recordPauseButton =<div onClick={this.toggleRecordPause} className={"output-controller-button"}>
                                    <label>Pause</label>
                                    <FontAwesomeIcon icon={this.state.recordStatus.outputPaused?faPlay:faPause} size="2x"/>
                                </div>;
        let content = null;

        if(this.state.openSettings){
            content = <div className="deck-component deck-output-controller">
                <div className="output-settings-container">
                    <label>Set recording file to stream name (excludes special characters and takes the left side of |)
                        <BoolSwitch name="recordRename" checked={this.state.settings.recordRename} onChange={this.onSettingChange}/>
                    </label>
                    <label>Alert chat on consistant frame drops and recovery
                        <BoolSwitch name="frameDropAlert" checked={this.state.settings.frameDropAlert} onChange={this.onSettingChange}/>
                    </label>
                    <label>Alert chat on disconnection and recovery
                        <BoolSwitch name="disconnectAlert" checked={this.state.settings.disconnectAlert} onChange={this.onSettingChange}/>
                    </label>
                    <button className="save-button" onClick={this.saveSettings}>Save</button>
                    <button className="delete-button" onClick={this.closeSettings}>Cancel</button>
                </div>
            </div>
        }else{
            content = <div className="deck-component deck-output-controller">
                        <label className="deck-component-label">Output</label>
                        <div className="output-controller-buttons">
                            <div className="output-controller-stream">
                                <div onClick={this.toggleStream} className={"output-controller-button "+(this.state.streamStatus?.outputActive?"streaming ":"")+(this.state.streamStatus?.outputReconnecting?"reconnecting":"")}>
                                    <label>Stream</label>
                                    <FontAwesomeIcon icon={faStream} size="2x"/>
                                </div>
                                {streamStatusEl}
                            </div>
                            <div className="output-controller-record">
                                <div className="controller-record-buttons">
                                    <div onClick={this.toggleRecord} className={"output-controller-button "+(this.state.recordStatus?.outputActive?"recording ":"")+(this.state.recordStatus?.outputPaused?"paused":"")}>
                                        <label>Record</label>
                                        <FontAwesomeIcon icon={faCircle} size="2x"/>
                                    </div>
                                    {this.state.recordStatus.outputActive||this.state.recordStatus.outputPaused?recordPauseButton:null}
                                </div>
                                {recordStatusEl}
                            </div>
                            <div className="output-controller-settings">
                                
                                <div onClick={this.openSettings} className={"output-controller-button"}>
                                    <label>Settings</label>
                                    <FontAwesomeIcon icon={faCog} size="2x"/>
                                </div>
                            </div>
                        </div>
                        
                    </div>;
        }

        return content;
    }
}

export {OutputController};