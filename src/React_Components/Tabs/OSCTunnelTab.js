import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import LoadingCircle from '../UI/LoadingCircle';

var plugins = {};

class OSCTunnelTab extends React.Component{
	constructor(props){
		super(props);
		this.state ={
			stateLoaded:false,
			tunnels:Object.assign({},props.data),
			addVar:{
				"handlerFrom":"",
				"handlerTo":"",
				"addressFrom":"",
				"addressTo":"",
				"clientTo":""
			},
			udpClients:{},
			plugins:[]
		};
		
		this.handleChange = this.handleChange.bind(this);
		this.handleAddOSCVarChange = this.handleAddOSCVarChange.bind(this);
		this.handleAddOSCVar = this.handleAddOSCVar.bind(this);
		this.saveTunnels = this.saveTunnels.bind(this);
		this.deleteOSCVar = this.deleteOSCVar.bind(this);
		//udpClients = Object.assign(props._udpClients);
		//plugins = Object.assign(props._plugins);
	}

	componentDidMount(){
		fetch("/osc_tunnels")
		.then(response => response.json())
		.then(data => {
			console.log("TUNNELS", this.props.parentState);
			window.addEventListener("keydown", this.keyDown)
			this.setState(Object.assign({}, {
				stateLoaded:true,
				tunnels:data,
				udpClients:this.props.parentState.udp_clients ?? {},
				plugins:this.props.parentState.plugins ?? []
			}))
		})
	}

	componentWillUnmount(){
		window.removeEventListener("keydown", this.keyDown)
	}

	keyDown = e=>{
		console.log(e);
		if(e.ctrlKey==true && e.key == 's'){
			e.preventDefault();
			this.saveCommands();
		}
	}
	
	handleChange(s){
		
		let name = s.target.name;
		let section = s.target.getAttribute("varname");
		let newTunnels = Object.assign({}, this.state.tunnels);
		
		newTunnels[section][name] = s.target.value;
		this.setState(Object.assign(this.state,{tunnels:newTunnels}));
	}

	handleAddOSCVarChange(s){
		let newAddVar = Object.assign({}, this.state.addVar);
		newAddVar[s.target.name] = s.target.value;
		//console.log(s.target.name);
		this.setState(Object.assign(this.state, {addVar:newAddVar}));
	}
	
	handleAddOSCVar(){
		let name = window.$(".add-osc-var [name='name']").value;
		
		let newVar = Object.assign({},this.state.addVar);
		let newTunnels = Object.assign({}, this.state.tunnels);
		newTunnels[name] = newVar;
		
		
		this.setState(Object.assign(this.state,{tunnels:newTunnels}));
	}
	
	saveTunnels(){
		let newList = Object.assign(this.state.tunnels);
		
		const requestOptions = {
			method: 'POST',
			headers: {'Content-Type': 'application/json', 'Accept':'application/json'},
			body: JSON.stringify(newList)
		};
		
		fetch('/saveOSCTunnels', requestOptions)
		.then(response => response.json())
		.then(data => {
			if(data.status == "SAVE SUCCESS"){
				this.props.setToast("TUNNELS SAVED!", "save");
				document.querySelector("#saveStatusText").textContent = "Save success!";
				setTimeout(()=>{
					document.querySelector("#saveStatusText").textContent = "";
				}, 5000)
			}else{
				document.querySelector("#saveStatusText").textContent = "Error: "+data.status;
			}
		});
	}

