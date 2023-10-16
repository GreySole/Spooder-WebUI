import React from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import BoolSwitch from '../UI/BoolSwitch.js';
import LoadingCircle from '../UI/LoadingCircle';

var _reoccuringMessageCount = 0;
var authMessageHidden = false;

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
	'moderator:read:shoutouts',
	'moderator:manage:shoutouts',
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

class TwitchTab extends React.Component{

	constructor(props){
		super(props);
		this.state = {
			stateLoaded:false,
			callback_url:"",
			discord:{},
		};
		
		_reoccuringMessageCount = 0;
		authMessageHidden = localStorage.getItem("authMessageHidden")!=null?localStorage.getItem("authMessageHidden"):false;
		
		this.handleChange = this.handleChange.bind(this);
		this.saveEventSubs = this.saveEventSubs.bind(this);
		this.getEventSubs = this.getEventSubs.bind(this);
		this.getDiscordChannels = this.getDiscordChannels.bind(this);
		
	}

	componentDidMount(){
		fetch("/twitch/config")
		.then(response => response.json())
		.then(data => {
			if(data.events == null){
				data.events = {};
			}else{
				for(let event in data.events){
					for(let dCommand in this.defaultEvent){
						if(data.events[event][dCommand] == null){
							data.events[event][dCommand] = this.defaultEvent[dCommand];
						}
					}
				}
			}
			console.log(data);
			data.stateLoaded = true;
			window.addEventListener("keydown", this.keyDown)
			this.setState(Object.assign(this.state, data));
			this.getEventSubs();
		})
		
		this.getDiscordChannels();
	}

	componentWillUnmount(){
		window.removeEventListener("keydown", this.keyDown)
	}

	keyDown = e=>{
		console.log(e);
		if(e.ctrlKey==true && e.key == 's'){
			e.preventDefault();
			this.saveEventSubs();
		}
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
			if(name[0] == "discord" && newEvents[eventname][name[0]] == null){
				newEvents[eventname][name[0]] = {
					enabled:false,
					guild:"",
					channel:""
				};
			}
			newEvents[eventname][name[0]][name[1]] = value;

			this.setState(Object.assign(this.state, {"events":newEvents}));
		}
	}

	getDiscordChannels(){
        fetch("/discord/get_channels")
        .then(response => response.json())
        .then(data => {
            this.setState(Object.assign(this.state, {discord:data}));
        })
        .catch(e=>{
            console.log(e);
        })
    }
	
	saveEventSubs(){
		let newList = Object.assign({},this.state);
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
				this.props.setToast("TWITCH SAVED!", "save");
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

	convertEventsToSpooderEvents = () => {
		fetch("/convertEventsubToSpooder")
		.then(response => response.json())
		.then(data => {
			if(data.status == "ok"){
				this.props.setToast("Convert complete!", "save");
				document.querySelector("#saveStatusText").textContent = "Convert complete!";
				setTimeout(()=>{
					document.querySelector("#saveStatusText").textContent = "";
				}, 5000)
			}else{
				document.querySelector("#saveStatusText").textContent = "Error: "+data.status;
			}
		})
	}

	cleanupOldEventsubs = () => {
		let confirmation = window.confirm("This will delete the Twitch files which are no longer used. Be sure to convert your events before cleaning up. Continue?");
		if (confirmation == false) { return; }
		fetch("/twitch/cleanupOldEventsubs")
		.then(response => response.json())
		.then(data => {
			if(data.status == "ok"){
				this.props.setToast("Cleanup complete!", "save");
				document.querySelector("#cleanupStatusText").textContent = "Cleanup complete!";
				setTimeout(()=>{
					document.querySelector("#cleanupStatusText").textContent = "";
				}, 5000)
			}else{
				document.querySelector("#cleanupStatusText").textContent = "Error: "+data.status;
			}
		})
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
		let confirmation = window.confirm("This will disconnect your Twitch account(s) from Spooder. Is that ok?");
		if (confirmation == false) { return; }

		let saveStatus = await fetch('/twitch/revoke')
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
		if(this.state.stateLoaded == false){
			return <LoadingCircle></LoadingCircle>
		}
		
		let chatAuthButton = <a className={window.location.hostname!="localhost"||this.state["client-id"]==null||this.state["client-id"]==""?"disabled":""} 
		key={this.state["client-id"]+this.state["client-secret"]}
		href={"https://id.twitch.tv/oauth2/authorize?client_id="+this.state["client-id"]+"&redirect_uri=http://localhost:"+this.state.host_port+"/twitch/authorize&response_type=code&scope="+scopes.join(" ")}><button type="button" className='command-button' disabled={window.location.hostname!="localhost"||this.state["client-id"]==null||this.state["client-id"]==""}>Replace</button></a>;

		let chatRevokeButton = <button className='delete-button' onClick={this.revokeBroadcasterAuth}>Revoke</button>
		let broadCopyButton = <button className='command-button' onClick={this.saveAuthToBroadcaster} disabled={window.location.hostname!="localhost"||this.state["client-id"]==null||this.state["client-id"]==""}>Copy from Chat Bot</button>;
		let broadRevokeButton = <a href="/twitch/revoke?broadcaster=true"><button className='command-button'>Revoke</button></a>
		let twitchManage = this.state["token"] != null?<div key="twitchmanage" className="twitchmanage-form">
			<div className="twitch-bot">
				<label>CHAT BOT</label>
				<div className="twitch-pfp"><img height="150px" src={this.state.botUser!=null?this.state.botUser[0].profile_image_url:null}/></div>
				<div className="twitch-username">{this.state.botUser!=null?this.state.botUser[0].display_name : ""}</div>
				
				{chatAuthButton}
			</div>
			<div className="twitch-broadcaster">
				<label>BROADCASTER</label>
				<div className="twitch-pfp"><img height="150px" src={this.state?.broadcasterUser!=null?this.state.broadcasterUser[0].profile_image_url:null}/></div>
				<div className="twitch-username">{this.state.broadcasterUser!=null?this.state.broadcasterUser[0].display_name : ""}</div>
				
				{broadCopyButton}
			</div>
			{chatRevokeButton}
	</div>:null;
		
		return (
			<form className="config-tab">
				<div className="section-header">Auth Management</div>
				{twitchManage}
				<div className="section-header">Eventsub</div>
				Twitch Events are now integrated in Spooder's event system. Convert your Twitch events to Spooder events.
				<div className="save-commands"><button type="button" id="convertEventSubsButton" className="save-button" onClick={this.convertEventsToSpooderEvents}>Convert</button><div id="saveStatusText" className="save-status"></div></div>
				<div className="save-commands"><button type="button" id="cleanupOldEventsubsButton" className="delete-button" onClick={this.cleanupOldEventsubs}>CLEANUP</button><div id="cleanupStatusText" className="save-status"></div></div>
			</form>
		);
	}
}

export {TwitchTab};


