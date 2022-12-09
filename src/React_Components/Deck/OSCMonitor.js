import React from 'react';
import OSC from 'osc-js';
import './OSCMonitor.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowDown} from '@fortawesome/free-solid-svg-icons';
import BoolSwitch from '../UI/BoolSwitch.js';

class OSCMonitor extends React.Component{
    constructor(props){
        super(props);
        this.osc = props.osc;
        this.state = {
            isReady:false,
            addressInput:"",
            activeFilters:["tcp", "udp", "send", "receive", "plugin"],
            addressFilters:[],
            logs:[],
            pluginlogs:[],
            variables:{},
            varMode:false,
            scrollLock:false
        }

        this.getAllLogs = this.getAllLogs.bind(this);
        this.getLog = this.getLog.bind(this);
        this.getPluginLog = this.getPluginLog.bind(this);
        this.setFilter = this.setFilter.bind(this);
        this.handleAddressInput = this.handleAddressInput.bind(this);
        this.setAddressFilter = this.setAddressFilter.bind(this);
        this.scrollToLock = this.scrollToLock.bind(this);
        this.switchModes = this.switchModes.bind(this);
    }

    componentDidMount(){
        
        this.setState(Object.assign(this.state, {
            isReady:true,
            oscSubIDs:{
                monitor: this.osc.on("/frontend/monitor/osc", this.getLog),
                pluginmonitor: this.osc.on("/frontend/monitor/plugin", this.getPluginLog),
                getAllLogs: this.osc.on("/frontend/monitor/get/all", this.getAllLogs)
            }
        }));
        
        this.osc.send(new OSC.Message("/frontend/monitor/logging", 1));
        this.osc.send(new OSC.Message("/frontend/monitor/get", "all"));
    }

    componentWillUnmount(){
        this.osc.off("/frontend/monitor/osc", this.state.oscSubIDs.monitor);
        this.osc.off("/frontend/monitor/plugin", this.state.oscSubIDs.pluginmonitor);
        this.osc.off("/frontend/monitor/get/all", this.state.oscSubIDs.getAllLogs);
        this.osc.send(new OSC.Message("/frontend/monitor/logging", 0));
    }

    componentDidUpdate(){
        if(this.state.scrollLock){
            this.scrollToBottom();
        }
    }

    getAllLogs(message){
        let logObj = JSON.parse(message.args[0]);
        this.setState(Object.assign(this.state, {logs:logObj.logs, pluginlogs:logObj.pluginlogs}));
    }

    getLog(message){
        let logObj = JSON.parse(message.args[0]);
        
        let newVars = Object.assign(this.state.variables);
        if(logObj.direction == "receive"){
            if(newVars[logObj.data.address] == null && !isNaN(logObj.data.data[0])){
            
                newVars[logObj.data.address] = {
                    min:logObj.data.data,
                    max:logObj.data.data,
                    value:logObj.data.data
                }
            }else if(newVars[logObj.data.address] != null && !isNaN(logObj.data.data[0])){
                newVars[logObj.data.address].value = logObj.data.data[0];
                if(logObj.data.data[0] < newVars[logObj.data.address].min){
                    newVars[logObj.data.address].min = logObj.data.data[0];
                }
                if(logObj.data.data[0] > newVars[logObj.data.address].max){
                    newVars[logObj.data.address].max = logObj.data.data[0];
                }
            }
        }
        
        let newLogs = Object.assign(this.state.logs);
        newLogs.push(logObj);
        if(newLogs.length >500){
            newLogs.shift();
        }
        this.setState(Object.assign(this.state, {logs:newLogs, variables:newVars}));
        
    }

    getPluginLog(message){
        let logObj = JSON.parse(message.args[0]);
        let newLogs = Object.assign(this.state.pluginlogs);
        newLogs.push(logObj);
        if(newLogs.length >500){
            newLogs.shift();
        }
        this.setState(Object.assign(this.state, {pluginlogs:newLogs}));
    }

    setFilter(filter){
        let newFilters = Object.assign(this.state.activeFilters);
        
        if(newFilters.includes(filter)){
            newFilters.splice(newFilters.indexOf(filter), 1);
        }else{
            newFilters.push(filter);
        }
        console.log(newFilters)
        this.setState(Object.assign(this.state, {activeFilters:newFilters}));
    }

