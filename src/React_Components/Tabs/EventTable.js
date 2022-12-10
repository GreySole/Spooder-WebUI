import React, { createRef } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash, faAward, faCommentDots, faNetworkWired, faCaretDown, faCaretUp} from '@fortawesome/free-solid-svg-icons';
import BoolSwitch from '../UI/BoolSwitch.js';

class EventTable extends React.Component{

	constructor(props){
		super(props);
		this.state = {};
		if(props.data == null){
			this.state.events = {};
		}else{
			this.state.events = Object.assign(props.data);
		}
		
		//Auto-fix/upgrade events to current structure
		for(let e in this.state.events){
			for(let ev in this.eventStructure){
				if(ev == "triggers"){

					for(let t in this.eventStructure[ev]){
						if(this.state.events[e][ev][t] == null){
							this.state.events[e][ev][t] = this.eventStructure[ev][t];
						}else{
							for(let tt in this.eventStructure[ev][t]){
								if(this.state.events[e][ev][t][tt] == null){
									this.state.events[e][ev][t][tt] = this.eventStructure[ev][t][tt];
								}
							}
						}
					}

				}else if(ev == "commands"){

					for(let c in this.state.events[e][ev]){
						
						for(let co in this.eventStructure[ev][this.state.events[e][ev][c].type]){
							if(this.state.events[e][ev][c][co] == null){
								this.state.events[e][ev][c][co] = this.eventStructure[ev][this.state.events[e][ev][c].type][co];
							}
						}
					}

				}else{
					if(this.state.events[e][ev] == null){
						this.state.events[e][ev] = this.eventStructure[ev];
					}
				}
			}
		}
		
		if(props.groups == null){
			this.state.groups = ['Default'];
		}else{
			this.state.groups = props.groups;
		}
		this.state._udpClients = props._udpClients;
		this.state._plugins = props._plugins;
		this.state._obs = props._obs;
		
		this.handleChange = this.handleChange.bind(this);
		this.addCommand = this.addCommand.bind(this);
		this.addEvent = this.addEvent.bind(this);
		this.addGroup = this.addGroup.bind(this);
		this.saveCommands = this.saveCommands.bind(this);
		this.deleteCommand = this.deleteCommand.bind(this);
		this.deleteEvent = this.deleteEvent.bind(this);
		this.deleteGroup = this.deleteGroup.bind(this);
		this.getCustomRewards = this.getCustomRewards.bind(this);
		this.checkEventTaken = this.checkEventTaken.bind(this);

		this.arrangeCommands = this.arrangeCommands.bind(this);
		this.checkCommandConflicts = this.checkCommandConflicts.bind(this);

		this.dragItem = createRef();
		this.dragOverItem = createRef();
		
		
	}

	eventStructure = {
		name:"",
		description:"",
		group:"Default",
		cooldown:60,
		chatnotification:false,
		cooldownnotification:false,
		triggers:{
			chat:{
				enabled:false,
				search:false,
				command:""
			},
			redemption:{
				enabled:false,
				reward:"",
				override:false
			},
			osc:{
				enabled:false,
				handle:"trigger",
				address:"/",
				type:"single",
				condition:"==",
				value:"0",
				condition2:"==",
				value2:"0"
			}
		},
		commands:{
			response:{
				message:"",
				delay:0
			},
			plugin:{
				pluginname:"",
				eventname:"",
				delay:0
			},
			software:{
				type:"software",
				etype:"timed",
				dest_udp:"-1",
				address:"",
				valueOn:"1",
				valueOff:"0",
				duration:60,
				delay:0,
				priority:0
			},
			obs:{
				type:"obs",
				function:"setinputmute",
				etype:"timed",
				scene:"",
				item:"",
				valueOn:1,
				valueOff:0,
				itemOn:"",
				itemOff:"",
				duration:60,
				delay:0
			},
			mod:{
				type:"mod",
				function:"lock",
				targettype:"event",
				target:"",
				etype:"toggle",
				duration:60,
				delay:0
			}
		}
	}

	componentDidMount(){
		this.getCustomRewards();
	}
	
	handleChange(e){
		let eventName = e.target.closest(".command-element").id;
		let isCommand = e.target.closest(".command-fields") != null;
		let isTrigger = e.target.closest(".command-props.triggers") != null;

		let newState = Object.assign(this.state.events);
		if(isCommand){
			let commandIndex = e.target.closest(".command-fields").getAttribute("commandindex");
			let varname = e.target.name;
			if(e.target.type == "checkbox"){
				newState[eventName].commands[commandIndex][varname] = e.target.checked;
			}else{
				newState[eventName].commands[commandIndex][varname] = e.target.value;
			}
			
		}else if(isTrigger){
			
			let varname = e.target.name;
			let triggerType = e.target.closest("[triggertype]").getAttribute("triggertype");
			if(newState[eventName].triggers[triggerType] == null){
				newState[eventName].triggers[triggerType] = {};
			}
			
			if(e.target.type == "checkbox"){
				newState[eventName].triggers[triggerType][varname] = e.target.checked;
			}else{
				newState[eventName].triggers[triggerType][varname] = e.target.value;
			}
			
		}else{
			let varname = e.target.name;
			if(e.target.type == "checkbox"){
				newState[eventName][varname] = e.target.checked;
			}else{
				newState[eventName][varname] = e.target.value;
			}
			
		}
		
		this.setState(Object.assign(this.state,{events:newState}));
	}

