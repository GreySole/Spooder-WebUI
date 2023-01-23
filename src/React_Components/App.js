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

import BoolSwitch from './UI/BoolSwitch.js';

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
		if(urlParams.get("mode") != null){
			defaultMode = urlParams.get("mode");
		}
		if(urlParams.get("tab") != null){
			if(defaultMode == "setup"){
				customSetupTab = urlParams.get("tab");
			}else if(defaultMode == "deck"){
				customDeckTab = urlParams.get("tab");
			}
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
				"bigeyeleft": "o",
				"bigeyeright": "o",
				"littleeyeleft": "º",
				"littleeyeright": "º",
				"fangleft": " ",
				"fangright": " ",
				"mouth": "\u03c9",
				"colors": {
					"bigeyeleft": "white",
					"bigeyeright": "white",
					"littleeyeleft": "white",
					"littleeyeright": "white",
					"fangleft": "white",
					"fangright": "white",
					"mouth": "white",
					"shortlegs":"white",
					"longlegs":"white",
					"body":"white"
				}
			}
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
	stayHere = this.stayHere.bind(this);
	updateCustomSpooder = this.updateCustomSpooder.bind(this);
	saveCustomSpooder = this.saveCustomSpooder.bind(this);

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
			let newSpooder = Object.assign(this.state.customSpooder);
			Object.assign(newSpooder.colors, serverData.themes.spooderpet.colors);
			delete serverData.themes.spooderpet.colors;
			Object.assign(newSpooder, serverData.themes.spooderpet);
			this.setState(Object.assign(this.state, {"host":hostPort, "customSpooder":newSpooder}));
			if(this.state.mode == "setup"){
				this.setTabContent(this.state.tab);
			}else if(this.state.mode == "deck"){
				this.setTabContent(this.state.decktab);
			}
			
		})
		.catch(err => console.log(err))
		
	}
	
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

	stayHere(e){
		if(e.currentTarget.checked == true){
			console.log("STAYING");
			let urlState = {"mode":this.state.mode};
			if(this.state.mode == "setup"){
				urlState.tab = this.state.tab;
			}else if(this.state.mode == "deck"){
				urlState.tab = this.state.decktab;
			}
			if (history.pushState) {
				var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?mode='+urlState.mode+"&tab="+urlState.tab;
			}
		}else{
			
			var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
		}
		window.history.pushState({path:newurl},'',newurl);
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
		const configData = await response.json();

		if(response.status !== 200){
			throw Error(body.message);
		}
		this.setState(Object.assign(this.state, {
			tabData:{
				config:configData.config,
				discord:configData.discord,
				backups:configData.backups
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
				commandData:{events:commandData.events,groups:commandData.groups},
				udpClients:udpClients,
				plugins:commandData.plugins,
				obs:commandData.obs
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
		let leaveMessage =document.querySelector(".chat-actions input[name=leavemessage]").value;
		let joinMessage =document.querySelector(".chat-actions input[name=joinmessage]").value;

		const response = await fetch("/chat_channel?channel="+channel+"&leavemessage="+leaveMessage+"&joinmessage="+joinMessage).then(response => response.json());
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

	updateCustomSpooder(e){
		
		let newSpooder = Object.assign(this.state.customSpooder);
		if(e.currentTarget.type == "text"){
			newSpooder[e.currentTarget.name] = e.currentTarget.value;
		}else if(e.target.type == "color"){
			newSpooder.colors[e.currentTarget.name] = e.currentTarget.value;
		}
		this.setState(Object.assign(this.state, {customSpooder:newSpooder}))
	}

	saveCustomSpooder(e){
		let newSpooder = Object.assign(this.state.customSpooder);
		const requestOptions = {
			method: 'POST',
			headers: {'Content-Type': 'application/json', 'Accept':'application/json'},
			body: JSON.stringify(newSpooder)
		};
		fetch('/saveCustomSpooder', requestOptions)
		.then(response => response.json())
		.then(data => {
			document.querySelector("#spooderSaveStatusText").textContent = data.status;
			setTimeout(()=>{
				document.querySelector("#spooderSaveStatusText").textContent = "";
			}, 5000)
		});
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
					tabContent = <EventTable ref={this.commandRef} data={tabData.commandData.events} groups={tabData.commandData.groups} _udpClients={tabData.udpClients} _plugins={tabData.plugins} _obs={tabData.obs} />;
				break;
				case "config":
					tabContent = <ConfigTab ref={this.configRef} _taboptions={{setup:this.state.tabOptions,deck:this.state.deckTabOptions}} _customSpooder={Object.assign(this.state.customSpooder)} data={tabData} updateCustomSpooder={this.updateCustomSpooder} saveCustomSpooder={this.saveCustomSpooder} />;
				break;
				case "plugins":
					tabContent = <PluginTab ref={this.pluginRef} data={tabData.pluginData} _udpClients={tabData.udpClients} />;
				break;
				case "osctunnels":
					tabContent = <OSCTunnelTab ref={this.oscTunnelRef} data={tabData.tunnelData} _udpClients={tabData.udpClients} />;
				break;
				case "eventsub":
					tabContent = <EventSubTab ref={this.eventSubRef} data={tabData.eventData} _udpClients={tabData.udpClients} _plugins={tabData.plugins} _sevents={tabData.spooderevents} />;
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
						<OutputController osc={osc} />
						<SceneController osc={osc} />
						<SourceControl osc={osc} />
						<VolumeControl osc={osc} />
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
		let scopes = [
		 'channel:moderate',
		 'chat:read',
		 'chat:edit', 
		 'whispers:read', 
		 'whispers:edit', 
		 'analytics:read:extensions', 
		 'analytics:read:games', 
		 'bits:read', 
		 'channel:edit:commercial', 
		 'channel:manage:broadcast', 
		 'channel:read:charity', 
		 'channel:manage:extensions', 
		 'channel:manage:moderators', 
		 'channel:manage:polls', 
		 'channel:manage:predictions', 
		 'channel:manage:raids', 
		 'channel:manage:redemptions', 
		 'channel:manage:schedule', 
		 'channel:manage:videos', 
		 'channel:read:editors', 
		 'channel:read:goals', 
		 'channel:read:hype_train', 
		 'channel:read:polls', 
		 'channel:read:predictions', 
		 'channel:read:redemptions', 
		 'channel:read:stream_key', 
		 'channel:read:subscriptions', 
		 'channel:read:vips', 
		 'channel:manage:vips', 
		 'clips:edit', 
		 'moderation:read', 
		 'moderator:manage:announcements', 
		 'moderator:manage:automod',
		 'moderator:read:automod_settings', 
		 'moderator:manage:automod_settings', 
		 'moderator:manage:banned_users', 
		 'moderator:read:blocked_terms',
		 'moderator:manage:chat_messages',
		 'moderator:read:chat_settings',
		 'moderator:manage:chat_settings',
		 'moderator:read:chatters',
		 'moderator:read:shield_mode',
		 'moderator:manage:shield_mode',
		 'user:edit',
		 'user:edit:follows',
		 'user:manage:blocked_users',
		 'user:read:blocked_users',
		 'user:read:broadcast',
		 'user:manage:chat_color',
		 'user:read:email',
		 'user:read:follows',
		 'user:read:subscriptions',
		 'user:manage:whispers'
		];
		let loginInfo = <div className="login-buttons">
							<a href={"https://id.twitch.tv/oauth2/authorize?client_id="+clientID+"&redirect_uri=http://localhost:"+hostPort+"/handle&response_type=code&scope="+scopes.join(" ")}>Authorize</a>
							<a href={"/revoke"}>Revoke</a>
						</div>;

		return <div className="App">
					<div className={"navigation-menu "+(this.state.navOpen?"open":"")}>
						<div className="deck-mode-button">
							<button type="button" onClick={this.deckToggle} ><FontAwesomeIcon icon={faArrowRight}/> {this.state.mode=="deck"?"Setup Mode":"Deck Mode"}</button>
						</div>
						{navigationTabs}
						<div className="chat-actions">
							<label style={{display:"flex", alignItems:"center"}}>Stay Here <BoolSwitch name="stayhere" onChange={this.stayHere} checked={(urlParams.get("mode")!=null&&urlParams.get("tab")!=null)} /></label>
							<label>Chat <button type="button" onClick={this.restartChat}>Restart Chat</button></label>
							<label>Switch Channel <input name="channel" type="text" placeholder="Twitch channel name"/> 
								<input name="leavemessage" type="text" placeholder="Say to your chat before leaving"/> 
								<input name="joinmessage" type="text" placeholder="Introduce the bot after joining"/> 
								<button type="button" onClick={this.connectChatChannel}>Connect</button>
							</label>
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
								<span style={{color:this.state.customSpooder.colors.longlegs}}>/</span>
								<span style={{color:this.state.customSpooder.colors.longlegs}}>╲</span>
								<span style={{color:this.state.customSpooder.colors.shortlegs}}>/</span>
								<span style={{color:this.state.customSpooder.colors.shortlegs}}>\</span>
								<span style={{color:this.state.customSpooder.colors.body}}>(</span>
								<span> </span>
								<span style={{color:this.state.customSpooder.colors.littleeyeleft}}>{this.state.customSpooder.littleeyeleft}</span>
								<span style={{color:this.state.customSpooder.colors.bigeyeleft}}>{this.state.customSpooder.bigeyeleft}</span>
								<span style={{color:this.state.customSpooder.colors.fangleft}}>{this.state.customSpooder.fangleft}</span>
								<span style={{color:this.state.customSpooder.colors.mouth}}>{this.state.customSpooder.mouth}</span>
								<span style={{color:this.state.customSpooder.colors.fangright}}>{this.state.customSpooder.fangright}</span>
								<span style={{color:this.state.customSpooder.colors.bigeyeright}}>{this.state.customSpooder.bigeyeright}</span>
								<span style={{color:this.state.customSpooder.colors.littleeyeright}}>{this.state.customSpooder.littleeyeright}</span>
								<span> </span>
								<span style={{color:this.state.customSpooder.colors.body}}>)</span>
								<span style={{color:this.state.customSpooder.colors.shortlegs}}>/</span>
								<span style={{color:this.state.customSpooder.colors.shortlegs}}>\</span>
								<span style={{color:this.state.customSpooder.colors.longlegs}}>╱</span>
								<span style={{color:this.state.customSpooder.colors.longlegs}}>\</span>
							</h1>
						</div>
						
					</div>
					{appContent}
				</div>;
	}
}
export default App;
