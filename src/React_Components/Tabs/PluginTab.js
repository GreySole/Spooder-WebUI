import React from 'react';
import './PluginTab.css';
import '../PluginSettings/SettingsForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faTrash, faPlusCircle, faUpload, faSync, faSpider, 
	faFile, faDownload, faFileImport, faCircleInfo, faArrowLeft, faHouse, faArrowUp,
	faFolder,  faVolumeHigh, faImage, faCircleNotch, faTriangleExclamation} from '@fortawesome/free-solid-svg-icons';
import LinkButton from "../UI/LinkButton.js";
import SettingsForm from "../PluginSettings/SettingsForm.js";
import path from 'path-browserify';
import LoadingCircle from '../UI/LoadingCircle';
import DashedCircle from '../../icons/DashedCircle.svg';

window.settingsFrame = function(){
	return;
}

class PluginTab extends React.Component {
	constructor(props) {
		super(props);
		this.osc = props.osc;
		this.state = {
			stateLoaded:false
		};
		this.state["plugins"] = {};
		this.state["_udpClients"] = {};
		this.state["_openSettings"] = null;
		this.state["_openAssets"] = null;
		this.state["_openInfo"] = null;
		this.state["_assetFilePreview"] = null;
		this.state["_openCreate"] = {
			isOpen:false,
			pluginname:"",
			author:"",
			description:""
		};
		this.state["_fileProgressStatus"] = {};
		this.state["_fileProgressListeners"]= {};
		
		this.hiddenFileInput = React.createRef();
		this.hiddenAssetInput = React.createRef();
		this.onPluginChange = this.onPluginChange.bind(this);
		this.renderSettings = this.renderSettings.bind(this);
		//this.onSettingsFormSubmit = this.onSettingsFormSubmit.bind(this);
		this.deleteAsset = this.deleteAsset.bind(this);
		this.selectAsset = this.selectAsset.bind(this);

		this.deletePlugin = this.deletePlugin.bind(this);
		this.installNewPlugin = this.installNewPlugin.bind(this);

		this.onCreateFormInput = this.onCreateFormInput.bind(this);
		this.openCreatePlugin = this.openCreatePlugin.bind(this);
		this.createPlugin = this.createPlugin.bind(this);

		this.browseFolder = this.browseFolder.bind(this);
	}

	audioPreviewRef = React.createRef();

	handleFileClick = e => {
		this.hiddenFileInput.current.click();
	};

	handleAssetUploadClick = e => {
		let pluginName = e.currentTarget.getAttribute("plugin-name");
		document.querySelector("#input-file[plugin-name='"+pluginName+"']").click();
	}

	handleIconUploadClick = e => {
		let pluginName = e.currentTarget.getAttribute("plugin-name");
		console.log(e.currentTarget);
		document.querySelector("#input-icon[plugin-name='"+pluginName+"']").click();
	}

	refreshPlugins = async() => {
		let rStatus = await fetch('/refresh_plugins')
		.then(response=>response.json());
		this.reloadPlugins();
		document.querySelector(".plugin-element .save-status").textContent = rStatus.status;
		setTimeout(()=>{
			document.querySelector(".plugin-element .save-status").textContent = "";
		}, 5000);
	}

	refreshSinglePlugin = async(e) => {
		let rStatus = await fetch('/refresh_plugin?pluginname='+e.target.getAttribute("plugin-name"))
		.then(response=>response.json());
		this.reloadPlugins();
		document.querySelector(".plugin-element .save-status").textContent = rStatus.status;
		setTimeout(()=>{
			document.querySelector(".plugin-element .save-status").textContent = "";
		}, 5000);
	}

	componentDidMount(){
		fetch("/plugins")
		.then(response => response.json())
		.then(data => {
			
			this.setState(Object.assign(this.state, {stateLoaded:true, plugins:data, udpClients:this.props.parentState["udpClients"], _fileProgressListeners:newListeners}));
		})
		let newListeners = Object.assign(this.state._fileProgressListeners);
			newListeners.progress = this.osc.on("/frontend/plugin/install/progress", (message) => {
				let progressObj = JSON.parse(message.args[0]);
				
				let newPlugins = Object.assign({}, this.state.plugins);
				console.log("PROGRESS", newPlugins, this.state);
				newPlugins[progressObj.pluginName] = Object.assign(newPlugins[progressObj.pluginName], {
					status:progressObj.status,
					message:progressObj.message
				});
				this.setState(Object.assign(this.state, {plugins:newPlugins}));
			});

			newListeners.complete = this.osc.on("/frontend/plugin/install/complete", (message) => {
				let progressObj = JSON.parse(message.args[0]);
				console.log("COMPLETE", progressObj);
				let newPlugins = Object.assign({}, this.state.plugins);
				newPlugins[progressObj.pluginName] = Object.assign(newPlugins[progressObj.pluginName], {
					status:progressObj.status,
					message:progressObj.message
				});
				this.setState(Object.assign(this.state, {plugins:newPlugins}), 
				()=>{this.reloadPlugins(progressObj.pluginName)});
			});
		
	}