	addGroup(e){
		let newGroup = e.target.closest(".add-command-actions").querySelector("[name='groupname']").value;

		let newGroups = Object.assign(this.state.groups);
		newGroups.push(newGroup);
		this.setState(Object.assign(this.state,{groups:newGroups}));
	}

	addEvent(e){
		let newKey = e.currentTarget.previousElementSibling.value;
		let eventGroup = e.currentTarget.getAttribute("groupname");

		let newEvent = {
			"name":newKey,
			"description":"",
			"group":eventGroup,
			"cooldown":0,
			"chatnotification":false,
			"cooldownnotification":false,
			"triggers":{
				"chat":{"enabled":true, "command":"!"+newKey},
				"redemption":{"enabled":false, "id":"", override:false},
				"osc":{"enabled":false, "address":"/", "type":"single","condition":"==", "value":0, "condition2":"==", "value2":0}
			},
			"commands":[]
		};

		let newState = Object.assign(this.state.events);
		newState[newKey] = newEvent;
		this.setState(Object.assign(this.state,{events:newState}));
	}
	
	addCommand(e){
		let eventName = e.target.getAttribute("eventname");
		let commandType = document.querySelector("#"+eventName+" .add-command [name='type']").value;
		let newCommand = {};
		switch(commandType){
			case 'response':
				newCommand = {
					type:"response",
					enabled:true,
					search:false,
					command:"return event.username+' has triggered this command!';",
					delay:0
				};
			break;
			case 'plugin':
				newCommand = {
					type:"plugin",
					pluginname:"",
					eventname:"",
					delay:0
				};
			break;
			case 'software':
				newCommand = {
					type:"software",
					etype:"timed",
					dest_udp:"-1",
					address:"/",
					valueOn:1.0,
					valueOff:0.0,
					duration:60,
					delay:0,
					priority:0
				};
			break;
			case 'obs':
				newCommand = {
					type:"obs",
					function:"setinputmute",
					etype:"timed",
					scene:"",
					item:"",
					valueOn:1,
					valueOff:0,
					itemOn:"",
					itemOff:"",
					duration:60,
					delay:0
				}
			break;
			case 'mod':
				newCommand = {
					type:"mod",
					function:"lock",
					targettype:"event",
					target:"",
					etype:"toggle",
					duration:60,
					delay:0
				}
			break;
		}
		
		
		let newState = Object.assign(this.state.events);
		if(newState[eventName].commands == null){newState[eventName].commands = [];}
		newState[eventName].commands.push(newCommand);
		this.setState(Object.assign(this.state,{events:newState}));
	}
	
	saveCommands(){
		let newEvents = Object.assign(this.state.events);
		for(let c in newEvents){
			for(let n in newEvents[c]){
				if(!isNaN(newEvents[c][n]) && typeof newEvents[c][n] != 'boolean'){
					newEvents[c][n] = parseFloat(newEvents[c][n]);
				}
			}
		}
		//let eventElements = document.querySelectorAll(".command-element");
		for(let e in newEvents){
			newEvents[e].group = document.querySelector("#"+e+" [name='group']").value;
		}

		let newList = {
			"events":newEvents,
			"groups":this.state.groups
		};
		
		const requestOptions = {
			method: 'POST',
			headers: {'Content-Type': 'application/json', 'Accept':'application/json'},
			body: JSON.stringify(newList)
		};
		fetch('/saveCommandList', requestOptions)
		.then(response => response.json())
		.then(data => {
			if(data.status == "SAVE SUCCESS"){
				document.querySelector("#saveStatusText").textContent = "Commands are saved!";
				setTimeout(()=>{
					document.querySelector("#saveStatusText").textContent = "";
				}, 5000)
			}else{
				document.querySelector("#saveStatusText").textContent = "Error: "+data.status;
			}
		});
	}
	
	deleteCommand(e){
		
		let eventName = e.target.closest(".command-element").id;
		let cIndex = e.target.closest(".command-fields").getAttribute("commandindex");
		let newEvents = Object.assign(this.state.events);
		
		newEvents[eventName].commands.splice(cIndex,1);
		
		this.setState(Object.assign(this.state,{events:newEvents}));
	}

	deleteEvent(e){
		let eventName = e.target.closest(".command-element").id;
		window.setClass(e.target.closest(".command-element"), "expanded", false);
		window.setClass(e.target.closest(".command-section"), "hidden", true);
		
		let newState = Object.assign(this.state.events);
		delete newState[eventName];

		this.setState(Object.assign(this.state, {events:newState}));
	}

	deleteGroup(groupName){
		if(confirm("All events assigned to this group will be deleted. Is that okay?")){
			let newEvents = Object.assign(this.state.events);
			let newGroups = Object.assign(this.state.groups);
			for(let ev in newEvents){
				if(newEvents[ev].group == groupName){
					delete newEvents[ev];
				}
			}
			newGroups.splice(newGroups.indexOf(groupName),1);
			this.setState(Object.assign(this.state, {groups:newGroups,events:newEvents}));
		}
	}
	
