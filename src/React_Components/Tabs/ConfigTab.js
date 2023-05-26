import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faDownload, faTrash, faUpload} from '@fortawesome/free-solid-svg-icons';
import BoolSwitch from '../UI/BoolSwitch.js';
import LinkButton from '../UI/LinkButton.js';
import tinycolor from 'tinycolor2';
class ConfigTab extends React.Component{
	constructor(props){
		super(props);
		this.state = Object.assign(props.data.config);
		this.state["_tabOptions"] = Object.assign(props._taboptions);
		this.state["_brstatus"] = {
			discordExpanded:false,
			csExpanded:false,
			brExpanded:false,
			backupSettings:false,
			backupPlugins:false,
			restoreSettings:false,
			restorePlugins:false,
			everythingChecked:true
		};
		this.state["_backups"] = Object.assign(props.data.backups);
		this.state["_saveCustomSpooder"] = props.saveCustomSpooder;
		this.state["_updateCustomSpooder"] = props.updateCustomSpooder;
		let cSpooder = Object.assign(props._customSpooder);
		for(let c in cSpooder.colors){
			cSpooder.colors[c] = tinycolor(cSpooder.colors[c]).toHexString();
		}
		this.state["_customSpooder"] = cSpooder;
		this.state["_discord"] = props.data.discord.config!=null?props.data.discord:{
			config:{
				token:"",
				clientId:"",
				autosendngrok:{
					enabled:false,
					destguild:"",
					destchannel:""
				}
			},
			guilds:{}
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleUDPChange = this.handleUDPChange.bind(this);
		this.handleDiscordChange = this.handleDiscordChange.bind(this);
		this.saveConfig = this.saveConfig.bind(this);
		this.saveDiscord = this.saveDiscord.bind(this);
		this.deleteUDPClient = this.deleteUDPClient.bind(this);
		this.addSubVar = this.addSubVar.bind(this);
		this.setDefaultTabs = this.setDefaultTabs.bind(this);

		this.toggleDiscord = this.toggleDiscord.bind(this);
		this.toggleBackupRestore = this.toggleBackupRestore.bind(this);
		this.backupSettings = this.backupSettings.bind(this);
		this.backupPlugins = this.backupPlugins.bind(this);
		this.deleteSettingsBackup = this.deleteSettingsBackup.bind(this);
		this.deletePluginsBackup = this.deletePluginsBackup.bind(this);
		this.restoreSettings = this.restoreSettings.bind(this);
		this.restorePlugins = this.restorePlugins.bind(this);

		this.restoreSettingsFileSelect = this.restoreSettingsFileSelect.bind(this);
		this.restorePluginsFileSelect = this.restorePluginsFileSelect.bind(this);

		this.hiddenSettingsUpload = React.createRef();
		this.hiddenPluginsUpload = React.createRef();

		this.handleFileClick = this.handleFileClick.bind(this);
		this.uploadSettingsBackup = this.uploadSettingsBackup.bind(this);
		this.uploadPluginsBackup = this.uploadPluginsBackup.bind(this);

		this.toggleCustomSpooder = this.toggleCustomSpooder.bind(this);
		this.restoreEverythingClick = this.restoreEverythingClick.bind(this);

		for(let cs in this.configStructure){
			if(this.state[cs] == null){
				this.state[cs] = this.configStructure[cs];
				continue;
			}
			for(let css in this.configStructure[cs]){
				if(this.state[cs][css] == null){
					this.state[cs][css] = this.configStructure[cs][css];
				}
			}
		}
	}

	configStructure = {
		"bot":{
			"sectionname":"Bot Settings",
			"bot_name":"",
			"help_command":"",
			"introduction":"I'm a Spooder connected to the stream ^_^"
		},
		"broadcaster":{
			"sectionname":"Broadcaster",
			"username":""
		},"network":{
			"sectionname":"Network",
			"host":"",
			"host_port":3000,
			"externalhandle":"ngrok",
			"ngrokauthtoken":"",
			"external_http_url":"",
			"external_tcp_url":"",
			"udp_clients":{},
			"osc_udp_port":9000,
			"osc_tcp_port":3333
		}
	}
	
	handleChange(s){
		
		let name = s.target.name;
		let section = s.target.getAttribute("sectionname");
		let newSection = Object.assign(this.state[section]);
		
		if(section != "oscvars"){
			if(s.target.type == "checkbox"){
				window.toggleSwitch(s);
				newSection[name] = s.target.checked;
			}else{
				newSection[name] = s.target.value;
			}
		}else{
			newSection[s.target.getAttribute("varname")][name] = s.target.value;
		}
		this.setState(Object.assign(this.state,{[section]:newSection}));
	}

	handleUDPChange(s){
		let name = s.target.name;
		let parent = s.target.closest(".config-sub-var");
		let section = parent.getAttribute("sectionname");
		let newSection = Object.assign(this.state[section]);
		newSection[parent.getAttribute("varname")][parent.getAttribute("subvarname")][name] = s.target.value;
		this.setState(Object.assign(this.state,{[section]:newSection}));
	}

	handleDiscordChange(s){
		let name = s.target.name;
		let newDiscord = Object.assign({},this.state._discord);
		if(name.includes("-")){
			name = name.split("-");
			if(newDiscord.config[name[0]] == null){newDiscord.config[name[0]] = {}}
			if(s.target.type == "checkbox"){
				newDiscord.config[name[0]][name[1]] = s.target.checked;
			}else{
				newDiscord.config[name[0]][name[1]] = s.target.value;
			}
			
		}else{
			newDiscord.config[name] = s.target.value;
		}
		this.setState(Object.assign(this.state, {_discord:newDiscord}))
	}
	
	addSubVar(e){
		
		let el = e.target.closest(".config-sub-var.add")
		let sectionName = e.target.closest(".config-variable.sub-section").getAttribute("sectionname");
		
		let varname = e.target.closest(".config-variable.sub-section").getAttribute("varname");
		let newUDPClients = Object.assign(this.state[sectionName][varname]);

		let clientKey = el.querySelector(".config-sub-var-ui input[name='clientKey']").value;
		let clientName = el.querySelector(".config-sub-var-ui input[name='clientName']").value;
		let clientIP = el.querySelector(".config-sub-var-ui input[name='clientIP']").value;
		let clientPort = el.querySelector(".config-sub-var-ui input[name='clientPort']").value;

		newUDPClients[clientKey] = {
			name:clientName,
			ip:clientIP,
			port:clientPort
		};
		
		this.setState(Object.assign(this.state, {"network":Object.assign(this.state.network,{udp_clients:newUDPClients})}));
	}

	saveDiscord(){
		let newDiscord = Object.assign(this.state._discord.config);
		delete newDiscord["guilds"];
		
		const requestOptions = {
			method: 'POST',
			headers: {'Content-Type': 'application/json', 'Accept':'application/json'},
			body: JSON.stringify(newDiscord)
		};
		
		fetch('/discord/saveDiscordConfig', requestOptions)
		.then(response => response.json())
		.then(data => {
			document.querySelector("#discordSaveStatusText").textContent = data.status;
			setTimeout(()=>{
				document.querySelector("#discordSaveStatusText").textContent = "";
			}, 5000)
		});
	}
	
	saveConfig(){
		let newList = Object.assign({},this.state);
		for(let item in newList){
			if(item.startsWith("_")){
				delete newList[item];
			}
		}
		
		const requestOptions = {
			method: 'POST',
			headers: {'Content-Type': 'application/json', 'Accept':'application/json'},
			body: JSON.stringify(newList)
		};
		
		fetch('/saveConfig', requestOptions)
		.then(response => response.json())
		.then(data => {
			document.querySelector("#saveStatusText").textContent = data.status;
			setTimeout(()=>{
				document.querySelector("#saveStatusText").textContent = "";
			}, 5000)
		});
	}

	deleteUDPClient(e){
		let el = e.currentTarget.closest(".config-sub-var");
		let sectionname = el.getAttribute("sectionname");
		let varname = el.getAttribute("varname");
		let subvarname = el.getAttribute("subvarname");

		let newUDPClients = Object.assign(this.state[sectionname][varname]);
		delete newUDPClients[subvarname];
		
		this.setState(Object.assign(this.state, {"network":Object.assign(this.state.network,{udp_clients:newUDPClients})}));
	}

	setDefaultTabs(e){
		localStorage.setItem("defaulttabs", e.currentTarget.value);
		let newOptions = Object.assign(this.state._tabOptions);
		newOptions.defaulttabs = e.currentTarget.value;
		this.setState(Object.assign(this.state, {_tabOptions:newOptions}));
	}

	setCustomDefaultTabs(e){
		
		if(e.currentTarget.name == "setup"){
			localStorage.setItem("customsetuptab", e.currentTarget.value);
		}else if(e.currentTarget.name == "deck"){
			localStorage.setItem("customdecktab", e.currentTarget.value);
		}else if (e.currentTarget.name == "mode"){
			localStorage.setItem("defaultmode", e.currentTarget.value);
		}
	}

	backupSettings(e){
		let newStatus = Object.assign(this.state._brstatus);
		newStatus.backupSettings = true;
		let backupName = document.querySelector(".backup-action-button input[name=backupSettings]").value;
		fetch("/backup_settings", {method: 'POST',
		headers: {'Content-Type': 'application/json'}, 
		body:JSON.stringify({backupName:backupName})})
		.then(async response => {
			let newSettingsBackups = await response.json();
			this.brFinish("backupSettings", newSettingsBackups.newbackups);
		});

		this.setState(Object.assign(this.state, {_brstatus:newStatus}));
	}

	backupPlugins(e){
		let newStatus = Object.assign(this.state._brstatus);
		newStatus.backupPlugins = true;
		let backupName = document.querySelector(".backup-action-button input[name=backupPlugins]").value;
		fetch("/backup_plugins", {method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body:JSON.stringify({backupName:backupName})})
		.then(async response => {
			let newSettingsBackups = await response.json();
			this.brFinish("backupPlugins", newSettingsBackups.newbackups);
		});
		this.setState(Object.assign(this.state, {_brstatus:newStatus}));
	}

	deleteSettingsBackup(e){
		let backupName = document.querySelector(".restore-settings-div select").value;
		if(confirm("Are you sure you want to delete "+backupName+"?") == false){
			return;
		}
		fetch("/delete_backup_settings", {
			method:"POST",
			headers:{'Content-Type':'application/json'},
			body:JSON.stringify({backupName:backupName})
		})
		.then(async response => {
			let newSettingsBackups = await response.json();
			if(newSettingsBackups.status == "SUCCESS"){
				this.brFinish("backupSettings", newSettingsBackups.newbackups);
			}
		});
	}

	deletePluginsBackup(e){
		let backupName = document.querySelector(".restore-plugins-div select").value;
		if(confirm("Are you sure you want to delete "+backupName+"?") == false){
			return;
		}
		fetch("/delete_backup_plugins", {
			method:"POST",
			headers:{'Content-Type':'application/json'},
			body:JSON.stringify({backupName:backupName})
		})
		.then(async response => {
			let newSettingsBackups = await response.json();
			if(newSettingsBackups.status == "SUCCESS"){
				this.brFinish("backupPlugins", newSettingsBackups.newbackups);
			}
		});
	}

	restoreSettings(e){
		if(confirm("The selected files from the backup will overwrite your current setup. You should probably restart Spooder after doing this. Continue?") == false){
			return;
		}
		let restoreFileName = document.querySelector(".restore-settings-div select").value;
		let newStatus = Object.assign(this.state._brstatus);
		let restoreSelections = {
			everything:this.state._brstatus.everythingChecked,
			config:document.querySelector(".restore-settings-checkboxes #restoreConfig")?.checked,
			commands:document.querySelector(".restore-settings-checkboxes #restoreEvents")?.checked,
			eventsub:document.querySelector(".restore-settings-checkboxes #restoreEventsub")?.checked,
			oauth:document.querySelector(".restore-settings-checkboxes #restoreOauth")?.checked,
			"osc-tunnels":document.querySelector(".restore-settings-checkboxes #restoreTunnels")?.checked,
			"eventstorage":document.querySelector(".restore-settings-checkboxes #restoreEventStorage")?.checked,
			"shares":document.querySelector(".restore-settings-checkboxes #restoreShares")?.checked,
			"mod-blacklist":document.querySelector(".restore-settings-checkboxes #restoreBlacklist")?.checked,
			"mod":document.querySelector(".restore-settings-checkboxes #restoreModData")?.checked,
			"themes":document.querySelector(".restore-settings-checkboxes #restoreThemes")?.checked
		};
		
		newStatus.restoreSettings = true;
		fetch("/restore_settings", {
			method:"POST",
			headers:{'Content-Type':'application/json'},
			body:JSON.stringify({backupName:restoreFileName, selections:restoreSelections})
		})
		.then(async response => {
			let newSettingsBackups = await response.json();
			if(newSettingsBackups.status == "SUCCESS"){
				this.brFinish("backupPlugins", newSettingsBackups.newbackups);
			}
		});
		this.setState(Object.assign(this.state, {_brstatus:newStatus}));
	}

	restorePlugins(e){
		if(confirm("This will wipe your current plugins and replace it with everything in this file. Continue?") == false){
			return;
		}
		let restoreFileName = document.querySelector(".restore-plugins-div select").value;
		let newStatus = Object.assign(this.state._brstatus);
		newStatus.restorePlugins = true;

		fetch("/restore_plugins", {
			method:"POST",
			headers:{'Content-Type':'application/json'},
			body:JSON.stringify({backupName:restoreFileName})
		})
		.then(async response => {
			let newSettingsBackups = await response.json();
			if(newSettingsBackups.status == "SUCCESS"){
				this.brFinish("backupPlugins", newSettingsBackups.newbackups);
			}
		});

		this.setState(Object.assign(this.state, {_brstatus:newStatus}));
	}

	restoreSettingsFileSelect(e){
		let fileName = e.currentTarget.value;
		this.setState(Object.assign(this.state, {_restoreSettingsFile:fileName}));
	}

	restorePluginsFileSelect(e){
		let fileName = e.currentTarget.value;
		this.setState(Object.assign(this.state, {_restorePluginsFile:fileName}));
	}

	brFinish(which, newState){
		let newStatus = Object.assign(this.state._brstatus);
		let newBackups = Object.assign(this.state._backups);
		if(which == "backupSettings"){
			newStatus.backupSettings = false;
			newBackups.settings = newState;
		}else if(which == "backupPlugins"){
			newStatus.backupPlugins = false;
			newBackups.plugins = newState;
		}else if(which == "restoreSettings"){
			newStatus.restoreSettings = false;
		}else if(which == "restorePlugins"){
			newStatus.restorePlugins = false;
		}

		this.setState(Object.assign(this.state, {_brstatus:newStatus}));
	}

	handleFileClick(e){
		if(e.currentTarget.getAttribute("backup") == "settings"){
			this.hiddenSettingsUpload.current.click();
		}else if(e.currentTarget.getAttribute("backup") == "plugins"){
			this.hiddenPluginsUpload.current.click();
		}
	}

	async uploadSettingsBackup(e){
		var fd = new FormData();
		fd.append('file', e.target.files[0]);

		const requestOptions = {
			method: 'POST',
			body: fd
		};
		let newBackups = Object.assign(this.state._backups);
		newBackups.settings = await fetch('/checkin_settings', requestOptions)
			.then(response => response.json());

		this.setState(Object.assign(this.state, {_backups:newBackups}));
	}

	async uploadPluginsBackup(e){
		var fd = new FormData();
		fd.append('file', e.target.files[0]);

		const requestOptions = {
			method: 'POST',
			body: fd
		};
		let newBackups = Object.assign(this.state._backups);
		newBackups.plugins = await fetch('/checkin_plugins', requestOptions)
			.then(response => response.json());

		this.setState(Object.assign(this.state, {_backups:newBackups}));
	}

	toggleDiscord(e){
		let newDiscord = Object.assign(this.state._brstatus);
		newDiscord.discordExpanded = !newDiscord.discordExpanded;
		this.setState(Object.assign(this.state, {_brstatus:newDiscord}));
	}
	toggleBackupRestore(e){
		let newBackups = Object.assign(this.state._brstatus);
		newBackups.brExpanded = !newBackups.brExpanded;
		this.setState(Object.assign(this.state, {_brstatus:newBackups}))
	}
	
	toggleCustomSpooder(e){
		let newStatus = Object.assign(this.state._brstatus);
		newStatus.csExpanded = !newStatus.csExpanded;
		this.setState(Object.assign(this.state, {_brstatus:newStatus}));
	}

	restoreEverythingClick(e){
		let newStatus = Object.assign(this.state._brstatus);
		newStatus.everythingChecked = !newStatus.everythingChecked;
		this.setState(Object.assign(this.state, {_brstatus:newStatus}));
	}

	render(){
		let sections = [];
		let table = [];

		let udpTrashButton = <FontAwesomeIcon icon={faTrash} size="lg" onClick={this.deleteUDPClient} />;

		let udpClients = this.state.network.udp_clients;
		let clientTable = [];

		for(let u in udpClients){
			clientTable.push(<option value={u}>{udpClients[u].name}</option>);
		}
		
		for(let s in this.state){
			if(s.startsWith("_")){continue;}
			table = [];
			//console.log(s);
			for(let ss in this.state[s]){
				if(ss=="sectionname"){continue;}
				let dataType = typeof this.state[s][ss];

				switch(dataType){
					case 'number':
					case 'string':
						if(ss == "externalhandle"){
							table.push(<div className="config-variable"><label>{ss}
								<select name={ss} sectionname={s} defaultValue={this.state[s][ss]} onChange={this.handleChange}>
									<option value="ngrok">Ngrok</option>
									<option value="manual">Enter Manually</option>
								</select>
								</label></div>);
						}else{
							if(this.state[s]["externalhandle"] != "manual" && (ss == "external_http_url" || ss == "external_tcp_url")){
								break;
							}
							if(this.state[s]["externalhandle"] != "ngrok" && (ss == "ngrokauthtoken")){
								break;
							}
							let inputType = "text";
							let copyButton = null;
							if(ss == "external_http_url" || ss == "external_tcp_url" || ss == "ngrokauthtoken"){
								inputType = "password";
								if(ss == "external_http_url" || ss == "ngrokauthtoken"){
									copyButton = <LinkButton name={ss+"-mod"} text={"Copy Mod URL"} mode="copy" link={this.state[s]["external_http_url"]+"/mod"} />
								}
							}

							table.push(<div className="config-variable"><label>{ss}<input type={inputType} name={ss} sectionname={s} defaultValue={this.state[s][ss]} onChange={this.handleChange} /></label>{copyButton}</div>);
						}
						
					break;
					case 'boolean':
						
						table.push(<div className="config-variable"><label>{ss}</label>
						<BoolSwitch name="obs-remember" sectionname={s} checked={this.state[s][ss]} onChange={this.handleChange} />
						<label className={this.state[s][ss]?"boolswitch checked":"boolswitch"}><input type="checkbox" name={ss} sectionname={s} defaultChecked={this.state[s][ss]} onChange={this.handleChange}/>
						<div></div></label></div>);
						break;
					case 'object':
						let subTable = [];
						//console.log(this.state);
						for(let c in this.state[s][ss]){
							
							subTable.push(<div className="config-sub-var" sectionname={s} varname={ss} subvarname={c}>
								<div className="config-sub-var-buttons">
									{udpTrashButton}
								</div>
								<div className="config-sub-var-ui">
									<label>
										{c}
									</label>
									<label>Name:
										<input name="name" type="text" defaultValue={this.state[s][ss][c]['name']} placeholder="Name of client" onChange={this.handleUDPChange} />
									</label>
									<label>IP:
										<input name="ip" type="text" defaultValue={this.state[s][ss][c]['ip']} placeholder="IP address to send to" onChange={this.handleUDPChange} />
									</label>
									<label>Port:
										<input name="port" type="text" defaultValue={this.state[s][ss][c]['port']} placeholder="IP port to send to" onChange={this.handleUDPChange} />
									</label>
								</div>
							</div>);
						}
						let addSubVarForm = <div className="config-sub-var add">
												
												<div className="config-sub-var-ui">
													<label>Key:
														<input name="clientKey" type="text" placeholder="Key name for storage"  />
													</label>
													<label>Name:
														<input name="clientName" type="text" placeholder="Name of client"  />
													</label>
													<label>IP:
														<input name="clientIP" type="text" placeholder="IP address to send to"  />
													</label>
													<label>Port:
														<input name="clientPort" type="text" placeholder="IP port to send to"  />
													</label>
												</div>
												<div className="config-sub-var-buttons">
													<button type="button" className="add-button" onClick={this.addSubVar}>Add</button>
												</div>
											</div>
						table.push(<div varname={ss} sectionname={s} className="config-variable sub-section"><label>{ss} {subTable}
							<div className="config-variable add">{addSubVarForm}</div></label>
						</div>);
						
					break;
				}
			}
			sections.push(<div className="config-element" name={s}><label>{this.state[s]["sectionname"]}</label>{table}</div>);
		}

		
	let tabOptionsContainer = null;
	let deckTabOptionsContainer = null;
	let modeContainer = null;
	if(localStorage.getItem("defaulttabs") == "custom"){
		let tabOptionsEl = [];
		let deckTabOptionsEl = [];

		for(let to in this.state._tabOptions.setup){
			tabOptionsEl.push(
				<option value={to}>{this.state._tabOptions.setup[to]}</option>
			)
		}

		for(let dto in this.state._tabOptions.deck){
			deckTabOptionsEl.push(
				<option value={dto}>{this.state._tabOptions.deck[dto]}</option>
			)
		}

		modeContainer = <label>Default Mode<select name="mode" onChange={this.setCustomDefaultTabs}>
				<option value="setup">Setup Mode</option>
				<option value="deck">Deck Mode</option>
			</select></label>

		tabOptionsContainer = <label>Setup Tab<select name="setup" onChange={this.setCustomDefaultTabs} defaultValue={localStorage.getItem("customsetuptab")}>
			{tabOptionsEl}
		</select></label>;

		deckTabOptionsContainer = <label>Deck Tab<select name="deck" onChange={this.setCustomDefaultTabs} defaultValue={localStorage.getItem("customdecktab")}>
			{deckTabOptionsEl}
		</select></label>;
	}

	let restoreSettingsOptions = [<option>Select a Backup</option>];
	let restorePluginsOptions = [<option>Select a Backup</option>];

	for(let rs in this.state._backups.settings){
		restoreSettingsOptions.push(
			<option>{this.state._backups.settings[rs]}</option>
		);
	}

	for(let rp in this.state._backups.plugins){
		restorePluginsOptions.push(
			<option>{this.state._backups.plugins[rp]}</option>
		);
	}

	let guildOptions = [<option value={""}>Select Guild</option>];
	let channelOptions = [<option value={""}>Select Channel</option>];
	
	if(this.state._discord.guilds != null){
		if(this.state._discord.config.autosendngrok?.enabled){
			for(let g in this.state._discord.guilds){
				guildOptions.push(
					<option value={g}>{this.state._discord.guilds[g].name}</option>
				)
			}
		}
		
		if(this.state._discord.config.autosendngrok?.enabled){
			if(this.state._discord.config.autosendngrok.destguild != null && this.state._discord.config.autosendngrok.destguild != ""){
				for(let c in this.state._discord.guilds[this.state._discord.config.autosendngrok.destguild].channels){
					channelOptions.push(
						<option value={c}>{this.state._discord.guilds[this.state._discord.config.autosendngrok.destguild].channels[c].name}</option>
					)
				}
			}
		}
	}
	
	let autoNgrokFields = this.state._discord.config.autosendngrok?.enabled != null?<div className="config-variable">
		<label>
			Server
			<select name="autosendngrok-destguild" defaultValue={this.state._discord.config.autosendngrok?.destguild} onChange={this.handleDiscordChange}>
				{guildOptions}
			</select>
		</label>
		<label>
			Channel
			<select name="autosendngrok-destchannel" defaultValue={this.state._discord.config.autosendngrok?.destchannel} onChange={this.handleDiscordChange}>
				{channelOptions}
			</select>
		</label>
	</div>:null;

	let discord = this.state._brstatus.discordExpanded==true?<div className="config-discord">
		<div className="config-variable">
			<label>
				Master User
				<input type="master" defaultValue={this.state._discord.config.master} onChange={this.handleDiscordChange}/>
			</label>
		</div>
		<div className="config-variable">
			<label>
				Bot token
				<input type="password" defaultValue={this.state._discord.config.token} onChange={this.handleDiscordChange}/>
			</label>
		</div>
		{this.state._discord.guilds!=null?<div className="config-variable">
			<label>
				Send Mod UI Link to Channel on Startup
				<BoolSwitch name="autosendngrok-enabled" checked={this.state._discord.config.autosendngrok?.enabled} onChange={this.handleDiscordChange}/>
			</label>
		</div>:<div class="config-variable">
				Discord isn't logged in. Input your bot token and invite the bot to your server to assign a channel to auto send Ngrok links.
			</div>}
		{autoNgrokFields}
		<div className="save-commands"><button type="button" id="saveDiscordButton" className="save-button" onClick={this.saveDiscord}>Save</button><div id="discordSaveStatusText" className="save-status"></div></div>
	</div>:null;

	let everythingChecked = this.state._brstatus.everythingChecked==true?
	<div className="restore-settings-checkboxes">
				<label>Everything
					<input id="restoreEverything" type="checkbox" name="everything" onChange={this.restoreEverythingClick} defaultChecked={this.state._brstatus.everythingChecked}/>
				</label>
			</div>:
			<div className="restore-settings-checkboxes">
			<label>Everything
				<input id="restoreEverything" type="checkbox" name="everything" onChange={this.restoreEverythingClick}/>
			</label>
			<label>Config
				<input id="restoreConfig" type="checkbox" name="config" defaultChecked/>
			</label>
			<label>Events
				<input id="restoreEvents" type="checkbox" name="commands" defaultChecked/>
			</label>
			<label>EventSub
				<input id="restoreEventsub" type="checkbox" name="eventsub" defaultChecked/>
			</label>
			<label>oAuth
				<input id="restoreOauth" type="checkbox" name="oauth"/>
			</label>
			<label>OSC Tunnels
				<input id="restoreTunnels" type="checkbox" name="osc-tunnels" defaultChecked/>
			</label>
			<label>Mod Data
				<input id="restoreModData" type="checkbox" name="mod" defaultChecked/>
			</label>
			<label>Mod Blacklist
				<input id="restoreBlacklist" type="checkbox" name="mod-blacklist" defaultChecked/>
			</label>
			<label>Event Storage
				<input id="restoreEventStorage" type="checkbox" name="eventstorage" defaultChecked/>
			</label>
			<label>Shares
				<input id="restoreShares" type="checkbox" name="shares" defaultChecked/>
			</label>
			<label>Themes
				<input id="restoreThemes" type="checkbox" name="themes" defaultChecked/>
			</label>
		</div>
	
	let backupRestore = this.state._brstatus.brExpanded==true?<div className="config-backup-restore">
	<div className="backup-actions"><label className="backup-section-label">Backup</label>
		<div className="backup-action-button">
			<label>Settings</label>
			<div>
				<input type="text" placeholder='Default: Timestamp' name="backupSettings"/>
				<button type="button" className="link-button-button" onClick={this.backupSettings}>{this.state._brstatus.backupSettings==true?"Backing up...":"Backup Settings"}</button>
				<input type='file' id='input-file-settings' ref={this.hiddenSettingsUpload} onChange={this.uploadSettingsBackup} style={{ display: 'none' }} />
				<label htmlFor='input-file-settings'>
					<button type="button" className="link-button-button" backup="settings" onClick={this.handleFileClick}>Import <FontAwesomeIcon icon={faUpload} size="lg" /></button>
				</label>
			</div>
		</div>
		<div className="backup-action-button">
			<label>Plugins</label>
			<div>
				<input type="text" placeholder='Default: Timestamp' name="backupPlugins"/>
				<button type="button" className="link-button-button" onClick={this.backupPlugins}>{this.state._brstatus.backupPlugins==true?"Backing up...":"Backup Plugins"}</button>
				<input type='file' id='input-file-plugins' ref={this.hiddenPluginsUpload} onChange={this.uploadPluginsBackup} style={{ display: 'none' }} />
				<label htmlFor='input-file-settings'>
					<button type="button" className="link-button-button" backup="plugins" onClick={this.handleFileClick}>Import <FontAwesomeIcon icon={faUpload} size="lg" /></button>
				</label>
			</div>
		</div>
	</div>
	<div className="restore-actions"><label className="restore-section-label">Restore</label>
		<div className="restore-settings-div">
			<div className="restore-settings-select">
				<select onChange={this.restoreSettingsFileSelect}>
					{restoreSettingsOptions}
				</select>
				<div className="restore-settings-button">
					<button type="button" className="link-button-button icononly" onClick={this.deleteSettingsBackup}><FontAwesomeIcon icon={faTrash} size="2x"/></button>
					<a className="link-override" href={"/checkout_settings/"+this.state._restoreSettingsFile} download={this.state._restoreSettingsFile}><div className="link-button-button">Download <FontAwesomeIcon icon={faDownload} size="lg" /></div></a>
				</div>
				
			</div>
			{everythingChecked}
			<div className="restore-settings-button">
				<button type="button" className="link-button-button" onClick={this.restoreSettings}>Restore Settings</button>
			</div>
		</div>
		<div className="restore-plugins-div">
			<div className="restore-plugins-select">
				<select onChange={this.restorePluginsFileSelect}>
					{restorePluginsOptions}
				</select>
				<div className="restore-plugins-button">
					<button type="button" className="link-button-button icononly" onClick={this.deletePluginsBackup}><FontAwesomeIcon icon={faTrash} size="2x"/></button>
					<a className="link-override" href={"/checkout_plugins/"+this.state._restorePluginsFile} download={this.state._restorePluginsFile}><div className="link-button-button">Download <FontAwesomeIcon icon={faDownload} size="lg" /></div></a>
				</div>
				
			</div>
			<div className="restore-plugins-button">
				<button type="button" className="link-button-button" onClick={this.restorePlugins}>Restore Plugins</button>
			</div>
			
		</div>
	</div>
</div>:null;

let customSpooder = this.state._brstatus.csExpanded?<div className="custom-spooder-ui">
	<div className="custom-spooder-inputs">
		<div className="custom-spooder-pair"><div className="custom-spooder-label">Little Eye Left</div>
			<input type="text" name="littleeyeleft" onChange={this.state._updateCustomSpooder} defaultValue={this.state._customSpooder.littleeyeleft}/>
			<input type="color" name="littleeyeleft" onChange={this.state._updateCustomSpooder} defaultValue={this.state._customSpooder.colors.littleeyeleft}/>
		</div>
		<div className="custom-spooder-pair"><div className="custom-spooder-label">Big Eye Left</div>
			<input type="text" name="bigeyeleft" onChange={this.state._updateCustomSpooder} defaultValue={this.state._customSpooder.bigeyeleft}/>
			<input type="color" name="bigeyeleft" onChange={this.state._updateCustomSpooder} defaultValue={this.state._customSpooder.colors.bigeyeleft}/>
		</div>
		<div className="custom-spooder-pair"><div className="custom-spooder-label">Fang Left</div>
			<input type="text" name="fangleft" onChange={this.state._updateCustomSpooder} defaultValue={this.state._customSpooder.fangleft}/>
			<input type="color" name="fangleft" onChange={this.state._updateCustomSpooder} defaultValue={this.state._customSpooder.colors.fangleft}/>
		</div>
		<div className="custom-spooder-pair"><div className="custom-spooder-label">Mouth</div>
			<input type="text" name="mouth" onChange={this.state._updateCustomSpooder} defaultValue={this.state._customSpooder.mouth}/>
			<input type="color" name="mouth" onChange={this.state._updateCustomSpooder} defaultValue={this.state._customSpooder.colors.mouth}/>
		</div>
		<div className="custom-spooder-pair"><div className="custom-spooder-label">Fang Right</div>
			<input type="text" name="fangright" onChange={this.state._updateCustomSpooder} defaultValue={this.state._customSpooder.fangright}/>
			<input type="color" name="fangright" onChange={this.state._updateCustomSpooder} defaultValue={this.state._customSpooder.colors.fangright}/>
		</div>
		<div className="custom-spooder-pair"><div className="custom-spooder-label">Big Eye Right</div>
			<input type="text" name="bigeyeright" onChange={this.state._updateCustomSpooder} defaultValue={this.state._customSpooder.bigeyeright}/>
			<input type="color" name="bigeyeright" onChange={this.state._updateCustomSpooder} defaultValue={this.state._customSpooder.colors.bigeyeright}/>
		</div>
		<div className="custom-spooder-pair"><div className="custom-spooder-label">Little Eye Right</div>
			<input type="text" name="littleeyeright" onChange={this.state._updateCustomSpooder} defaultValue={this.state._customSpooder.littleeyeright}/>
			<input type="color" name="littleeyeright" onChange={this.state._updateCustomSpooder} defaultValue={this.state._customSpooder.colors.littleeyeright}/>
		</div>
		<div className="custom-spooder-pair"><div className="custom-spooder-label">Body Color</div>
			<input type="color" name="body" onChange={this.state._updateCustomSpooder} defaultValue={this.state._customSpooder.colors.body}/>
		</div>
		<div className="custom-spooder-pair"><div className="custom-spooder-label">Short Legs Color</div>
			<input type="color" name="shortlegs" onChange={this.state._updateCustomSpooder} defaultValue={this.state._customSpooder.colors.shortlegs}/>
		</div>
		<div className="custom-spooder-pair"><div className="custom-spooder-label">Long Legs Color</div>
			<input type="color" name="longlegs" onChange={this.state._updateCustomSpooder} defaultValue={this.state._customSpooder.colors.longlegs}/>
		</div>
	</div>
	<div className="save-commands"><button type="button" id="saveSpooderButton" className="save-button" onClick={this.state._saveCustomSpooder}>Save</button><div id="spooderSaveStatusText" className="save-status"></div></div>
</div>:null;
		
		return (
			<form className="config-tab">
				<div className="non-config-element">
					<div className="backup-restore-toggle-label" onClick={this.toggleDiscord}>Discord Settings</div>
					{discord}
				</div>
				<div className="non-config-element">
					<div className="backup-restore-toggle-label" onClick={this.toggleCustomSpooder}>Customize Spooder</div>
					{customSpooder}
				</div>
				<div className="backup-restore-toggle-label" onClick={this.toggleBackupRestore}>Backup/Restore</div>
				{backupRestore}
				<div className="non-config-element">
					<label>Default Tabs<p><br></br>
						Saved on selection for this browser only
						</p><br></br>
					<select onChange={this.setDefaultTabs} defaultValue={localStorage.getItem("defaulttabs")}>
						<option value="nodefault">No Defaults</option>
						<option value="rememberlast">Remember Last Tab and Mode</option>
						<option value="custom">Always Land on Tab</option>
					</select></label>
					{modeContainer}
					{tabOptionsContainer}
					{deckTabOptionsContainer}
				</div>
				{sections}
				<div className="save-commands"><button type="button" id="saveCommandsButton" className="save-button" onClick={this.saveConfig}>Save</button><div id="saveStatusText" className="save-status"></div></div>
				
			</form>
		);
	}
}

export {ConfigTab};


