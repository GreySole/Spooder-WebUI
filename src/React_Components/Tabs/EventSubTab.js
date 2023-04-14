import React from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import BoolSwitch from '../UI/BoolSwitch.js';

var _udpClients = {};
var _plugins = [];
var _reoccuringMessageCount = 0;
var authMessageHidden = false;

class EventSubTab extends React.Component{

	constructor(props){
		super(props);
		this.state = Object.assign(props.data);
		if(this.state.callback_url == null){
			this.state.callback_url = "";
		}
		if(this.state.events == null){
			this.state.events = {};
		}else{
			for(let event in this.state.events){
				for(let dCommand in this.defaultEvent){
					if(this.state.events[event][dCommand] == null){
						this.state.events[event][dCommand] = this.defaultEvent[dCommand];
					}
				}
			}
		}

		_udpClients = Object.assign(props._udpClients);
		_plugins = Object.assign(props._plugins);
		_reoccuringMessageCount = 0;
		authMessageHidden = localStorage.getItem("authMessageHidden")!=null?localStorage.getItem("authMessageHidden"):false;
		
		this.handleChange = this.handleChange.bind(this);
		this.saveEventSubs = this.saveEventSubs.bind(this);
		this.getEventSubs = this.getEventSubs.bind(this);
		this.getEventSubs();
	}

	defaultEvent = {
		"chat":{enabled:false, message:""},
		"tcp":{enabled:false, address:"", value:""},
		"plugin":{enabled:false, pluginname:"", eventname:""},
		"udp":{enabled:false, dest:-1, address:"", value:"", duration:1000},
		"spooderevent":{enabled:false, eventname:""}
	}

	componentDidMount(){
		window.setClass(document.querySelector("#authMessage"), "hidden", authMessageHidden);
	}

	handleChange(s){
		
		let name = s.target.name.split("-");
		let eventname = s.target.getAttribute("eventname");
		let value = s.target.value;

		if(s.target.type == "checkbox"){
			value = s.target.checked;
		}

		if(!eventname){
			let newConfig = Object.assign(this.state);
			newConfig[name] = value;
			this.setState(newConfig);
		}else{
			let newEvents = Object.assign(this.state.events);
			newEvents[eventname][name[0]][name[1]] = value;

			this.setState(Object.assign(this.state, {"events":newEvents}));
		}
	}