	toggleProps(e){
		
		let topElement = e.currentTarget.closest(".command-element");
		let middleElement = topElement.querySelector(".command-key");
		let element = topElement.querySelector(".command-section");

		window.toggleClass(topElement, "expanded");
		window.toggleClass(middleElement, "expanded");
		window.toggleClass(element, "hidden");
	}

	toggleGroup(e){
		let element = e.currentTarget.closest(".command-group").querySelector(".command-group-content");
		window.toggleClass(element, "hidden");
		window.toggleClass(e.currentTarget.closest(".command-group"), "expanded");
	}
	
	sortList() {
	  var list, i, switching, b, shouldSwitch;
	  list = document.getElementById("id01");
	  switching = true;
	  /* Make a loop that will continue until
	  no switching has been done: */
	  while (switching) {
		// Start by saying: no switching is done:
		switching = false;
		b = list.getElementsByTagName("LI");
		// Loop through all list items:
		for (i = 0; i < (b.length - 1); i++) {
		  // Start by saying there should be no switching:
		  shouldSwitch = false;
		  /* Check if the next item should
		  switch place with the current item: */
		  if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
			/* If next item is alphabetically lower than current item,
			mark as a switch and break the loop: */
			shouldSwitch = true;
			break;
		  }
		}
		if (shouldSwitch) {
		  /* If a switch has been marked, make the switch
		  and mark the switch as done: */
		  b[i].parentNode.insertBefore(b[i + 1], b[i]);
		  switching = true;
		}
	  }
	}

	async verifyResponseScript(e){
		e.preventDefault();
		let parentEl = e.target.closest(".command-props");
		let responseEl = parentEl.querySelector("[name='message']");
		let outputEl = parentEl.querySelector(".response-code-output");
		let inputEl = parentEl.querySelector(".response-code-input");
		let inputMessage = inputEl.value==""?"TestMessage":inputEl.value;
		let responseScript = responseEl.value;

		//Usually event.username is the uncapitalized version of a username.
		//Spooder replaces this with the capitalized version in runCommands()
		let testEvent = {  
			timestamp: "2022-05-05T17:06:31.505Z",
			command: 'PRIVMSG',
			event: 'PRIVMSG',
			channel: '#testchannel',
			username: 'testchannel',
			displayName: 'TestChannel',
			message: inputMessage,
			tags: {
			  badgeInfo: 'subscriber/1',
			  badges: { broadcaster: true, subscriber: 0 },
			  clientNonce: '00000000000000000000000000000000',
			  color: '#1E90FF',
			  displayName: 'TestChannel',
			  emotes: [],
			  firstMsg: '0',
			  flags: '',
			  id: '00000000-0000-0000-0000-000000000000',
			  mod: '0',
			  roomId: '000000000',
			  subscriber: '1',
			  tmiSentTs: '0000000000000',
			  turbo: '0',
			  userId: '000000000',
			  userType: '',
			  bits: undefined,
			  emoteSets: [],
			  username: 'testchannel',
			  isModerator: false
			}
		  }
		  

		try{
			let responseFunct = eval("async () => { let event = "+JSON.stringify(testEvent)+"; let extra= "+JSON.stringify(testEvent)+"; "+responseScript.replace(/\n/g, "")+"}");
			let response = await responseFunct();
			console.log("SCRIPT RAN SUCCESSFULLY:",response);
			outputEl.textContent = response;
			window.setClass(outputEl, "verified", true);
			window.setClass(outputEl, "failed", false);
		}catch(e){
			console.log("SCRIPT FAILED", e);
			outputEl.textContent = e;
			window.setClass(outputEl, "verified", false);
			window.setClass(outputEl, "failed", true);
		}
		
		
	}

	checkEventTaken(e){
		e.target.value = e.target.value.replace(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/,"").replace(" ", "_");
		if(Object.keys(this.state.events).includes(e.target.value)){
			window.setClass(e.target, "error", true);
		}else{
			window.setClass(e.target, "error", false);
		}
		
	}

	checkCommandConflicts(eventName, commandIndex){
		let eventConflicts = [];
		let events = this.state.events;
		let checkAddress = events[eventName].commands[commandIndex].address;
		let checkValue = events[eventName].commands[commandIndex].valueOn;
		for(let e in events){
			for(let c in events[e].commands){
				if(e==eventName && c==commandIndex){continue;}
				if(events[e].commands[c].type =="software"){
					if(events[e].commands[c].address == checkAddress){
						if(isNaN(checkValue) && isNaN(events[e].commands[c].valueOn)){
							if(checkValue.includes(",")){
								if(events[e].commands[c].valueOn.includes(",")){
									if(events[e].commands[c].valueOn.split(",")[0] == checkValue.split(",")[0]){
										eventConflicts.push(e+c);
									}
								}
							}else{
								eventConflicts.push(e+c);
							}
						}
					}
				}
			}
		}

		return eventConflicts;
	}

	async getCustomRewards(){
		let rewardsRaw = await fetch('/get_channelpoint_rewards')
		.then(response => response.json());

		if(rewardsRaw.message == 'OAuth token is missing'){
			console.log("You need to set a broadcaster oauth token to get custom rewards. \
			If you're logged into chat with a bot account, you will need to log out of Twitch.tv and log in as your broadcaster.\
			Authorize the broadcaster account here. Then go to the Config tab and click 'Save Oauth to Broadcaster.'\
			Log out of Twitch and back in as the bot account. Close Spooder and run again with 'npm run start-noautologin'\
			Then you can authorize your bot account as the main token and keep the broadcaster token on file.");
		}

		let rewards = rewardsRaw.data;
		let newState = Object.assign(this.state);
		newState._rewards = rewards;
		this.setState(newState);
	}

	arrangeCommands(e){
		let eventName = e.currentTarget.closest(".command-element").id;
		let direction = e.currentTarget.getAttribute("direction");
		let commandIndex = parseInt(e.currentTarget.closest(".command-fields").getAttribute("commandindex"));
		let newEvents = Object.assign(this.state.events);
		if(direction == "up"){
			if(commandIndex<=0){return;}
			newEvents[eventName].commands[commandIndex] = newEvents[eventName].commands.splice(commandIndex-1, 1, newEvents[eventName].commands[commandIndex])[0];
		}else{
			if(commandIndex>=newEvents[eventName].commands.length-1){return;}
			newEvents[eventName].commands[commandIndex] = newEvents[eventName].commands.splice(commandIndex+1, 1, newEvents[eventName].commands[commandIndex])[0];
		}

		this.setState(Object.assign(this.state, {events:newEvents}))
	}
	
	render(){
		
		let udpHostOptions = [];
		//console.log(this.state._udpClients);
		if(this.state._udpClients != null){
			if(Object.keys(this.state._udpClients).length > 0){
				for(let u in this.state._udpClients){
					udpHostOptions.push(
						<option value={u}>{this.state._udpClients[u].name}</option>
					)
				}
			}
		}

		let rewardOptions = [<option value="">Select a reward</option>];
		if(this.state._rewards != null){
			let rewards = this.state._rewards;
			for(let r in rewards){
				rewardOptions.push(
					<option value={rewards[r].id}>{rewards[r].title}</option>
				)
			}
		}

		let pluginOptions = [];
		if(this.state._plugins != null){
			let plugins = this.state._plugins;
			let sortedPlugins = Object.values(plugins).sort();
			for(let p in sortedPlugins){
				pluginOptions.push(
					<option value={sortedPlugins[p]}>{sortedPlugins[p]}</option>
				)
			}
		}

		let trashButton = <FontAwesomeIcon icon={faTrash} size="lg" className="delete-button" onClick={this.deleteCommand} />;

		var groups = this.state.groups;
		let groupObjects = [];

		let groupOptions = [];
		for(let g in groups){
			groupObjects[groups[g]] = [];
			groupOptions.push(
				<option value={groups[g]}>{groups[g]}</option>
			);
		}

		let propKeys = Object.keys(this.state.events);
		propKeys.sort((a,b) => {
			return this.state.events[a].name.toUpperCase() > this.state.events[b].name.toUpperCase() ? 1:-1;
		});

		for(let p in propKeys){

			let s = propKeys[p];

			if(s.startsWith("_")){continue;}

			let thisEvent = this.state.events;

			let eventName = thisEvent[s].name;
			let eventDesc = thisEvent[s].description;

			let groupName = thisEvent[s].group;
			if(groupName==null){groupName = ""}

			let eventCooldown = thisEvent[s].cooldown;

			let chatNotification = thisEvent[s].chatnotification;
			let cooldownNotification = thisEvent[s].cooldownnotification;

			let eventTriggers = thisEvent[s].triggers;
			let redemptionTrigger = null;
			if(this.state._rewards != null){
				redemptionTrigger = this.state._rewards.length > 0 ? 
				<label triggertype="redemption" className="event-trigger">
					Redemption:
					<label>
						Enabled:
						<BoolSwitch name="enabled" checked={eventTriggers.redemption.enabled} onChange={this.handleChange}/>
					</label>
					<label>
						Reward:
						<select name="id" value={eventTriggers.redemption.id} onChange={this.handleChange}>
							{rewardOptions}
						</select>
					</label>
					<label>
						Override Approval (Refundable):
						<BoolSwitch name="override" checked={eventTriggers.redemption.override} onChange={this.handleChange}/>
					</label>
				</label>:null;
			}

			let chatTrigger = <label triggertype="chat" className="event-trigger">
								Chat:
								<label>
									Enabled:
									<BoolSwitch name="enabled" checked={eventTriggers.chat.enabled} onChange={this.handleChange}/>
								</label>
								<label>
									Search and Match in Message:
									<BoolSwitch name="search" checked={eventTriggers.chat.search} onChange={this.handleChange}/>
								</label>
								<label>
									Command:
									<input type="text" name="command" value={eventTriggers.chat.command} onChange={this.handleChange} />
								</label>
							</label>

			let oscTrigger = null;

			if(eventTriggers.osc?.type=="double"){
				oscTrigger = <label triggertype="osc" className="event-trigger">
				OSC:
					<label>
						Enabled:
						<BoolSwitch name="enabled" checked={eventTriggers.osc?.enabled} onChange={this.handleChange}/>
					</label>
					<label>
						Handle:
						<select name="handletype" value={eventTriggers.osc?.handletype} onChange={this.handleChange}>
							<option value='trigger'>Trigger</option>
							<option value='toggle'>Toggle</option>
						</select>
					</label>
					<label>
						Address:
						<input type="text" name="address" value={eventTriggers.osc?.address} onChange={this.handleChange} />
					</label>
					<label>
						Args:
						<select name="type" value={eventTriggers.osc?.type} onChange={this.handleChange}>
							<option value="single">Single</option>
							<option value="double">Double</option>
						</select>
					</label>
					<label>
						Condition 1:
						<select name="condition" value={eventTriggers.osc?.condition} onChange={this.handleChange} >
							<option value="==">Equals</option>
							<option value="!=">Not Equals</option>
							<option value=">=">Greater than or equal to</option>
							<option value="<=">Less than or equal to</option>
							<option value=">">Greater than</option>
							<option value="<">Less than</option>
						</select>
					</label>
					<label>
						Value 1:
						<input type="number" name="value" value={eventTriggers.osc?.value} onChange={this.handleChange}/>
					</label>
					<label>
						Condition 2:
						<select name="condition2" value={eventTriggers.osc?.condition2} onChange={this.handleChange} >
							<option value="==">Equals</option>
							<option value="!=">Not Equals</option>
							<option value=">=">Greater than or equal to</option>
							<option value="<=">Less than or equal to</option>
							<option value=">">Greater than</option>
							<option value="<">Less than</option>
						</select>
					</label>
					<label>
						Value 2:
						<input type="number" name="value2" value={eventTriggers.osc?.value2} onChange={this.handleChange}/>
					</label>
			</label>;
			}else{
				oscTrigger = <label triggertype="osc" className="event-trigger">
				OSC:
					<label>
						Enabled:
						<BoolSwitch name="enabled" checked={eventTriggers.osc?.enabled} onChange={this.handleChange}/>
					</label>
					<label>
						Handle:
						<select name="handletype" value={eventTriggers.osc?.handletype} onChange={this.handleChange}>
							<option value='trigger'>Trigger</option>
							<option value='toggle'>Toggle</option>
						</select>
					</label>
					<label>
						Address:
						<input type="text" name="address" value={eventTriggers.osc?.address} onChange={this.handleChange} />
					</label>
					<label>
						Args:
						<select name="type" value={eventTriggers.osc?.type} onChange={this.handleChange}>
							<option value="single">Single</option>
							<option value="double">Double</option>
						</select>
					</label>
					<label>
						Condition:
						<select name="condition" value={eventTriggers.osc?.condition} onChange={this.handleChange} >
							<option value="==">Equals</option>
							<option value="!=">Not Equals</option>
							<option value=">=">Greater than or equal to</option>
							<option value="<=">Less than or equal to</option>
							<option value=">">Greater than</option>
							<option value="<">Less than</option>
						</select>
					</label>
					<label>
						Value:
						<input type="number" name="value" value={eventTriggers.osc?.value} onChange={this.handleChange}/>
					</label>
			</label>;
			}
			
			
			
			let triggerElement = <div className="command-props triggers">
									{chatTrigger}
									{redemptionTrigger}
									{oscTrigger}
								</div>;

			let eventCommands = thisEvent[s].commands;
			let commandElements = [];

			for(let c in eventCommands){
				let element = null;
				switch(eventCommands[c].type){
					case 'response':
						element = <div className="command-props response">
							<label className="response-code-ui">
								Message:
								<CodeEditor className="response-code-editor" name="message" language="js" key={s} 
								value={eventCommands[c].message} 
								onChange={this.handleChange}
								placeholder="return 'Hello '+event.displayName"/>
								<input className="response-code-input" type="text" placeholder="Input text"/>
								<div className="response-code-output"></div>
								<div className="verify-message"><button className="verify-message-button save-button" onClick={this.verifyResponseScript}>Verify Script</button></div>
							</label>
							<label>
								Delay (Milliseconds):
								<input name="delay" key={s} value={eventCommands[c].delay} type="number" break="anywhere" onChange={this.handleChange} />
							</label>
						</div>;
					break;
					case 'plugin':
						element = <div className="command-props plugin">
							<label>
								Plugin:
								<select name="pluginname" key={s} value={eventCommands[c].pluginname} onChange={this.handleChange}>{pluginOptions}</select>
							</label>
							<label>
								Event Name:
								<input type="text" key={s} name="eventname" value={eventCommands[c].eventname} onChange={this.handleChange} />
							</label>
							<label>
								Delay (Milliseconds):
								<input name="delay" key={s} value={eventCommands[c].delay} type="number" break="anywhere" onChange={this.handleChange} />
							</label>
						</div>;
					break;
					case 'software':
						let duration = eventCommands[c].etype=="timed" ? <label>
																		Duration (Seconds):
																		<input type="number" name="duration" key={s} value={eventCommands[c].duration} onChange={this.handleChange} />
																	</label>:null;
						
						element = <div className="command-props software">
							
							<label>
								Address:
								<input type="text" name="address" key={s} value={eventCommands[c].address} onChange={this.handleChange} />
							</label>
							<label>
								UDP:
								<select name="dest_udp" key={s} value={eventCommands[c].dest_udp} onChange={this.handleChange}>
									<option value={-1}>None</option>
									<option value={-2}>All</option>
										{udpHostOptions}
								</select>
							</label>
							<label>
								Value On:
								<input type="text" name="valueOn" key={s} value={eventCommands[c].valueOn} onChange={this.handleChange} />
							</label>
							<label>
								Value Off:
								<input type="text" name="valueOff" key={s} value={eventCommands[c].valueOff} onChange={this.handleChange} />
							</label>
							<label>
								Event Type:
								<select name="etype" key={s} value={eventCommands[c].etype} onChange={this.handleChange}>
									<option value="timed">Timed</option>
									<option value="oneshot">One Shot</option>
								</select>
							</label>
							{duration}
							<label>
								Delay (Milliseconds):
								<input name="delay" key={s} value={eventCommands[c].delay} type="number" break="anywhere" onChange={this.handleChange} />
							</label>
							<label className="tooltip"><span className="tooltiptext">This is for overlapping events that use the same address. Higher priority will override the overlapping event.</span>
								Priority:
								<input name="priority" key={s} value={eventCommands[c].priority} type="number" break="anywhere" onChange={this.handleChange} />
							</label>
						</div>;
					break;
					case "obs":
						if(Object.keys(this.state._obs).length == 0){
							element = <div className="command-props software">
								<label>OBS not connected. Connect to OBS remote in Deck Mode and refresh. Saving now will not affect any settings in place.</label>
							</div>;
							break;
						}
						let oduration = eventCommands[c].etype=="timed" ? <label>
																		Duration (Seconds):
																		<input type="number" name="duration" key={s} value={eventCommands[c].duration} onChange={this.handleChange} />
																	</label>:null;
						let inputItemOptions = [];
						for(let i in this.state._obs.inputs){
							inputItemOptions.push(
								<option value={this.state._obs.inputs[i].inputName}>
									{this.state._obs.inputs[i].inputName}
								</option>
							);
						}
						//console.log("OBS", this.state._obs);
						let sceneOptions = [];
						for(let s in this.state._obs.scenes){
							sceneOptions.push(
								<option value={this.state._obs.scenes[s].sceneName}>
									{this.state._obs.scenes[s].sceneName}
								</option>
							);
						}

						let sceneItemOptions = [];
						for(let si in this.state._obs.sceneItems[eventCommands[c].scene]?.sceneItems){
							console.log(this.state._obs.sceneItems[eventCommands[c].scene].sceneItems[si])
							sceneItemOptions.push(
								<option value={this.state._obs.sceneItems[eventCommands[c].scene].sceneItems[si].sceneItemId}>
									{this.state._obs.sceneItems[eventCommands[c].scene].sceneItems[si].sourceName}
								</option>
							)
						}
						let commandContent = null;
						switch(eventCommands[c].function){
							case "setinputmute":
								let valueOff = eventCommands[c].etype == "timed"?<label>
								Value Off:
								<BoolSwitch key={s} name="valueOff" checked={eventCommands[c].valueOff} onChange={this.handleChange}/>
							</label>:null;
								commandContent = <div className="command-content">
									<label>
										Item:
										<select name="item" key={s} value={eventCommands[c].item} onChange={this.handleChange}>
											{inputItemOptions}
										</select>
									</label>
									<label>
										Value On:
										<BoolSwitch key={s} name="valueOn" checked={eventCommands[c].valueOn} onChange={this.handleChange}/>
									</label>
									{valueOff}
									<label>
										Event Type:
										<select name="etype" key={s} value={eventCommands[c].etype} onChange={this.handleChange}>
											<option value="timed">Timed</option>
											<option value="oneshot">One Shot</option>
										</select>
									</label>
									{oduration}
									<label>
										Delay (Milliseconds):
										<input name="delay" key={s} value={eventCommands[c].delay} type="number" break="anywhere" onChange={this.handleChange} />
									</label>
								</div>
							break;
							case "switchscenes":
								let sceneOff = eventCommands[c].etype=="timed"?<label>
								Scene Off:
								<select name="itemOff" key={s} value={eventCommands[c].itemOff} onChange={this.handleChange}>
									{sceneOptions}
								</select>
							</label>:null;
								commandContent = <div className="command-content">
									<label>
										Scene On:
										<select name="itemOn" key={s} value={eventCommands[c].itemOn} onChange={this.handleChange}>
											{sceneOptions}
										</select>
									</label>
									{sceneOff}
									<label>
										Event Type:
										<select name="etype" key={s} value={eventCommands[c].etype} onChange={this.handleChange}>
											<option value="timed">Timed</option>
											<option value="oneshot">One Shot</option>
										</select>
									</label>
									{oduration}
									<label>
										Delay (Milliseconds):
										<input name="delay" key={s} value={eventCommands[c].delay} type="number" break="anywhere" onChange={this.handleChange} />
									</label>
								</div>
							break;
							case "enablesceneitem":
								let itemOff = eventCommands[c].etype == "timed"?<label>
								Value Off:
								<BoolSwitch key={s} name="valueOff" checked={eventCommands[c].valueOff} onChange={this.handleChange}/>
							</label>:null;
								commandContent = <div className="command-content">
									<label>
										Scene:
										<select name="scene" key={s} value={eventCommands[c].scene} onChange={this.handleChange}>
											{sceneOptions}
										</select>
									</label>
									<label>
										Item:
										<select name="item" key={s} value={eventCommands[c].item} onChange={this.handleChange}>
											{sceneItemOptions}
										</select>
									</label>
									<label>
										Value On:
										<BoolSwitch key={s} name="valueOn" checked={eventCommands[c].valueOn} onChange={this.handleChange}/>
									</label>
									{itemOff}
									<label>
										Event Type:
										<select name="etype" key={s} value={eventCommands[c].etype} onChange={this.handleChange}>
											<option value="timed">Timed</option>
											<option value="oneshot">One Shot</option>
										</select>
									</label>
									{oduration}
									<label>
										Delay (Milliseconds):
										<input name="delay" key={s} value={eventCommands[c].delay} type="number" break="anywhere" onChange={this.handleChange} />
									</label>
								</div>
							break;
						}

						let functionSelect = <select name="function" key={s} value={eventCommands[c].function} onChange={this.handleChange}>
							<option value="setinputmute">Set Input Mute</option>
							<option value="switchscenes">Switch Scenes</option>
							<option value="enablesceneitem">Enable Scene Item</option>
						</select>

						element = <div className="command-props software">
							<label>Function: {functionSelect}</label>
							{commandContent}
						</div>;
					break;
					case "mod":
						let mduration = eventCommands[c].etype=="timed" ? <label>
																		Duration (Seconds):
																		<input type="number" name="duration" key={s} value={eventCommands[c].duration} onChange={this.handleChange} />
																	</label>:null;
						let targetField = null;
						let targetOptions = [<option value="all">All</option>];
						if(eventCommands[c].targettype == "event"){
							let sortedKeys = Object.keys(this.state.events).sort();
							
							for(let s in sortedKeys){
								targetOptions.push(
									<option value={sortedKeys[s]}>{sortedKeys[s]}</option>
								)
							}
						}else if(eventCommands[c].targettype == "plugin"){
							targetOptions = targetOptions.concat(pluginOptions);
						}
						if(eventCommands[c].targettype != "all"){
							targetField = <label>
								Target:
								<select name="target" key={s} value={eventCommands[c].target} onChange={this.handleChange}>
									{targetOptions}
								</select>
							</label>;
						}
						element = <div className="command-props software">
							<h3>
								Moderation chat commands are already built into Spooder. This is mainly so you can hook an OSC trigger for quick moderation actions.
							</h3>
							<label>
								Function:
								<select name="function" key={s} value={eventCommands[c].function} onChange={this.handleChange}>
									<option value="lock">Lock/Unlock</option>
									<option value="spamguard">Spam Guard</option>
									<option value="stop">Stop Event</option>
								</select>
							</label>
							<label>
								Target Type:
								<select name="targettype" key={s} value={eventCommands[c].targettype} onChange={this.handleChange}>
									<option value="all">Everything</option>
									<option value="event">Event</option>
									<option value="plugin">Plugin</option>
								</select>
							</label>
							{targetField}
							<label>
								Handle Type:
								<select name="etype" key={s} value={eventCommands[c].etype} onChange={this.handleChange}>
									<option value="toggle">Toggle</option>
									<option value="timed">Timed</option>
								</select>
							</label>
							{mduration}
							<label>
								Delay (Milliseconds):
								<input name="delay" key={s} value={eventCommands[c].delay} type="number" break="anywhere" onChange={this.handleChange} />
							</label>
						</div>;
					break;
				}

				let typeLabel = <div>{eventCommands[c].type}</div>;
				let commandConflicts = null;

				if(eventCommands[c].type == "software"){
					commandConflicts = this.checkCommandConflicts(s,c);
					if(commandConflicts.length>0){
						typeLabel = <div className="type-label-conflicts">
										<label>{commandConflicts.length+" event"+(commandConflicts.length==1?"":"s")+" share this address. Use 'priority' to handle the overlap"}</label>
										<label>Conflicts: {commandConflicts.join(", ")}</label>
									</div>
					}
				}
				let commandArrows = null;
				if(eventCommands.length>1){
					if(c == 0){
						commandArrows = <div className="command-arrows">
											<div className="command-arrow" direction="down" onClick={this.arrangeCommands}><FontAwesomeIcon icon={faCaretDown} size="2x" /></div>
										</div>;
					}else if(c == eventCommands.length-1){
						commandArrows = <div className="command-arrows">
											<div className="command-arrow" direction="up" onClick={this.arrangeCommands}><FontAwesomeIcon icon={faCaretUp} size="2x" /></div>
										</div>;
					}else{
						commandArrows = <div className="command-arrows">
											<div className="command-arrow" direction="up" onClick={this.arrangeCommands}><FontAwesomeIcon icon={faCaretUp} size="2x" /></div>
											<div className="command-arrow" direction="down" onClick={this.arrangeCommands}><FontAwesomeIcon icon={faCaretDown} size="2x" /></div>
										</div>;
					}
				}

				
				commandElements.push(
					<div className="command-fields" key={c} commandindex={c}  onDragEnter={this.dragEnterCommand} onDragEnd={this.dropCommand}>
						{commandArrows}
						<label>
							{typeLabel}
							{element}
						</label>
						
						<div className="command-actions">
							{trashButton}
						</div>
						
					</div>
				);
			}
	
			let addElement = <div className="add-command">
					<div className="add-command-fields">
						<label>
						Command Type:
						<select id="addCommandType" name="type">
							<option value={"response"}>Reponse</option>
							<option value={"plugin"}>Plugin</option>
							<option value={"software"}>Software</option>
							<option value={"obs"}>OBS</option>
							<option value={"mod"}>Moderation</option>
						</select>
						</label>
					</div>
					<div className="add-command-actions">
						<button type="button" id="addCommandButton" eventname={s} className="add-button" onClick={this.addCommand}>Add</button>
					</div>
				</div>;

			let triggerIcons = [];
			if(eventTriggers.chat.enabled){
				triggerIcons.push(
					<FontAwesomeIcon icon={faCommentDots} />
				);
			}

			if(eventTriggers.redemption.enabled){
				triggerIcons.push(
					<FontAwesomeIcon icon={faAward} />
				)
			}

			if(eventTriggers.osc?.enabled){
				triggerIcons.push(
					<FontAwesomeIcon icon={faNetworkWired} />
				)
			}

			let eventElement = <div className="command-element" key={s} id={s}>
									<div className="command-key" onClick={this.toggleProps}>
										<label>
											<h1>{eventName}{triggerIcons}</h1>
										</label>
									</div>
									<div className="command-section hidden">
									<label>
										Internal Name: {s}
									</label>
									<label>
										Name:
										<input name="name" value={eventName} onChange={this.handleChange}/>
									</label>
									<label>
										Description:
										<input name="description" value={eventDesc} onChange={this.handleChange}/>
									</label>
									<label>
										Group:
										<select name="group" value={groupName} onChange={this.handleChange}>
											{groupOptions}
										</select>
									</label>
									<label>
										Cooldown (In Seconds):
										<input type="number" name="cooldown" value={eventCooldown} onChange={this.handleChange}/>
									</label>
									<label className="label-switch">
										Notify Activation in Chat:
										<BoolSwitch name="chatnotification" checked={chatNotification} onChange={this.handleChange}/>
									</label>
									<label className="label-switch">
										Tell How Much Time Left for Cooldown:
										<BoolSwitch name="cooldownnotification" checked={cooldownNotification} onChange={this.handleChange}/>
									</label>
									<label className="field-section">
										Trigger:
										{triggerElement}
									</label>
									<label className="field-section">
										Commands:
										{commandElements}
										{addElement}
									</label>
									
									<div className="delete-event-div">
										<button type="button" className="delete-button" onClick={this.deleteEvent}>DELETE EVENT</button>
									</div>
									</div>
								</div>;

			if(groupObjects[groupName] == null){
				groupObjects[groupName] = [];
			}

			groupObjects[groupName].push(eventElement);
		}

		let groupElements = [];
		

		let groupKeys = Object.keys(groupObjects).sort();

		for(let go in groupKeys){
			groupElements.push(
				<div className="command-group" >
					<div className="command-group-label" onClick={this.toggleGroup}>
						{groupKeys[go]}
						
					</div>
					<div className="command-group-content hidden">
						<div className="command-group-actions" onClick={(e)=>{e.stopPropagation()}}>
							<div>
								<input type="text" id="eventkey" placeholder="Event name" onInput={this.checkEventTaken} />
								<button type="button" id="addEventButton" groupname={groupKeys[go]} className="add-button" onClick={this.addEvent}>Add</button>
							</div>
							<div className="delete-event-div">
								<button type="button" className="delete-button" onClick={()=>{this.deleteGroup(groupKeys[go])}}>DELETE GROUP</button>
							</div>
						</div>
						{groupObjects[groupKeys[go]]}
						</div>
				</div>
			);
		}
		
		return (
			<form className="event-table">
				<div className="event-container">
					{groupElements}
				</div>
				<div className="event-add">
					<label>
						Add Group
					</label>
					<div className="add-command-actions">
							<input type="text" name="groupname" />
							<button type="button" id="addGroupButton" className="add-button" onClick={this.addGroup}>Add</button>
						</div>
				</div>
				<div className="save-commands"><button type="button" id="saveCommandsButton" className="save-button" onClick={this.saveCommands}>Save</button><div id="saveStatusText" className="save-status"></div></div>
			</form>
		);
	}
}

export {EventTable};


