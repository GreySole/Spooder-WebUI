
import React from 'react';
import {Monitor} from './Tabs/Monitor.js';
import {EventTable} from './Tabs/EventTable.js';
import {ConfigTab} from './Tabs/ConfigTab.js';
import {PluginTab} from './Tabs/PluginTab.js';
import {OSCTunnelTab} from './Tabs/OSCTunnelTab.js';
import {EventSubTab} from './Tabs/EventSubTab.js';
import {ThemeTab} from './Tabs/ThemeTab.js';
import OSC from 'osc-js';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

var username = "NOT LOGGED IN";

var hostIP = window.location.hostname;
var udpClients = {};
var plugins = [];
var hostPort = 3001;
var clientID = null;
var osc = null;

if(urlParams.get("host") != null){
	hostIP = urlParams.get("host");
}

window.sendOSC = (address, value) => {
	if(osc != null){
		osc.send(new OSC.Message(address, value));
	}
};

class App extends React.Component {

	constructor(props){
		super(props);
		console.log("APP CONSTRUCTING");
		this.state = {
			tab:"monitor",
			tabData:null
		};
		this.getServerState()
		.then((data)=>{
			console.log(data);
			let serverData = data;
			hostPort = serverData.host.port;
			clientID = serverData.clientID;
			udpClients = serverData.osc["udp_clients"];
			plugins = serverData.osc["plugins"];
			console.log(serverData, udpClients);
			osc = new OSC({plugin: new OSC.WebsocketClientPlugin({host:serverData.osc.host,port:serverData.osc.port,secure:false})});
			this.initOSC();
			this.setState(Object.assign(this.state, {"host":hostPort}));
		})
		.catch(err => console.log(err))
	}
	
	commandRef = React.createRef();
	configRef = React.createRef();
	monitorRef = React.createRef();
	pluginRef = React.createRef();
	oscTunnelRef = React.createRef();
	eventSubRef = React.createRef();
	
	selectTab = this.selectTab.bind(this);
	setTabContent = this.setTabContent.bind(this);

	componentDidMount(){
		this.setTabContent();
	}
	
	initOSC(){
		console.log("OPENING OSC");
		osc.open();
		osc.on("open", () =>{
			console.log("OSC OPEN");
			osc.send(new OSC.Message('/frontend/connect', 1.0));
		});
		osc.on('*', (message)=>{
			if(message.address.startsWith("/frontend")){
				console.log("I HEARD SOMETHING", message);
				if(this.state.tab == "monitor"){
					if(this.monitorRef.current != null){
						this.monitorRef.current.addMonitorLog(message);
					}
					
				}
			}
		});
	}
	
	getServerState = async () => {
		const response = await fetch("/server_state");
		const serverStateRaw = await response.json();
		if(serverStateRaw.user != null &&
			serverStateRaw.user != ""){
				username = serverStateRaw.user;
			}
		
		hostPort = serverStateRaw.host.port;
		clientID = serverStateRaw.clientID;
		return serverStateRaw;
	}

	applyStyle = (theme) => {
		for(let t in theme){
			document.documentElement.style.setProperty(t, theme[t]);
		}
	}
	
	selectTab(e){
		console.log("TAB SELECT", e.target);
		document.querySelector(".tab-button.selected").classList.remove("selected");
		e.target.classList.add("selected");
		this.setTabContent();
	}
	
	setTabContent(){
		console.log("SET TAB CONTENT");
		let tab = document.querySelector(".tab-button.selected").name;
		this.setState(Object.assign(this.state, {"tab":tab, "tabData":null}));
		switch(this.state.tab){
			case "monitor":
				this.loadMonitor();
			break;
			case "commands":
				this.loadCommandData();
			break;
			case "config":
				this.loadConfigData();
			break;
			case "plugins":
				this.loadPlugins();
			break;
			case "osctunnels":
				this.loadOSCTunnelData();
			break;
			case "eventsub":
				this.loadEventSubData();
			break;
			case 'theme':
				this.loadThemeData();
			break;
		}
	}
	
	loadMonitor = () => {
		this.setState(Object.assign(this.state, {
			tabData:{}
		}));
		return <Monitor ref={this.monitorRef}/>;
	}
	
	loadPlugins = async () => {
		const response = await fetch("/plugins");
		const pluginDataRaw = await response.json();
		//const pluginData = JSON.parse(pluginDataRaw);
		console.log("I GOT PLUGINS! ",pluginDataRaw);

		if(response.status !== 200){
			throw Error("Error: "+response.status);
		}
		this.setState(Object.assign(this.state, {
			tabData:{
				pluginData:pluginDataRaw,
				_udpClients:udpClients
			}
		}));
	}
	
