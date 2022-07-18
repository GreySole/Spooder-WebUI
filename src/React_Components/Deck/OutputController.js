import React from 'react';
import OSC from 'osc-js';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCircle, faStream, faSignal, faPause, faPlay} from '@fortawesome/free-solid-svg-icons';
import './OutputController.css';

class OutputController extends React.Component{
    constructor(props){
        super(props);
        this.osc = props.osc;

        this.state = {
            isReady:false,
            oscSubIDs:null,
            streamStatus:{},
            recordStatus:{}
        };

        this.toggleStream = this.toggleStream.bind(this);
        this.toggleRecord = this.toggleRecord.bind(this);
        this.toggleRecordPause = this.toggleRecordPause.bind(this);
        this.recordStateChanged = this.recordStateChanged.bind(this);
        this.streamStateChanged = this.streamStateChanged.bind(this);
        this.getStatus = this.getStatus.bind(this);
    }

    statusInterval = null;

    componentDidMount(){
        
        this.setState(Object.assign(this.state, {
            isReady:true,
            oscSubIDs:{
                Status: this.osc.on("/obs/get/status", this.getStatus),
                RecordStateChange: this.osc.on("/obs/event/RecordStateChanged", this.recordStateChanged),
                StreamStateChange:this.osc.on("/obs/event/StreamStateChanged", this.streamStateChanged)
            }
        }));
        
        this.osc.send(new OSC.Message("/obs/get/status", "stream|record"));
    }

    componentWillUnmount(){
        //return;
        this.osc.off("/obs/get/status", this.state.oscSubIDs.Status);
        this.osc.off("/obs/event/RecordStateChanged", this.state.oscSubIDs.RecordStateChange);
        this.osc.off("/obs/event/StreamStateChanged", this.state.oscSubIDs.StreamStateChange);
        this.osc.send(new OSC.Message("/obs/status/interval", 0));
    }

    getStatus(data){
        
        let statusData = JSON.parse(data.args[0]);
        console.log("GOT STATUS DATA", statusData);
        this.setState(Object.assign(this.state, {streamStatus:statusData.stream, recordStatus:statusData.record}));
        if(statusData.stream.outputActive == true || statusData.record.outputActive == true){
            this.osc.send(new OSC.Message("/obs/status/interval", 1));
        }
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
        console.log(recordObj)
        newRecordStatus.outputActive = recordObj.outputActive;
        
        this.setState(Object.assign(this.state, {recordStatus:newRecordStatus}));
    }

    convertBytes(bytes){
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Byte';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
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
        <FontAwesomeIcon icon={this.state.recordStatus.outputPaused?faPlay:faPause} size="2x"/>
    </div>;

        return <div className="deck-component deck-output-controller">
            <div className="output-controller-stream">
                <div onClick={this.toggleStream} className={"output-controller-button "+(this.state.streamStatus?.outputActive?"streaming ":"")+(this.state.streamStatus?.outputReconnecting?"reconnecting":"")}>
                    <FontAwesomeIcon icon={faStream} size="2x"/>
                </div>
                {streamStatusEl}
            </div>
            <div className="output-controller-record">
                <div onClick={this.toggleRecord} className={"output-controller-button "+(this.state.recordStatus?.outputActive?"recording ":"")+(this.state.recordStatus?.outputPaused?"paused":"")}>
                    <FontAwesomeIcon icon={faCircle} size="2x"/>
                </div>
                {this.state.recordStatus.outputActive||this.state.recordStatus.outputPaused?recordPauseButton:null}
                {recordStatusEl}
            </div>
        </div>
    }
}

export {OutputController};