	componentWillUnmount(){
		if(this.state._fileProgressListeners.progress != null){
			this.osc.off("/frontend/plugin/install/progress", this.state._fileProgressListeners.progress);
			this.osc.off("/frontend/plugin/install/complete", this.state._fileProgressListeners.complete);
		}
	}

	componentDidUpdate() {
		//this.handleSettingsForms();
	}

	keyDown = e=>{
		console.log(e);
		if(e.ctrlKey==true && e.key == 's'){
			e.preventDefault();
			this.saveCommands();
		}
	}

	uploadPluginAsset = async (e) => {
		let assetPath = path.join(this.state._openAssets, this.state.plugins[this.state._openAssets].assetBrowserPath);
		var fd = new FormData();
		fd.append('file', e.target.files[0]);

		const requestOptions = {
			method: 'POST',
			body: fd
		};
		let uploadReq = await fetch('/upload_plugin_asset/'+assetPath, requestOptions)
			.then(response => response.json());
		let newState = Object.assign(this.state.plugins);
		
		newState[this.state._openAssets]["assets"] = uploadReq["newAssets"];
		this.setState(Object.assign(this.state, {plugins:newState}));
	}

	reloadPlugins = async (newplugin) => {
		console.log("RELOADING PLUGINS");
		const response = await fetch("/plugins");
		const pluginDataRaw = await response.json();

		let newState = {};
		newState = Object.assign(this.state);
		newState["plugins"] = pluginDataRaw;
		newState["_udpClients"] = this.state._udpClients;
		newState["_openSettings"] = null;
		newState["_openAssets"] = null;
		newState["_assetFilePreview"] = null;
		if(newplugin){
			this.setState(newState,()=>{

				window.setClass(document.querySelector("#"+newplugin), "new");
				document.querySelector("#"+newplugin).scrollIntoView(true);

			});
		}else{
			this.setState(newState);
		}
	}

	installNewPlugin = async (e) => {

		var fd = new FormData();
		fd.append('file', e.target.files[0]);
		//return;
		let internalName = e.target.files[0].name.split(".")[0].toLowerCase().replaceAll(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g,"").replaceAll(" ","_");
		if(this.state.plugins[internalName] != null){
			let overwrite = confirm("The plugin: "+internalName+" already exists. Do you want to overwrite it?");
			let rename = null;
			if(overwrite == false){
				rename = confirm("Would you rather install another copy of this plugin?");
			}
			if(overwrite == false && rename == false){
				return;
			}else if(overwrite == false && rename == true){
				let renameCount = 1;
				if(this.state.plugins[internalName] != null){
					while(this.state.plugins[internalName+renameCount] != null){
						if(this.state.plugins[internalName+renameCount] == null){
							internalName += renameCount;
							break;
						}else{
							renameCount++;
						}
					}
					if(this.state.plugins[internalName+renameCount] == null){
						internalName+=renameCount;
					}
				}
			}
		}
		
		
		fd.append("internalName", internalName);
		const requestOptions = {
			method: 'POST',
			body: fd
		};
		let installStatus = fetch('/install_plugin', requestOptions)
			.then(response => response.json())
			.then(data =>{
				if(data.status == false){
					alert("Installation failed: "+installStatus.message);
					return;
				}
			})

		

		let newPlugins = Object.assign({}, this.state.plugins);
		newPlugins[internalName] = {
			name: internalName,
			status:"start",
			message:"installing..."
		};
		this.setState(Object.assign(this.state, {plugins:newPlugins}),()=>{
			document.querySelector("#"+internalName).scrollIntoView(true);
		});
	}