	loadConfigData = async () => {
		const response = await fetch("/server_config");
		const configDataRaw = await response.json();
		const configData = JSON.parse(configDataRaw.express);
		
		console.log("I GOT CONFIG! ",configData);
		
		var body = configData;

		if(response.status !== 200){
			throw Error(body.message);
		}
		this.setState(Object.assign(this.state, {
			tabData:{
				configData:configData
			}
		}));
	}
	
	loadConfigData = this.loadConfigData.bind(this);
	
	
	loadCommandData = async () => {
		const response = await fetch("/command_table");
		const commandDataRaw = await response.json();
		const commandData = JSON.parse(commandDataRaw.express);
		
		var body = commandData;

		if(response.status !== 200){
			throw Error(body.message);
		}

		this.setState(Object.assign(this.state, {
			tabData:{
				commandData:commandData,
				udpClients:udpClients,
				plugins:plugins
			}
		}));
	}
	
	loadCommandData = this.loadCommandData.bind(this);

	loadOSCTunnelData = async () => {
		const response = await fetch("/osc_tunnels");
		const tunnelData = await response.json();
		if(response.status !== 200){
			throw Error(tunnelData);
		}
		
		this.setState(Object.assign(this.state, {
			tabData:{
				tunnelData:tunnelData,
				udpClients:udpClients
			}
		}));
	}

	loadEventSubData = async () => {
		const response = await fetch("/eventsubs");
		const eventData = await response.json();
		
		if(response.status !== 200){
			throw Error(eventData);
		}
		
		this.setState(Object.assign(this.state, {
			tabData:{
				eventData:eventData,
				udpClients:udpClients,
				plugins:plugins
			}
		}));
	}

	loadThemeData = async() => {
		this.setState(Object.assign(this.state, {
			tabData:{
				data:{}
			}
		}));
	}
	
	render(){

		let tabContent = null;

		if(this.state.tabData){
			let tabData = this.state.tabData;
			switch(this.state.tab){
				case "monitor":
					tabContent = <Monitor ref={this.monitorRef}/>;
				break;
				case "commands":
					tabContent = <EventTable ref={this.commandRef} data={tabData.commandData.events} groups={tabData.commandData.groups} _udpClients={tabData.udpClients} _plugins={tabData.plugins} />;
				break;
				case "config":
					tabContent = <ConfigTab ref={this.configRef} data={tabData.configData} />;
				break;
				case "plugins":
					tabContent = <PluginTab ref={this.pluginRef} data={tabData.pluginData} _udpClients={tabData.udpClients} />;
				break;
				case "osctunnels":
					tabContent = <OSCTunnelTab ref={this.oscTunnelRef} data={tabData.tunnelData} _udpClients={tabData.udpClients} />;
				break;
				case "eventsub":
					tabContent = <EventSubTab ref={this.eventSubRef} data={tabData.eventData} _udpClients={tabData.udpClients} _plugins={tabData.plugins} />;
				break;
				/*case "theme":
					tabContent = <ThemeTab data={tabData.data} />;
				break;*/
			}
		}
		
		return(
			<div className="App">
				<div className="App-header">
					<div className="top-header">
						<h1 className="App-title">/╲/\( ºo ω oº )/\╱\</h1>
						<div className="login">
							<div className="account-info">{username}</div>
							<div className="login-buttons">
								<a href={"https://id.twitch.tv/oauth2/authorize?client_id="+clientID+"&redirect_uri=http://localhost:"+hostPort+"/handle&response_type=code&scope=chat:read chat:edit channel:read:goals bits:read channel:read:subscriptions moderation:read channel:read:redemptions channel:read:polls channel:read:predictions channel:read:hype_train"}>Authorize</a>
								<a href={"/revoke"}>Revoke</a>
							</div>
						</div>
					</div>
					<div className="navigation-tabs">
						<button type="button" name="monitor" className="tab-button selected" onClick={this.selectTab}>Deck</button>
						<button type="button" name="commands" className="tab-button" onClick={this.selectTab}>Events</button>
						<button type="button" name="plugins" className="tab-button" onClick={this.selectTab}>Plugins</button>
						<button type="button" name="osctunnels" className="tab-button" onClick={this.selectTab}>OSC Tunnels</button>
						<button type="button" name="eventsub" className="tab-button" onClick={this.selectTab}>EventSub</button>
						<button type="button" name="config" className="tab-button" onClick={this.selectTab}>Config</button>
					</div>
				</div>
				<div className="App-content">
					<div id="tabContent">
						{tabContent}
					</div>
				</div>
			</div>
		);
	}
}
export default App;
