import React from 'react';
import {EventTable} from './Tabs/EventTable.js';
import {ConfigTab} from './Tabs/ConfigTab.js';
import {PluginTab} from './Tabs/PluginTab.js';
import {OSCTunnelTab} from './Tabs/OSCTunnelTab.js';
import {EventSubTab} from './Tabs/EventSubTab.js';
import {ThemeTab} from './Tabs/ThemeTab.js';
import OSC from 'osc-js';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBars, faArrowRight} from '@fortawesome/free-solid-svg-icons';

import {VolumeControl} from './Deck/VolumeControl.js';
import { OutputController } from './Deck/OutputController.js';
import {SceneController} from './Deck/SceneController.js';
import {SourceControl} from './Deck/SourceControl.js';
import {OSCMonitor} from './Deck/OSCMonitor.js';

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
		let defaultTabs = localStorage.getItem("defaulttabs");
		let customSetupTab = localStorage.getItem("customsetuptab");
		let customDeckTab = localStorage.getItem("customdecktab");
		let defaultMode = localStorage.getItem("defaultmode");
		if(defaultTabs == null){
			defaultTabs = "nodefault";
			customSetupTab = "commands";
			customDeckTab = "osc";
		}else if(defaultTabs != "nodefault"){
			if(customSetupTab == null){customSetupTab = "commands"}
			if(customDeckTab == null){customDeckTab = "osc"}
		}
		if(defaultMode == null){
			defaultMode = "setup";
		}
		this.state = {
			tab:customSetupTab,
			tabData:null,
			decktab:customDeckTab,
			navOpen:false,
			mode:defaultMode,
			tabOptions:{"commands":"Events", "plugins":"Plugins", "osctunnels":"OSC Tunnels", "eventsub":"EventSub", "config":"Config"},
			deckTabOptions:{"obs":"OBS Remote", "osc":"OSC Monitor", "mod":"Mod UI"},
			oscConnected: false,
			obsConnected: 0,
			isExternal:window.location.protocol!="http:",
			obsLoginInfo:{},
			customSpooder:{
				mouth:"ω",
				bigEyeLeft:"o",
				littleEyeLeft:"º",
				bigEyeRight:"o",
				littleEyeRight:"º",
				color:"cyan"
			}
			/*spooderAnimationInterval:setInterval(()=>{
				document.querySelector(".App-title").innerText = String.raw`/╲/\( º - ω - º )/\╱\
					`;
				setTimeout(()=>{
					document.querySelector(".App-title").innerText = String.raw`/╲/\( ºo ω oº )/\╱\
					`;
				}, 150)
			},5000)*/
		};
		
	}
	
	commandRef = React.createRef();
	configRef = React.createRef();
	pluginRef = React.createRef();
	oscTunnelRef = React.createRef();
	eventSubRef = React.createRef();
	
	selectTab = this.selectTab.bind(this);
	setTabContent = this.setTabContent.bind(this);
	navigationClick = this.navigationClick.bind(this);
	deckToggle = this.deckToggle.bind(this);
	handleObsInput = this.handleObsInput.bind(this);
	connectOBS = this.connectOBS.bind(this);

	componentDidMount(){
		this.getServerState()
		.then((data)=>{
			let serverData = data;
			hostPort = serverData.host.port;
			clientID = serverData.clientID;
			udpClients = serverData.osc["udp_clients"];
			plugins = serverData.osc["plugins"];
			if(osc == null){
				osc = new OSC({plugin: new OSC.WebsocketClientPlugin({host:serverData.osc.host,port:serverData.osc.port,secure:false})});
				this.initOSC();
			}
			this.setState(Object.assign(this.state, {"host":hostPort}));
			if(this.state.mode == "setup"){
				this.setTabContent(this.state.tab);
			}else if(this.state.mode == "deck"){
				this.setTabContent(this.state.decktab);
			}
			
		})
		.catch(err => console.log(err))
		
	}

	/*componentWillUnmount(){
		clearInterval(this.state.spooderAnimationInterval);
	}*/
	
	initOSC(){
		console.log("OPENING OSC");
		
		osc.on("open", () =>{
			console.log("OSC OPEN", osc.status());
			osc.send(new OSC.Message('/frontend/connect', 1.0));
		});
		osc.on('/frontend/*', (message)=>{
			//console.log("I HEARD SOMETHING", message);
			if(message.address == "/frontend/connect/success"){
				this.setState(Object.assign(this.state, {"oscConnected":true}));
				osc.send(new OSC.Message('/obs/get/obslogininfo', 1.0));
			}
			
		});
		osc.on('/obs/status/connection', (message) => {
			this.setState(Object.assign(this.state, {"obsConnected":message.args[0]}));
		});
		osc.on('/obs/get/obslogininfo', (message) => {
			let obsLoginInfo = JSON.parse(message.args[0]);
			this.setState(Object.assign(this.state, {"obsLoginInfo":obsLoginInfo}));
		})
		osc.open();
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
	
	selectTab(tab){
		this.setTabContent(tab);
	}
	
	setTabContent(tab){
		if(this.state.mode == "setup"){
			switch(tab){
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
		}else if(this.state.mode == "deck"){
			this.setState(Object.assign(this.state, {
				decktab:tab,
				navOpen:false
			}));
		}

		if(localStorage.getItem("defaulttabs") == "rememberlast"){
			localStorage.setItem("defaultmode", this.state.mode);
			if(this.state.mode == "setup"){
				localStorage.setItem("customsetuptab", tab);
			}else{
				localStorage.setItem("customdecktab", tab);
			}
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

		if(response.status !== 200){
			throw Error("Error: "+response.status);
		}
		this.setState(Object.assign(this.state, {
			tabData:{
				pluginData:pluginDataRaw,
				udpClients:udpClients
			},
			"tab":"plugins", "navOpen":false
		}));
	}
	
	loadConfigData = async () => {
		const response = await fetch("/server_config");
		const configDataRaw = await response.json();
		const configData = JSON.parse(configDataRaw.express);
		
		var body = configData;

		if(response.status !== 200){
			throw Error(body.message);
		}
		this.setState(Object.assign(this.state, {
			tabData:{
				configData:configData
			},
			"tab":"config", "navOpen":false
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
			},
			"tab":"commands", "navOpen":false
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
			},
			"tab":"osctunnels", "navOpen":false
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
			},
			"tab":"eventsub", "navOpen":false
		}));
	}

	loadThemeData = async() => {
		this.setState(Object.assign(this.state, {
			tabData:{
				data:{}
			},
			"tab":"theme", "navOpen":false
		}));
	}

	navigationClick(e){
		this.setState(Object.assign(this.state, {navOpen:!this.state.navOpen}));
	}

	deckToggle(e){
		this.setState(Object.assign(this.state, {
			navOpen:!this.state.navOpen,
			mode:this.state.mode=="deck"?"setup":"deck"
		}));
		this.selectTab(this.state.mode=="setup"?this.state.tab:this.state.decktab);
	}

	handleObsInput(e){
		let newLoginInfo = Object.assign(this.state.obsLoginInfo);
		if(e.target.type == "checkbox"){
			newLoginInfo[e.target.name] = e.target.checked;
		}else{
			newLoginInfo[e.target.name] = e.target.value;
		}
		
		this.setState(Object.assign(this.state, {obsLoginInfo:newLoginInfo}));
	}

	connectOBS(){
		
		let rememberLogin = this.state.obsLoginInfo.remember != null? this.state.obsLoginInfo.remember:false;
		osc.send(new OSC.Message("/obs/connectSocket", JSON.stringify({
			url:this.state.obsLoginInfo.url,
			port: this.state.obsLoginInfo.port,
			password: this.state.obsLoginInfo.password,
			remember:rememberLogin
		})));
	}

	async connectChatChannel(e){
		let channel = document.querySelector(".chat-actions input[name=channel]").value;

		const response = await fetch("/chat_channel?channel="+channel).then(response => response.json());
		//console.log(response);
		if(response.status == "SUCCESS"){
			e.target.innerText = "Done!";
			setTimeout(()=>{
				e.target.innerText = "Connect";
			}, 3000);
		}
	}

	async restartChat(e){
		const response = await fetch("/chat_restart").then(response => response.json());
		if(response.status == "SUCCESS"){
			e.target.innerText = "Done!";
			setTimeout(()=>{
				e.target.innerText = "Restart Chat";
			}, 3000);
		}
		//console.log(response);
	}
	
	render(){

		if(this.state.isExternal){
			return <div className="App">
				<div className="locals-only">
					<h1 className="App-title">/╲/\( ºx ω xº )/\╱\</h1>
					<h1>Sorry, locals only</h1>
				</div>
			</div>
		}

		let tabContent = null;

		if(this.state.tabData){
			let tabData = this.state.tabData;
			switch(this.state.tab){
				case "commands":
					tabContent = <EventTable ref={this.commandRef} data={tabData.commandData.events} groups={tabData.commandData.groups} _udpClients={tabData.udpClients} _plugins={tabData.plugins} />;
				break;
				case "config":
					tabContent = <ConfigTab ref={this.configRef} _taboptions={{setup:this.state.tabOptions,deck:this.state.deckTabOptions}} data={tabData.configData} />;
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

		let appContent = null;
		let navigationTabs = null;

		if(this.state.mode == "setup"){
			let tabButtons = [];
			for(let t in this.state.tabOptions){
				let tabName = this.state.tabOptions[t];
				tabButtons.push(
					<button type="button" name={t} className={"tab-button "+(this.state.tab==t?"selected":"")} onClick={()=>this.selectTab(t)}>{tabName}</button>
				);
			}
			navigationTabs = <div className="navigation-tabs-mobile">
									{tabButtons}
							</div>;

			appContent = <div className="App-content setup">
							<div className="navigation-tabs">
								{this.state.mode=="setup"?tabButtons:null}
							</div>
							<div id="tabContent">
								{tabContent}
							</div>
						</div>;
		}else if(this.state.mode == "deck"){
			if(this.state.decktab == "obs"){
				if(this.state.oscConnected && this.state.obsConnected){
					appContent = <div className="App-content deck">
						<label className="deck-component-label">Output</label><OutputController osc={osc} />
						<label className="deck-component-label">Scenes</label><SceneController osc={osc} />
						<label className="deck-component-label">Sources</label><SourceControl osc={osc} />
						<label className="deck-component-label">Volume</label><VolumeControl osc={osc} />
					</div>;
				}else{
					
					if(!this.state.oscConnected){
						appContent = 
						<h1>Hold on...we're connecting to OSC</h1>
					}else if(!this.state.obsConnected){
						let obsLoginEl = null;
						obsLoginEl = <div className="obs-login-info">
							<label>IP Address
								<input name="url" type="text" onInput={this.handleObsInput} defaultValue={this.state.obsLoginInfo.url}/>
							</label>
							<label>Port
								<input name="port" type="text" onInput={this.handleObsInput} defaultValue={this.state.obsLoginInfo.port}/>
							</label>
							<label>Password
								<input name="password" type="password" onInput={this.handleObsInput} defaultValue={this.state.obsLoginInfo.password}/>
							</label>
							<label>Remember
								<input name="remember" onInput={this.handleObsInput} type="checkbox"/>
							</label>
							<button type="button" onClick={this.connectOBS}>Connect</button>
						</div>;
						
						appContent = <div className="App-content deck">
							<h1 style={{fontSize:"24px"}}>OBS not connected!</h1><br></br>
							<p>OBS is connected by Spooder itself. So only one connect is needed for all your Web UI clients.
								Check 'Remember' to save this info on file and Spooder will automatically attempt to connect to OBS
								when starting up.
							</p>
							{obsLoginEl}
						</div>
						
					}
				}
			}else if(this.state.decktab == "osc"){
				if(!this.state.oscConnected){
					appContent = 
					<h1>Hold on...we're connecting to OSC</h1>
				}else{
					appContent = <div className="App-content">
					<OSCMonitor osc={osc} />
				</div>
				}
				
			}else if(this.state.decktab == "mod"){
				appContent = <div className="App-content">
					<iframe id="ModUIViewer" src="/mod"/>
				</div>
			}

			
			let tabButtons = [];
			for(let t in this.state.deckTabOptions){
				let tabName = this.state.deckTabOptions[t];
				tabButtons.push(
					<button type="button" name={t} className={"tab-button "+(this.state.tab==t?"selected":"")} onClick={()=>this.selectTab(t)}>{tabName}</button>
				);
			}

			navigationTabs = <div className="navigation-tabs-mobile">
				{tabButtons}
			</div>;
			
		}
		let loginInfo = <div className="login-buttons">
							<a href={"https://id.twitch.tv/oauth2/authorize?client_id="+clientID+"&redirect_uri=http://localhost:"+hostPort+"/handle&response_type=code&scope=chat:read chat:edit channel:read:goals bits:read channel:read:subscriptions moderation:read channel:read:redemptions channel:read:polls channel:read:predictions channel:read:hype_train"}>Authorize</a>
							<a href={"/revoke"}>Revoke</a>
						</div>;

		
		return <div className="App">
					<div className={"navigation-menu "+(this.state.navOpen?"open":"")}>
						<div className="deck-mode-button">
							<button type="button" onClick={this.deckToggle} ><FontAwesomeIcon icon={faArrowRight}/> {this.state.mode=="deck"?"Setup Mode":"Deck Mode"}</button>
						</div>
						{navigationTabs}
						<div className="chat-actions">
							<label>Chat</label>
							<button type="button" onClick={this.restartChat}>Restart Chat</button>
							<label>Switch Channel</label>
							<input name="channel" type="text"/>
							<button type="button" onClick={this.connectChatChannel}>Connect</button>
						</div>
						<div className="login">
							<div className="account-info">{username}</div>
							{window.location.hostname=="localhost"?loginInfo:"Authorizing and Revoking only works on localhost"}
						</div>
					</div>
					<div className="App-header">
						<div className="top-header" onClick={this.navigationClick}>
							<div className="navigation-open-button" ><FontAwesomeIcon icon={faBars} size="2x" /></div>
							<h1 className="App-title">
								<span>/</span>
								<span>╲</span>
								<span>/</span>
								<span>\</span>
								<span>(</span>
								<span> </span>
								<span>{this.state.customSpooder.littleEyeLeft}</span>
								<span>{this.state.customSpooder.bigEyeLeft}</span>
								<span> </span>
								<span>{this.state.customSpooder.mouth}</span>
								<span> </span>
								<span>{this.state.customSpooder.bigEyeRight}</span>
								<span>{this.state.customSpooder.littleEyeRight}</span>
								<span> </span>
								<span>)</span>
								<span>/</span>
								<span>\</span>
								<span>╱</span>
								<span>\</span>
							</h1>
						</div>
						
					</div>
					{appContent}
				</div>;
	}
}
export default App;