	async verifyResponseScript(e){
		e.preventDefault();
		let parentEl = e.target.closest(".config-variable-ui");
		let responseEl = parentEl.querySelector("[name='chat-message']");
		if(responseEl == null){ responseEl = parentEl.querySelector("[name='chat-reoccuringmessage']");}
		let outputEl = parentEl.querySelector(".response-code-output");
		let responseScript = responseEl.value;

		//Usually event.username is the uncapitalized version of a username.
		//Spooder replaces this with the capitalized version in runCommands()
		let testEvent = {
			user_id: '14764422',
			user_login: 'testFromUser',
			user_name: 'testFromUser',
			broadcaster_user_id: '87215513',
			broadcaster_user_login: '87215513',
			broadcaster_user_name: 'testBroadcaster',
			followed_at: '2022-05-05T17:15:55.5713334Z'
		  };

		try{
			let responseFunct = eval("async () => { let event = "+JSON.stringify(testEvent)+"; let extra= "+JSON.stringify(testEvent)+"; let count = "+JSON.stringify(_reoccuringMessageCount)+"; "+responseScript.replace(/\n/g, "")+"}");
			let response = await responseFunct();
			console.log("SCRIPT RAN SUCCESSFULLY:",response);
			_reoccuringMessageCount++;
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
	
	saveEventSubs(){
		let newList = Object.assign(this.state);
		delete newList["eventsub"];
		
		const requestOptions = {
			method: 'POST',
			headers: {'Content-Type': 'application/json', 'Accept':'application/json'},
			body: JSON.stringify(newList)
		};
		fetch('/twitch/saveEventSubs', requestOptions)
		.then(response => response.json())
		.then(data => {
			if(data.status == "SAVE SUCCESS"){
				document.querySelector("#saveStatusText").textContent = "Save success!";
				setTimeout(()=>{
					document.querySelector("#saveStatusText").textContent = "";
				}, 5000)
			}else{
				document.querySelector("#saveStatusText").textContent = "Error: "+data.status;
			}
		});
	}

	getEventSubs = async() => {

		let eventsubsRaw = await fetch('/twitch/get_eventsubs_by_user')
		.then(response => response.json());
		let eventsubs = eventsubsRaw.data;
		
		let newEventState = {};
		for(let e in eventsubs){
			if(newEventState[eventsubs[e].type] == null){
				newEventState[eventsubs[e].type] = [];
			}

			newEventState[eventsubs[e].type].push(eventsubs[e]);
			
		}

		let events = Object.assign({},this.state.events);
		let defaultEvent = this.defaultEvent;

		for(let event in newEventState){
			
			let subTable = [];
			for(let sub in eventsubs[event]){
				let conditionTable = [];
				for(let c in eventsubs[event][sub].condition){
					conditionTable.push(<label>{c}: {eventsubs[event][sub].condition[c]}</label>);
				}
				subTable.push(
					<div>{event}<div className="stack-div">
						<div>ID: {eventsubs[event][sub].id}</div>
						<div>Conditions: {conditionTable}</div>
						<div className={eventsubs[event][sub].transport.callback==this.state["callback_url"]+"/webhooks/eventsub"? "good":"error"}>Callback: {eventsubs[event][sub].transport.callback==this.state["callback_url"]+"/webhooks/eventsub"?"OK":"DOESN'T MATCH"}</div>
						</div><button type="button" className="event-sub-delete-button" onClick={this.deleteEventSub} subid={eventsubs[event][sub].id}>DELETE</button></div>
				);
			}
			if(typeof events[event] == "undefined"){
				events[event] = Object.assign({},defaultEvent);
			}

			for(let dCommand in defaultEvent){
				if(events[event][dCommand] == null){Object.assign({},defaultEvent[dCommand])}
			}
		}
		this.setState(Object.assign(this.state, {"eventsub":newEventState, "events":events}));
	}

	initEventSub = async(e) => {
		let eventType = document.querySelector("#event-sub-add select").value;
		if(eventType == null){return;}
		let eventSub = await fetch('/twitch/init_eventsub?type='+eventType)
		.then(response => response.json());
		document.querySelector("#eventSubAddStatus").textContent = eventSub.status;
		setTimeout(function(){
			document.querySelector("#eventSubAddStatus").textContent = "";
		}, 3000);
		this.getEventSubs();
	}

	deleteEventSub = async(e) => {
		e.preventDefault();
		let followSub = await fetch('/twitch/delete_eventsub?id='+e.target.getAttribute("subid"))
		.then(response => response.json());

		this.getEventSubs();
	}

	async saveAuthToBroadcaster(){
		let confirmation = window.confirm("This will store your current oauth as broadcaster. This will not overwrite your current oauth. Ok?");
		if (confirmation == false) { return; }
		
		let saveStatus = await fetch('/twitch/save_auth_to_broadcaster')
		.then(response => response.json());
		
		console.log("DONE", saveStatus);
	}

	async revokeBroadcasterAuth(){
		let confirmation = window.confirm("This will revoke your broadcaster oauth. Your chat oauth will be preserved. Ok?");
		if (confirmation == false) { return; }

		let saveStatus = await fetch('/twitch/revoke?broadcaster=true')
		.then(response => response.json());
		
		console.log("DONE", saveStatus);
	}

	async refreshEventSubs(){
		let confirmation = window.confirm("This will delete and add fresh subscriptions without affecting your settings. Ok?");
		if(confirmation == false){return;}

		let refreshStatus = await fetch('/twitch/refresh_eventsubs')
		.then(response => response.json());

		this.getEventSubs();
		console.log("EVENTSUBS REFRESHED");
	}

	hideAuthMessage(e){
		let isHidden = window.toggleClass(document.querySelector("#authMessage"), "hidden");
		if(isHidden){
			e.target.textContent = "Show";
		}else{
			e.target.textContent = "Hide";
		}

		localStorage.setItem("authMessageHidden", isHidden);
	}
	
	render(){
		let table = [];
		let udpHostOptions = [];

		if(Object.keys(_udpClients).length > 0){
			for(let u in _udpClients){
				udpHostOptions.push(
					<option value={u}>{_udpClients[u].name}</option>
				)
			}
		}

		let pluginOptions = [];

		if(Object.keys(_plugins).length > 0){
			for(let p in _plugins){
				pluginOptions.push(
					<option value={_plugins[p]}>{_plugins[p]}</option>
				)
			}
		}

		let spooderEventOptions = [];

		if(Object.keys(this.state.spooderevents).length > 0){
			for(let e in this.state.spooderevents){
				spooderEventOptions.push(
					<option value={this.state.spooderevents[e]}>{this.state.spooderevents[e]}</option>
				)
			}
		}

		table.push(<div className="stack-div">
						<label id="authMessage">
							Some eventsubs don't require a specific scope to authorize, but those that do require the broadcaster to be authorized on this app.
							Channel point redemptions also need a valid broadcaster oauth for retrieving awards to link to events.
							<br/><br/>
							If you're already authorized and logged into Spooder as the broadcaster, click the button below to save it as broadcaster oauth
							and restart Spooder.<br/><br/> If you're logged in as a bot account for chat, you'll need to login to Twitch as the broadcaster.
							Click authorize on the top right to get oauth tokens for your broadcaster. If the username is your broadcaster username, click the button below
							to save the oauth as broadcaster. Finally, log back into Twitch as the bot account and click authorize again.
							Restart Spooder, the console should have your bot connecting to chat and your broadcaster validating.
						</label>
						<div>
							<button type="button" className="oauth-broadcaster-button command-button" onClick={this.hideAuthMessage}>Hide</button>
							<button type="button" className="oauth-broadcaster-button save-button" onClick={this.saveAuthToBroadcaster}>Save Current Oauth as Broadcaster</button>
							<button type="button" className="oauth-broadcaster-button delete-button" onClick={this.revokeBroadcasterAuth}>Revoke Broadcaster Oauth</button>
							<button type="button" className="oauth-broadcaster-button command-button" onClick={this.refreshEventSubs}>Refresh EventSubs</button>
						</div>
							
						</div>);

		table.push(<div id="event-sub-add">
						<select>
							<option value="channel.update">Channel Update</option>
							<option value="channel.follow">Follow</option>
							<option value="channel.subscribe">Subscribe</option>
							<option value="channel.subscription.end">Subscription End</option>
							<option value="channel.subscription.gift">Subscription Gift</option>
							<option value="channel.subscription.message">Subscription Message</option>
							<option value="channel.cheer">Cheer</option>
							<option value="channel.raid-receive">Receive Raid</option>
							<option value="channel.raid-send">Send Raid</option>
							<option value="channel.ban">Ban</option>
							<option value="channel.unban">Unban</option>
							<option value="channel.moderator.add">Mod Add</option>
							<option value="channel.moderator.remove">Mod Remove</option>
							<option value="channel.channel_points_custom_reward.add">Channel Points Custom Reward Add</option>
							<option value="channel.channel_points_custom_reward.update">Channel Points Custom Reward Update</option>
							<option value="channel.channel_points_custom_reward.remove">Channel Points Custom Reward Remove</option>
							<option value="channel.channel_points_custom_reward_redemption.add">Channel Points Custom Reward Redemption Add</option>
							<option value="channel.channel_points_custom_reward_redemption.update">Channel Points Custom Reward Redemption Update</option>
							<option value="channel.poll.begin">Poll Begin</option>
							<option value="channel.poll.progress">Poll Progress</option>
							<option value="channel.poll.end">Poll End</option>
							<option value="channel.prediction.begin">Prediction Begin</option>
							<option value="channel.prediction.progress">Prediction Progress</option>
							<option value="channel.prediction.lock">Prediction Lock</option>
							<option value="channel.prediction.end">Prediction End</option>
							<option value="channel.charity_campaign.donate">Charity Donate</option>
							<option value="channel.charity_campaign.start">Charity Start</option>
							<option value="channel.charity_campaign.progress">Charity Progress</option>
							<option value="channel.charity_campaign.stop">Charity Stop</option>
							<option value="drop.entitlement.grant">Drop Entitlement Grant</option>
							<option value="extension.bits_transaction.create">Extension Bits Transaction Create</option>
							<option value="channel.goal.begin">Goal Begin</option>
							<option value="channel.goal.progress">Goal Progress</option>
							<option value="channel.goal.end">Goal End</option>
							<option value="channel.hype_train.begin">Hype Train Begin</option>
							<option value="channel.hype_train.progress">Hype Train Progress</option>
							<option value="channel.hype_train.end">Hype Train End</option>
							<option value="stream.online">Stream Online</option>
							<option value="stream.offline">Stream Offline</option>
							<option value="user.authorization.grant">User Authorization Grant</option>
							<option value="user.authorization.revoke">User Authorization Revoke</option>
							<option value="user.update">User Update</option>
						</select><button type="button" onClick={this.initEventSub}>Add</button><div id="eventSubAddStatus"></div></div>);
		
		

		for(let s in this.state){
				switch(s){
					case 'callback_url':
						table.push(<div className="eventsub-variable"><div><label>Note: Changing external settings should refresh all your eventsubs to match the current callback url. You can manually refresh your eventsubs above.</label></div></div>);
					break;
					case 'eventsub':
						
						let eventsubs = this.state.eventsub;
						let events = Object.assign({},this.state.events);

						for(let event in eventsubs){
							
							let subTable = [];
							for(let sub in eventsubs[event]){
								let conditionTable = [];
								for(let c in eventsubs[event][sub].condition){
									conditionTable.push(<label>{c}: {eventsubs[event][sub].condition[c]}</label>)
								}
								subTable.push(
									<div>{event}<div className="stack-div">
										<div>ID: {eventsubs[event][sub].id}</div>
										<div>Conditions: {conditionTable}</div>
										<div className={eventsubs[event][sub].transport.callback==this.state["callback_url"]+"/webhooks/eventsub"? "good":"error"}>Callback: {eventsubs[event][sub].transport.callback==this.state["callback_url"]+"/webhooks/eventsub"?"OK":"DOESN'T MATCH"}</div>
										</div><button type="button" className="event-sub-delete-button" onClick={this.deleteEventSub} subid={eventsubs[event][sub].id}>DELETE</button></div>
								);
							}
							
							let reoccuringMessage = event=="stream.online"?<div className="config-variable-ui">
								<label className={"reoccuringmessage response "+(events[event].chat.enabled?"":"hidden")}>
								<div className="toggle-label" style={{display:"flex", "flex-flow":"column", "align-items":"flex-start"}}>Reoccuring Message:
									<CodeEditor eventname={event} className="response-code-editor" name="chat-reoccuringmessage" language="js" key={s} 
									value={events[event].chat.reoccuringmessage} onChange={this.handleChange} placeholder="return 'This occured '+count+' times!'"/>
									<div className="response-code-output"></div>
									<div className="verify-message"><button className="verify-message-button save-button" onClick={this.verifyResponseScript}>Verify Script</button></div>
									<label>Interval (Minutes):
										<input type="number" eventname={event} name="chat-interval" defaultValue={events[event].chat.interval} onChange={this.handleChange}/>
									</label>
								</div>
							</label></div>:null;

							table.push(<div className="eventsub-variable">
												<div className="">
													<label className="event-label">{event}</label>
													<div className="config-variable-ui tooltip"><div className="toggle-label">Say in chat
														<BoolSwitch eventname={event} name="chat-enabled" checked={events[event]?.chat.enabled} onChange={this.handleChange}/>
													</div>
													
													<label className={"response "+(events[event].chat.enabled?"":"hidden")}>Message:
														<CodeEditor eventname={event} className="response-code-editor" name="chat-message" language="js" key={s} 
														value={events[event].chat.message} onChange={this.handleChange} placeholder="return 'Hello '+event.displayName"/>
														<div className="response-code-output"></div>
														<div className="verify-message"><button className="verify-message-button save-button" onClick={this.verifyResponseScript}>Verify Script</button></div>
													</label>
												</div>

												{reoccuringMessage}

												<div className="config-variable-ui tooltip"><label className="toggle-label">Send event to overlay
												<BoolSwitch eventname={event} name="tcp-enabled" checked={events[event].tcp.enabled} onChange={this.handleChange}/>
												<span className="tooltiptext">Define an overlay's address to send the event object to.</span></label>
													<label className={events[event].tcp.enabled?"":"hidden"}>Address:
														<input type="text" eventname={event} name="tcp-address" defaultValue={events[event].tcp.address} onChange={this.handleChange} />
													</label>
												</div>

												<div className="config-variable-ui tooltip"><label className="toggle-label">Send event to plugin
												<BoolSwitch eventname={event} name="plugin-enabled" checked={events[event].plugin.enabled} onChange={this.handleChange}/>
												<span className="tooltiptext">Send the event object to a plugin's onEvent function.</span></label>
													<label className={events[event].plugin.enabled?"":"hidden"}>Plugin Name:
														<select name="plugin-pluginname" data-key={event} eventname={event} defaultValue={events[event].plugin.pluginname} onChange={this.handleChange}>
															<option value={-1}>Select a plugin</option>
																{pluginOptions}
														</select>
													</label>
													<label className={events[event].plugin.enabled?"":"hidden"}>Event Name:
														<input type="text" eventname={event} name="plugin-eventname" defaultValue={events[event].plugin.eventname} onChange={this.handleChange} />
													</label>
												</div>

												<div className="config-variable-ui software tooltip"><label className="toggle-label">Send to software
												<BoolSwitch eventname={event} name="udp-enabled" checked={events[event].udp.enabled} onChange={this.handleChange}/>
												<span className="tooltiptext">Send a string, a value, or two values seperated by a comma</span></label>
													<label className={events[event].udp.enabled?"":"hidden"}>Destination:
													<select name="udp-dest" data-key={event} eventname={event} defaultValue={events[event].udp.dest} onChange={this.handleChange}>
														<option value={-1}>None</option>
														<option value={-2}>All</option>
															{udpHostOptions}
													</select></label>
													<label className={events[event].udp.enabled?"":"hidden"}>Address:
														<input type="text" eventname={event} name="udp-address" defaultValue={events[event].udp.address} onChange={this.handleChange} />
													</label>
													<label className={events[event].udp.enabled?"":"hidden"}>Value On:
														<input type="text" eventname={event} name="udp-value" defaultValue={events[event].udp.value} onChange={this.handleChange}/>
													</label>
													<label className={events[event].udp.enabled?"":"hidden"}>Value Off:
														<input type="text" eventname={event} name="udp-valueoff" defaultValue={events[event].udp.valueoff} onChange={this.handleChange}/>
													</label>
													<label className={events[event].udp.enabled?"":"hidden"}>Duration (Milliseconds):
														<input type="number" eventname={event} name="udp-duration" defaultValue={events[event].udp.duration} onChange={this.handleChange}/>
													</label>
												</div>

												<div className="config-variable-ui tooltip"><label className="toggle-label">Trigger Spooder event
												<BoolSwitch eventname={event} name="spooderevent-enabled" checked={events[event].spooderevent.enabled} onChange={this.handleChange}/>
												<span className="tooltiptext">Trigger an event set in the Events tab.</span></label>
													<label className={events[event].spooderevent.enabled?"":"hidden"}>Event Name:
														<select name="spooderevent-eventname" data-key={event} eventname={event} defaultValue={events[event].spooderevent.eventname} onChange={this.handleChange}>
															<option value={-1}>Select an event</option>
																{spooderEventOptions}
														</select>
													</label>
													
												</div>
											</div>
											<div className="active-subs">Active subs
												{subTable}
											</div>
										</div>);
						}
						
						
					break;
				}
			
			
			

			//sections.push(<div className="config-element" name={s}><label>{this.state[s]["sectionname"]}</label>{table}</div>);
		}
		
		return (
			<form className="config-tab">
				{table}
				<div className="save-commands"><button type="button" id="saveEventSubsButton" className="save-button" onClick={this.saveEventSubs}>Save</button><div id="saveStatusText" className="save-status"></div></div>
			</form>
		);
	}
}

export {EventSubTab};


