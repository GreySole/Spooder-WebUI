import React from 'react';
import OSC from 'osc-js';
import './OSCMonitor.css';

class OSCMonitor extends React.Component{
    constructor(props){
        super(props);
        this.osc = props.osc;
        this.state = {
            isReady:false,
            addressInput:"",
            activeFilters:["tcp", "udp", "send", "receive"],
            addressFilters:[],
            logs:[]
        }

        this.getAllLogs = this.getAllLogs.bind(this);
        this.getLog = this.getLog.bind(this);
        this.setFilter = this.setFilter.bind(this);
        this.handleAddressInput = this.handleAddressInput.bind(this);
        this.setAddressFilter = this.setAddressFilter.bind(this);
    }

    componentDidMount(){
        
        this.setState(Object.assign(this.state, {
            isReady:true,
            oscSubIDs:{
                monitor: this.osc.on("/frontend/monitor", this.getLog),
                getAllLogs: this.osc.on("/frontend/monitor/get/all", this.getAllLogs)
            }
        }));
        
        this.osc.send(new OSC.Message("/frontend/monitor/logging", 1));
        this.osc.send(new OSC.Message("/frontend/monitor/get", "all"));
    }

    componentWillUnmount(){
        this.osc.off("/frontend/monitor", this.state.oscSubIDs.monitor);
        this.osc.off("/frontend/monitor/get/all", this.state.oscSubIDs.getAllLogs);
        this.osc.send(new OSC.Message("/frontend/monitor/logging", 0));
    }

    getAllLogs(message){
        let logObj = JSON.parse(message.args[0]);
        this.setState(Object.assign(this.state, {logs:logObj.logs}));
    }

    getLog(message){
        let logObj = JSON.parse(message.args[0]);
        let newLogs = Object.assign(this.state.logs);
        newLogs.push(logObj);
        this.setState(Object.assign(this.state, {logs:newLogs}));
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

    render(){

        let logList = [
        <div className="monitor-log top">
            <div className="monitor-log-protocol">Protocol</div>
            <div className="monitor-log-direction">Direction</div>
            <div className="monitor-log-types">Types</div>
            <div className="monitor-log-address">Address</div>
            <div className="monitor-log-data">Data</div>
        </div>
        ];

        for(let l in this.state.logs){
            if(this.state.activeFilters.includes(this.state.logs[l].protocol) &&
                this.state.activeFilters.includes(this.state.logs[l].direction)){
                let aFilterPass = true;
                if(this.state.addressFilters.length>0){
                    aFilterPass = false;
                    for(let af in this.state.addressFilters){
                        let thisFilter = this.state.addressFilters[af];
                        if(thisFilter.endsWith("/*")){
                            if(this.state.logs[l].data.address.startsWith(thisFilter.substring(0,thisFilter.length-2))){
                                aFilterPass = true;
                            }
                        }else if(thisFilter == this.state.logs[l].data.address){
                            aFilterPass = true;
                        }
                    }
                }
                if(aFilterPass){
                    logList.push(
                        <div className="monitor-log">
                            <div className="monitor-log-protocol">{this.state.logs[l].protocol}</div>
                            <div className="monitor-log-direction">{this.state.logs[l].direction}</div>
                            <div className="monitor-log-types">{this.state.logs[l].data.types}</div>
                            <div className="monitor-log-address">{this.state.logs[l].data.address}</div>
                            <div className="monitor-log-data">{this.state.logs[l].data.data}</div>
                        </div>
                    );
                }
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

        return <div className="deck-osc-monitor">
            <div className="osc-monitor-filters">
                <div className="monitor-filters-buttons">
                    <button className={"monitor-filters-button "+(this.state.activeFilters.includes("tcp")?"enabled":"")} onClick={()=>this.setFilter("tcp")}>TCP</button>
                    <button className={"monitor-filters-button "+(this.state.activeFilters.includes("udp")?"enabled":"")} onClick={()=>this.setFilter("udp")}>UDP</button>
                    <button className={"monitor-filters-button "+(this.state.activeFilters.includes("send")?"enabled":"")} onClick={()=>this.setFilter("send")}>Send</button>
                    <button className={"monitor-filters-button "+(this.state.activeFilters.includes("receive")?"enabled":"")} onClick={()=>this.setFilter("receive")}>Receive</button>
                </div>
                <div className={"monitor-filters-address-input"}>
                    Address Filter
                    <input name="address" type="text" onInput={this.handleAddressInput} placeholder="/something/somethinginside" defaultValue={this.state.addressInput}/>
                    <button className="monitor-filters-button-address" onClick={()=>this.setAddressFilter()}>Add</button>
                </div>
                <div className="monitor-filters-address">
                    {addressFilterElements}
                </div>
            </div>
            <div className="osc-monitor-logs">
                {logList}
            </div>
        </div>
    }
}

export {OSCMonitor}