	pluginInfo = (e) => {
		let plugin = e.target.closest(".plugin-entry").id;
		
		if(plugin == this.state._openInfo){
			this.setState(Object.assign(this.state, {"_openInfo":null}));
		}else{
			this.setState(Object.assign(this.state, {"_openSettings":null, "_openAssets":null, "_openInfo":plugin}),()=>{
				document.querySelector("#"+plugin).scrollIntoView(true);
			});
		}
	}

	pluginSettings = (e) => {
		let plugin = e.target.closest(".plugin-entry").id;
		if(plugin == this.state._openSettings){
			this.setState(Object.assign(this.state, {"_openSettings":null}));
		}else{
			this.setState(Object.assign(this.state, {"_openSettings":plugin, "_openAssets":null, "_openInfo":null}),()=>{
				document.querySelector("#"+plugin).scrollIntoView(true);
			});
		}
	}

	pluginAssets = (e) => {
		let plugin = e.target.closest(".plugin-entry").id;
		if(plugin == this.state._openAssets){
			this.setState(Object.assign(this.state, {"_openAssets":null}));
		}else{
			this.setState(Object.assign(this.state, {"_openAssets":plugin, "_openSettings":null, "_openInfo":null}),()=>{
				document.querySelector("#"+plugin).scrollIntoView(true);
			});
		}
	}

	savePlugin = async (pluginName, newData) => {
		
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
			body: JSON.stringify({ "pluginName": pluginName, "settings": newData })
		}