	deleteOSCVar(e){
		let el = e.currentTarget.closest(".config-variable");

		let varname = el.getAttribute("varname");

		let oscVars = Object.assign(this.state.tunnels);
		delete oscVars[varname];

		this.setState(Object.assign(this.state, {tunnels:oscVars}));
	}
	
	
	render(){
		if(this.state.stateLoaded == false){
			return <LoadingCircle></LoadingCircle>
		}
		let table = [];
		console.log(this.state);
		let oscTrashButton = <FontAwesomeIcon icon={faTrash} size="lg" className="delete-button" onClick={this.deleteOSCVar} />;

		let clientTable = [];

		for(let u in this.state.udpClients){
			clientTable.push(<option value={u}>{this.state.udpClients[u].name}</option>);
		}

		let pluginTable = [];

		for(let p in this.state.plugins){
			pluginTable.push(<option value={this.state.plugins[p]}>{this.state.plugins[p]}</option>);
		}

		var tunnels = this.state.tunnels;
		table = [];
		for(let s in tunnels){
			
			let clientElementTo = <select name="clientTo"  varname={s}  defaultValue={tunnels[s]["clientTo"]} onChange={this.handleChange}>
			{clientTable}
			</select>;
			let pluginElementTo = <select name="clientTo"  varname={s}  defaultValue={tunnels[s]["clientTo"]} onChange={this.handleChange}>
				{pluginTable}
			</select>;
			//for(let ss in tunnels[s]){
				table.push(<div className="config-variable" key={s} varname={s}>
								
								<div className="config-variable-ui">
									<label>{s}</label>
									<label>Handler From
										<select name="handlerFrom" varname={s}  defaultValue={tunnels[s]["handlerFrom"]} onChange={this.handleChange}>
											<option value="tcp">TCP (Overlays)</option>
											<option value="udp">UDP</option>
										</select>
									</label>
									<label>Handler To
										<select name="handlerTo" varname={s} defaultValue={tunnels[s]["handlerTo"]} onChange={this.handleChange}>
											<option value="tcp">TCP (Overlays)</option>
											<option value="plugin">Plugin</option>
											<option value="udp">UDP</option>
										</select>
										{tunnels[s]["handlerTo"]=="udp"?clientElementTo:null}
										{tunnels[s]["handlerTo"]=="plugin"?pluginElementTo:null}
									</label>
									<label>Address From:
										<input name="addressFrom" type="text" varname={s}  defaultValue={tunnels[s]["addressFrom"]} placeholder="OSC Address From" onChange={this.handleChange} />
									</label>
									<label>Address To:
										<input name="addressTo" type="text" varname={s}  defaultValue={tunnels[s]["addressTo"]} placeholder="OSC Address To" onChange={this.handleChange} />
									</label>
								</div>
								<div className="config-variable-buttons">{oscTrashButton}</div>
							</div>);
			//}
			
			
			//sections.push(<div className="config-element" name={s}><label>{this.state[s]["sectionname"]}</label>{table}</div>);
		}

		let addClientElementTo = <select name="clientTo" defaultValue={this.state.addVar["clientTo"]} onChange={this.handleAddOSCVarChange}>
			{clientTable}
		</select>;
		let addPluginElementTo = <select name="clientTo" defaultValue={this.state.addVar["clientTo"]} onChange={this.handleAddOSCVarChange}>
			{pluginTable}
		</select>;
		table.push(<div className="add-osc-var">
				<div className="config-variable">
					<label>Name:<input type="text" name="name" placeholder="Name" /></label>
					<label>Handler From
						<select name="handlerFrom" defaultValue={this.state.addVar["handlerFrom"]} onChange={this.handleAddOSCVarChange}>
							<option value="tcp">TCP (Overlays)</option>
							<option value="udp">UDP</option>
						</select>
					</label>
					<label>Handler To
						<select name="handlerTo" defaultValue={this.state.addVar["handlerTo"]} onChange={this.handleAddOSCVarChange}>
							<option value="tcp">TCP (Overlays)</option>
							<option value="plugin">Plugin</option>
							<option value="udp">UDP</option>
						</select>
						{this.state.addVar["handlerTo"]=="udp"?addClientElementTo:null}
						{this.state.addVar["handlerTo"]=="plugin"?addPluginElementTo:null}
					</label>
					<label>Address From:<input type="text" name="addressFrom" placeholder="OSC Address From" defaultValue={this.state.addVar["addressFrom"]} onChange={this.handleAddOSCVarChange}/></label>
					<label>Address To:<input type="text" name="addressTo" placeholder="OSC Address To" defaultValue={this.state.addVar["addressTo"]} onChange={this.handleAddOSCVarChange}/></label>
				</div>
				<button type="button" className="add-button" onClick={this.handleAddOSCVar}>Add</button></div>);
		
		return (
			<form className="config-tab">
				{table}
				<div className="save-commands"><button type="button" id="saveTunnelsButton" className="save-button" onClick={this.saveTunnels}>Save</button><div id="saveStatusText" className="save-status"></div></div>
			</form>
		);
	}
}

export {OSCTunnelTab};