    handleAddressInput(e){
        this.setState(Object.assign(this.state, {addressInput:e.currentTarget.value}));
    }

    setAddressFilter(e){
        let newAddresses = Object.assign(this.state.addressFilters);
        newAddresses.push(this.state.addressInput);
        this.setState(Object.assign(this.state, {addressFilters:newAddresses}));
    }

    removeAddressFilter(af){
        let newAddresses = Object.assign(this.state.addressFilters);
        newAddresses.splice(newAddresses.indexOf(af), 1)
        this.setState(Object.assign(this.state, {addressFilters:newAddresses}));
    }

    scrollToBottom(e){
        document.querySelector(".osc-monitor-logs").scrollTop = document.querySelector(".osc-monitor-logs").scrollHeight;
    }

    scrollToLock(e){
        if(e.currentTarget.scrollTop >= e.currentTarget.scrollHeight-e.currentTarget.getBoundingClientRect().height){
            this.setState(Object.assign(this.state, {scrollLock:true}));
        }else{
            this.setState(Object.assign(this.state, {scrollLock:false}));
        }
    }

    switchModes(e){
        this.setState(Object.assign(this.state, {varMode:e.currentTarget.checked}));
    }

    render(){

        if(this.state.varMode == false){
            let logList = [
            <div className="monitor-log top">
                <div className="monitor-log-protocol">Protocol</div>
                <div className="monitor-log-direction">Direction</div>
                <div className="monitor-log-types">Types</div>
                <div className="monitor-log-address">Address</div>
                <div className="monitor-log-data">Data</div>
            </div>
            ];

            let finalLogs = [];
            finalLogs = finalLogs.concat(this.state.logs, this.state.pluginlogs);
            finalLogs.sort((a,b)=>{
                return a.timestamp-b.timestamp;
            })

            for(let l in finalLogs){
                if(finalLogs[l].type == "osc"){
                    if(this.state.activeFilters.includes(finalLogs[l].protocol) &&
                        this.state.activeFilters.includes(finalLogs[l].direction)){
                        let aFilterPass = true;
                        if(this.state.addressFilters.length>0){
                            aFilterPass = false;
                            for(let af in this.state.addressFilters){
                                let thisFilter = this.state.addressFilters[af];
                                if(thisFilter.endsWith("/*")){
                                    if(finalLogs[l].data.address.startsWith(thisFilter.substring(0,thisFilter.length-2))){
                                        aFilterPass = true;
                                    }
                                }else if(thisFilter == finalLogs[l].data.address){
                                    aFilterPass = true;
                                }
                            }
                        }
                        if(aFilterPass){
                            logList.push(
                                <div className="monitor-log">
                                    <div className="monitor-log-protocol">{finalLogs[l].protocol}</div>
                                    <div className="monitor-log-direction">{finalLogs[l].direction}</div>
                                    <div className="monitor-log-types">{finalLogs[l].data.types}</div>
                                    <div className="monitor-log-address">{finalLogs[l].data.address}</div>
                                    <div className="monitor-log-data">{finalLogs[l].data.data}</div>
                                </div>
                            );
                        }
                    }
                }else if(finalLogs[l].type=="error" && this.state.activeFilters.includes("plugin")){
                    logList.push(
                        <div className="monitor-log">
                            <div className="monitor-log-protocol">Plugin</div>
                            <div className="monitor-log-direction"></div>
                            <div className="monitor-log-types">{finalLogs[l].type}</div>
                            <div className="monitor-log-address">{finalLogs[l].name}</div>
                            <div className="monitor-log-data">{finalLogs[l].message}</div>
                        </div>
                    );
                }
            }

            let addressFilterElements = [];

            for(let a in this.state.addressFilters){
                addressFilterElements.push(
                    <div className="filters-address-entry">
                        {this.state.addressFilters[a]}
                        <button onClick={()=>this.removeAddressFilter(this.state.addressFilters[a])}>X</button>
                    </div>
                );
            }

            let scrollDownButton = this.state.scrollLock==false?<button className={"monitor-filters-button scroll-to-bottom enabled"} onClick={()=>this.scrollToBottom()}><FontAwesomeIcon icon={faArrowDown} size="1x"/></button>:null;

            return <div className="deck-osc-monitor log">
                <div className="osc-monitor-filters">
                    <div className="osc-monitor-controls-1">
                        <div className="monitor-filters-buttons">
                            <button className={"monitor-filters-button "+(this.state.activeFilters.includes("tcp")?"enabled":"")} onClick={()=>this.setFilter("tcp")}>TCP</button>
                            <button className={"monitor-filters-button "+(this.state.activeFilters.includes("udp")?"enabled":"")} onClick={()=>this.setFilter("udp")}>UDP</button>
                            <button className={"monitor-filters-button "+(this.state.activeFilters.includes("send")?"enabled":"")} onClick={()=>this.setFilter("send")}>Send</button>
                            <button className={"monitor-filters-button "+(this.state.activeFilters.includes("receive")?"enabled":"")} onClick={()=>this.setFilter("receive")}>Receive</button>
                            <button className={"monitor-filters-button "+(this.state.activeFilters.includes("plugin")?"enabled":"")} onClick={()=>this.setFilter("plugin")}>Plugin</button>
                        </div>
                        <div className="monitor-variables-switch">
                            Variables:
                            <BoolSwitch checked={this.state.varMode} onChange={this.switchModes}/>
                        </div>
                    </div>
                    
                    <div className="osc-monitor-controls-2">
                        <div className={"monitor-filters-address-input"}>
                            Address Filter
                            <input name="address" type="text" onInput={this.handleAddressInput} placeholder="/something/somethinginside" defaultValue={this.state.addressInput}/>
                            <button className="monitor-filters-button-address" onClick={()=>this.setAddressFilter()}>Add</button>
                        </div>
                        <div className="monitor-filters-address">
                            {addressFilterElements}
                        </div>
                    </div>
                </div>
                {scrollDownButton}
                <div className="osc-monitor-logs" onScroll={this.scrollToLock}>
                    {logList}
                </div>
            </div>;
        }else{

            let varDivs = [];
            for(let v in this.state.variables){
                let percentage = Math.floor((Math.abs(this.state.variables[v].min)
                    +this.state.variables[v].value)
                    /(Math.abs(this.state.variables[v].min)
                    +Math.abs(this.state.variables[v].max))*100)+"%";

                varDivs.push(
                    <div className="osc-monitor-variable" key={v+this.state.variables[v].value} style={{background:"linear-gradient(90deg, rgb(0,128,0) "+percentage+", rgb(0,70,0) "+percentage}} >
                        <label>{v}</label>
                        <div className="monitor-variable-numbers">
                            <div className="monitor-variable-numbers-content">
                                {this.state.variables[v].min}
                            </div>
                            <div className="monitor-variable-numbers-content">
                                {this.state.variables[v].value}
                            </div>
                            <div className="monitor-variable-numbers-content">
                                {this.state.variables[v].max}
                            </div>
                        </div>
                    </div>
                );
            }
            if(varDivs.length == 0){
                varDivs = [<label>Send OSC to display variables</label>];
            }
            return <div className="deck-osc-monitor variable">
                    <div className="osc-monitor-filters">
                        <div className="osc-monitor-controls-1">
                            <div className="monitor-filters-buttons">
                                <button className={"monitor-filters-button "+(this.state.activeFilters.includes("tcp")?"enabled":"")} onClick={()=>this.setFilter("tcp")}>TCP</button>
                                <button className={"monitor-filters-button "+(this.state.activeFilters.includes("udp")?"enabled":"")} onClick={()=>this.setFilter("udp")}>UDP</button>
                                <button className={"monitor-filters-button "+(this.state.activeFilters.includes("send")?"enabled":"")} onClick={()=>this.setFilter("send")}>Send</button>
                                <button className={"monitor-filters-button "+(this.state.activeFilters.includes("receive")?"enabled":"")} onClick={()=>this.setFilter("receive")}>Receive</button>
                            </div>
                            <div className="monitor-variables-switch">
                                Variables:
                                <BoolSwitch checked={this.state.varMode} onChange={this.switchModes}/>
                            </div>
                        </div>
                    </div>
                    <div className="osc-monitor-variables">
                        {varDivs}
                    </div>
            </div>;
        }
    }
}

export {OSCMonitor}