		let saveStatus = await fetch('/save_plugin', requestOptions)
			.then(response => response.json());
		document.querySelector("#" + pluginName + " .save-status").textContent = "Plugin saved!";
		setTimeout(function () {
			document.querySelector("#" + pluginName + " .save-status").textContent = "";
		}, 3000);
	}

	exportPlugin = async (e) => {
		let pluginID = e.target.closest(".plugin-entry").id;

		const requestOptions = {
			method: 'GET',
			headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
		}

		let pluginFile = await fetch('/export_plugin/'+pluginID);

	}

	onPluginChange(e) {
		let pluginName = e.target.closest(".plugin-entry").id;
		let varname = e.target.getAttribute("name");
		let varval = e.target.value;
		if(e.target.type == "checkbox"){
			varval = e.target.checked;
			window.setClass(e.target.parentElement, "checked", varval);
		}

		let thisPlugin = Object.assign(this.state.plugins)[pluginName];
		thisPlugin.settings[varname] = varval;
		this.setState({ [pluginName]: thisPlugin });
	}

	deletePlugin = (e) => {
		
		let pluginEl = e.target.closest(".plugin-entry");
		pluginEl.classList.add("deleting");
		let pluginID = pluginEl.id;
		let confirmation = window.confirm("Are you sure you want to delete "+pluginID+"?");
		if (confirmation == false) { return; }
		
		let currentPlugins = {...this.state.plugins};
		

		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
			body: JSON.stringify({ "pluginName": pluginID })
		}

		fetch('/delete_plugin', requestOptions)
			.then(response => response.json())
			.then(data=>{
				if (data.status == "SUCCESS") {
					pluginEl.classList.add("deleted");
					pluginEl.addEventListener("animationend", ()=>{
						currentPlugins[pluginID] = null;
						this.setState(Object.assign(this.state, {plugins:currentPlugins}));
					})
				}
			})
		
	}

	renderSettings(name, sForm) {

		let isOpen = name == this.state._openSettings;
		if(isOpen){
			if(sForm == null){

				window.settingsFrame = () => {
					console.log("SENDING SETTINGS");
					let thisSettings = Object.assign(this.state.plugins[this.state._openSettings]["settings"]);
					let udpClients = this.state._udpClients;
					let assets = this.state[this.state._openSettings]["assets"];
					thisSettings.isSettings = true;
					thisSettings.udpClients = udpClients;
					thisSettings.assets = assets;
					return thisSettings;
				}
				
				return <iframe id={name+"SettingsForm"} className='settings-form-html' src={window.location.origin+"/settings/"+name}></iframe>;
			}else{

				sForm.udpClients = this.state._udpClients;
				let values = this.state.plugins[this.state._openSettings]["settings"]!=null?this.state.plugins[this.state._openSettings]["settings"]:{};
				return <SettingsForm pluginName={name} data={sForm} saveSettings={this.savePlugin} values={Object.assign(values)}/>
			}
		}else{
			return null;
		}
	}

	selectAsset(e){
		let assetParent = e.target.closest(".plugin-entry");
		window.radioClass("selected", "#"+assetParent.id+" .asset-entry", e.target.closest(".asset-entry"));

		let assetName = e.target.closest(".asset-entry").id;

		
		let assetFilePreview = path.join(this.state.plugins[this.state._openAssets].assetBrowserPath, assetName);
		if(window.getMediaType(assetName) == "sound"){
			this.setState(Object.assign(this.state, {_assetFilePreview:assetFilePreview}),function(){
				this.audioPreviewRef.current.pause();
				this.audioPreviewRef.current.load();
		   });
			
		}else{
			this.setState(Object.assign(this.state, {_assetFilePreview:assetFilePreview}));
		}
		
	}

	async deleteAsset(e){
		let pluginName = this.state._openAssets;
		let assetName = this.state._assetFilePreview;

		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
			body: JSON.stringify({ "pluginName": pluginName, "assetName":assetName })
		}

		let deleteReq = await fetch('/delete_plugin_asset', requestOptions)
			.then(response => response.json());
		if (deleteReq.status == "SUCCESS") {
			let newPlugins = Object.assign(this.state.plugins);
			newPlugins[pluginName].assets = deleteReq.newAssets;
			this.setState(Object.assign(this.state, { plugins: newPlugins , _assetFilePreview:null}));
		}
	}

	async browseFolder(e){
		let folderPath = "";
		if(typeof e == "string"){
			if(e == "/"){
				folderPath = "/";
			}else{
				folderPath = path.join(this.state.plugins[this.state._openAssets].assetBrowserPath,e);
			}
			
		}else if(e == null){
			folderPath = path.join(this.state.plugins[this.state._openAssets].assetBrowserPath);
		}else{
			folderPath = path.join(this.state.plugins[this.state._openAssets].assetBrowserPath,e.currentTarget.id);
		}
		this.getAssets(this.state._openAssets, folderPath);
	}

	getAssets(name, folderPath){
		fetch("/browse_plugin_assets", {
			method:"POST",
			headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
			body: JSON.stringify({ pluginname:name, folder:folderPath })
		})
		.then(response => response.json())
		.then(data => {
			if(data.status == "ok"){
				let newPlugins = Object.assign({}, this.state.plugins);
				newPlugins[name].assetBrowserPath = folderPath;
				newPlugins[name].assets = data.dirs.sort((a,b)=>{
					const assetA = a.toUpperCase();
					const assetB = b.toUpperCase();
		
					if(assetA<assetB){
						return -1;
					}
		
					if(assetB>assetA){
						return 1
					}
		
					return 0;
				});
				this.setState(Object.assign(this.state, {plugins:newPlugins}));
			}
		})
		.catch(error => {
		})
	}

	renderAssetManager(name){
		let isOpen = name == this.state._openAssets;
		if(!isOpen){return null;}
		if(this.state.plugins[name].assets == null){
			this.getAssets(name, this.state.plugins[name].assetBrowserPath);
			return null;
		}
		
		if(isOpen){
			let pluginAssets = this.state.plugins[name].assets;
			let fileTable = [];
			let folderTable = [];
			for(let p in pluginAssets){
				let fileType = window.getMediaType(pluginAssets[p]);
				if(fileType == null){
					folderTable.push(
						<div className="asset-entry" key={pluginAssets[p]} id={pluginAssets[p]} onClick={this.selectAsset} onDoubleClick={this.browseFolder}><FontAwesomeIcon icon={faFolder} />{pluginAssets[p]}</div>
					);
					continue;
				}else if(fileType == "image"){
					fileType = <FontAwesomeIcon icon={faImage} />
				}else if(fileType == "sound"){
					fileType = <FontAwesomeIcon icon={faVolumeHigh} />
				}
				fileTable.push(
					<div className="asset-entry" key={pluginAssets[p]} id={pluginAssets[p]} onClick={this.selectAsset}>{fileType}{pluginAssets[p]}</div>
				);
			}

			let previewHTML = null;
			let previewAudio = null;
			if(this.state._assetFilePreview != null){
				if(window.getMediaType(this.state._assetFilePreview) == "sound"){
					previewAudio = path.join(this.state.plugins[name].assetPath,this.state._assetFilePreview);
				}else{
					previewHTML = window.getMediaHTML(path.join(this.state.plugins[name].assetPath,this.state._assetFilePreview));
				}
			}

			return <div className="asset-container">
					<div className="asset-buttons">
						<button className="asset-button upload"><FontAwesomeIcon icon={faArrowLeft} size="lg"/></button>
						<button className="asset-button" onClick={()=>{this.browseFolder("..")}}><FontAwesomeIcon icon={faArrowUp} size="lg" /></button>
						<button className="asset-button" onClick={()=>{this.browseFolder("/")}}><FontAwesomeIcon icon={faHouse} size="lg" /></button>
						<button className="asset-button refresh" onClick={()=>{this.browseFolder(null)}}><FontAwesomeIcon icon={faSync} size="lg" /></button>
					</div>
					<div className="asset-folder-text">
						{this.state.plugins[name].assetBrowserPath}
					</div>
					<div className="asset-select">
						<div className="asset-fileselect">
							{folderTable}
							{fileTable}
						</div>
						<div className="asset-preview">
							{previewHTML}
							<audio id="audioPreview" file={previewAudio} ref={this.audioPreviewRef} controls>
								<source src={previewAudio}></source>
							</audio>
						</div>
					</div>
					<div className="asset-buttons">
						<div className="asset-button upload" onClick={this.handleAssetUploadClick} plugin-name={name}>
							<FontAwesomeIcon icon={faUpload} size="lg" />
						</div>
						<div className="asset-button delete" onClick={this.deleteAsset}>
							<FontAwesomeIcon icon={faTrash} size="lg" />
						</div>
					</div>
				</div>
		}else{
			return null;
		}
	}

	replacePluginIcon = async (e) => {
		//let assetPath = path.join(this.state._openAssets, this.state.plugins[this.state._openAssets].assetBrowserPath);
		let pluginName = e.currentTarget.getAttribute("plugin-name");
		var fd = new FormData();
		fd.append('file', e.target.files[0]);

		const requestOptions = {
			method: 'POST',
			body: fd
		};
		let uploadReq = await fetch('/upload_plugin_icon/'+pluginName, requestOptions)
			.then(response => response.json());

			
		console.log(uploadReq);
		this.reloadPlugins();
		/*let newState = Object.assign(this.state.plugins);
		
		newState[this.state._openAssets]["assets"] = uploadReq["newAssets"];
		this.setState(Object.assign(this.state, {plugins:newState}));*/

	}

	renderInfoView(name){
		let isOpen = name == this.state._openInfo;
		
		if(isOpen){
			let dependenciesElements = null;
			let dependenciesElement = null;
			if(Object.keys(this.state.plugins[name].dependencies).length>0){
				dependenciesElements = [];
				for(let d in this.state.plugins[name].dependencies){
					dependenciesElements.push(
						<div className="info-dependencies-entry">
							{d}:{this.state.plugins[name].dependencies[d]}
						</div>
					)
				}
				dependenciesElement = <div className="info-dependencies">
										<label>Dependencies</label>
										{dependenciesElements}
										<div><label><button type="button" className="add-button" onClick={()=>this.reinstallPlugin(name)}>Reinstall Dependencies</button></label></div>
									</div>;
			}else{
				dependenciesElement = <div className="info-dependencies">
					<label>Dependencies</label>
					None
				</div>;
			}
			return <div className="info-container">
				
				<div className="info-description">
					<label>Description</label>
					{this.state.plugins[name].description}
				</div>
				{dependenciesElement}
				<div className="info-actions">
					<div className="add-button" onClick={this.refreshSinglePlugin} plugin-name={name}><FontAwesomeIcon icon={faSync} size="lg" /> Refresh</div>
					<div className="add-button" onClick={this.handleIconUploadClick} plugin-name={name}><FontAwesomeIcon icon={faImage} size="lg" /> Change Icon</div>
				</div>
			</div>
		}else{
			return null;
		}
	}

	imgError(el){
		el.preventDefault();
		window.setClass(el.target.closest(".plugin-entry-icon"), "default", true);
	}

	openCreatePlugin(){
		let newOpenCreate = Object.assign(this.state._openCreate);
		newOpenCreate.isOpen = !newOpenCreate.isOpen;
		this.setState(Object.assign(this.state, {_openCreate:newOpenCreate}));
	}

	createPlugin(e){
		
		e.preventDefault();

		let internalName = this.state._openCreate.pluginname.toLowerCase().replaceAll(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g,"").replaceAll(" ","_");
		let renameCount = 1;
		if(this.state.plugins[internalName] != null){
			while(this.state.plugins[internalName+renameCount] != null){
				if(this.state.plugins[internalName+renameCount] == null){
					internalName += renameCount;
					break;
				}else{
					renameCount++;
				}
			}
			if(this.state.plugins[internalName+renameCount] == null){
				internalName+=renameCount;
			}
		}
		
		
		fetch("/create_plugin", {
			method:"POST",
			headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
			body:JSON.stringify({
				internalName:internalName,
				pluginName: this.state._openCreate.pluginname,
				author:this.state._openCreate.author,
				description:this.state._openCreate.description
			})
		}).then(async data=>{
			let json = await data.json();
			if(json.status == "error"){
				console.log(json.error);
				return;
			}
		});
		
		let newPlugins = Object.assign({}, this.state.plugins);
		newPlugins[internalName] = {
			name: this.state._openCreate.pluginname,
			author:this.state._openCreate.author,
			description:this.state._openCreate.description,
			status:"start",
			message:"installing..."
		};
		
		let newOpenCreate = {
			isOpen:false,
			pluginname:"",
			author:"",
			description:""
		}
		this.setState(Object.assign(this.state, {plugins:newPlugins, _openCreate:newOpenCreate}),()=>{
			document.querySelector("#"+internalName).scrollIntoView(true);
		});
	}

	async reinstallPlugin(name){

		fetch("/reinstall_plugin?pluginname="+name)
		.then(response => response.json())
		.then(data =>{
			if(data.status == "ok"){
				this.reloadPlugins();
			}
		});
		let newPlugins = Object.assign({}, this.state.plugins);
		newPlugins[name].status = "reinstall";
		newPlugins[name].message = "Reinstalling dependencies...";
		this.setState(Object.assign(this.state, {plugins:this.state.plugins}));
	}

	onCreateFormInput(e){
		let newOpenCreate = Object.assign(this.state._openCreate);
		newOpenCreate[e.target.name] = e.target.value;
		this.setState(Object.assign(this.state, {_openCreate:newOpenCreate}));
	}

	render() {
		if(this.state.stateLoaded == false){
			return <LoadingCircle></LoadingCircle>
		}
		let pluginList = [];
		let sortedPluginKeys = Object.keys(this.state.plugins).sort();
		if(sortedPluginKeys.length == 0){
			pluginList.push(
			<div className="no-plugins-div">
				<h1>No plugins yet, get an Alert Toaster!</h1>
				<p>
					Alert Toaster has slide in alerts for Spooder, Twitch, and any plugin that calls /spooder/alert on OSC.
					Get an alert when someone triggers a chat command or get alerts when something crashes on Spooder...including Spooder itself.
				</p>
					<LinkButton mode="newtab" text="Get the Latest Release" link={"https://github.com/GreySole/Spooder-AlertToaster/releases/tag/latest"} />
			</div>
			)
		}else{
			for (let sp in sortedPluginKeys) {
				let p = sortedPluginKeys[sp];
				if(p.startsWith("_") || this.state.plugins[p] == null){continue;}
				let pluginLinks = [];
				if(this.state.plugins[p].hasOverlay){
					pluginLinks.push(
						<LinkButton name={p+"-overlay"} text={"Copy Overlay URL"} mode="copy" link={window.location.origin+"/overlay/"+p} />
					)
				}
				if(this.state.plugins[p].hasUtility){
					pluginLinks.push(<LinkButton name={p+"-utility"} text={"Open Utility"} mode="newtab" link={window.location.origin+"/utility/"+p} />);
				}
				if(this.state.plugins[p].status){
					if(this.state.plugins[p].status == "failed"){
						pluginList.push(
							<div className="plugin-entry" key={p} id={p}>
								<div className="plugin-entry-ui">
									<div className="plugin-entry-icon">
										<FontAwesomeIcon className="plugin-status-icon" icon={faTriangleExclamation} size="lg"/>
									</div>
									<div className="plugin-entry-info">
										<div className="plugin-entry-title">{this.state.plugins[p].name}<div className="plugin-entry-subtitle">{"by "+this.state.plugins[p].author}</div></div>
										<div className="plugin-entry-subtitle">
											{this.state.plugins[p].message}
										</div>
									</div>
									<div className="plugin-button-ui">
										
										<div className="plugin-button info" onClick={this.pluginInfo}><FontAwesomeIcon icon={faCircleInfo} size="lg" /></div>
										<div className="plugin-button delete" onClick={this.deletePlugin}><FontAwesomeIcon icon={faTrash} size="lg" /></div>
									</div>
								</div>
								<div className="plugin-info-view">
									{this.renderInfoView(p)}
								</div>
							</div>
						);
					}else{
						pluginList.push(
							<div className="plugin-entry" key={p} id={p}>
								<div className="plugin-entry-ui">
									<div className="plugin-entry-icon spinning">
										<img className="plugin-status-icon" src={DashedCircle} height="75px"/>
									</div>
									<div className="plugin-entry-info">
										<div className="plugin-entry-title">{this.state.plugins[p].name}<div className="plugin-entry-subtitle">{"by "+this.state.plugins[p].author}</div></div>
										<div className="plugin-entry-subtitle">
											{this.state.plugins[p].message}
										</div>
									</div>
									
								</div>
							</div>
						);
					}
					
	
				}else{
					pluginList.push(
						<div className="plugin-entry" key={p} id={p}>
							<div className="plugin-entry-ui">
								<div className="plugin-entry-icon">
									<img src={window.location.origin + "/icons/"+p+".png"} onError={this.imgError} />
									<FontAwesomeIcon icon={faSpider} size="lg" className="plugin-default-icon"/>
								</div>
								<div className="plugin-entry-info">
									<div className="plugin-entry-title">{this.state.plugins[p].name}<div className="plugin-entry-subtitle">{this.state.plugins[p].version+" by "+this.state.plugins[p].author}</div></div>
									<div className="plugin-entry-links">
										{pluginLinks}
									</div>
								</div>
								<div className="plugin-button-ui">
									
									<div className="plugin-button info" onClick={this.pluginInfo}><FontAwesomeIcon icon={faCircleInfo} size="lg" /></div>
									<div className="plugin-button settings" onClick={this.pluginSettings}><FontAwesomeIcon icon={faCog} size="lg" /></div>
									<div className="plugin-button upload" onClick={this.pluginAssets}><FontAwesomeIcon icon={faFile} size="lg" plugin-name={p} /></div>
									<a className="link-override" href={"/export_plugin/"+p} download={p+".zip"}><div className="plugin-button export"><FontAwesomeIcon icon={faDownload} size="lg" plugin-name={p} /></div></a>
									<div className="plugin-button delete" onClick={this.deletePlugin}><FontAwesomeIcon icon={faTrash} size="lg" /></div>
									<input type='file' id='input-file' plugin-name={p} onChange={this.uploadPluginAsset} style={{ display: 'none' }} />
									<input type='file' id='input-icon' plugin-name={p} onChange={this.replacePluginIcon} style={{ display: 'none' }} />
								</div>
							</div>
							<div className="plugin-info-view">
								{this.renderInfoView(p)}
							</div>
							<div className="plugin-entry-settings">
								{this.renderSettings(p, this.state.plugins[p].hasExternalSettingsPage?null:this.state.plugins[p]['settings-form'])}
							</div>
							<div className="plugin-asset-manager">
								{this.renderAssetManager(p)}
							</div>
						</div>
					);
				}
			}
		}
		

		let createPlugin = this.state._openCreate.isOpen?<div className="plugin-create-element">
			<form onSubmit={this.createPlugin}>
				<label>Name
					<input type="text" name='pluginname' onChange={this.onCreateFormInput}/>
				</label>
				<label>Author
					<input type="text" name='author' onChange={this.onCreateFormInput}/>
				</label>
				<label>Description
					<input type="text" name='description' onChange={this.onCreateFormInput}/>
				</label>
				<button type="submit" id="createPluginButton" className="save-button">Create</button>
			</form>
		</div>:null;

		return (<div className="plugin-element">
			<div className="plugin-install-button">
				<label>
					<button onClick={this.openCreatePlugin}>Create Plugin <FontAwesomeIcon icon={faPlusCircle} size="lg" /></button>
				</label>
				<label htmlFor='input-file'>
					<button onClick={this.handleFileClick}>Install Plugin <FontAwesomeIcon icon={faFileImport} size="lg" /></button>
				</label>
				<div className="save-div"><button onClick={this.refreshPlugins}>Refresh All Plugins <FontAwesomeIcon icon={faSync} size="lg" /></button><div className="save-status"></div></div>
				<input type='file' id='input-file' ref={this.hiddenFileInput} onChange={this.installNewPlugin} style={{ display: 'none' }} />
			</div>
			{createPlugin}
			<div className="plugin-list">{pluginList}</div></div>);
	}
}

export { PluginTab };