import React from 'react';
import useTwitch from '../../app/hooks/useTwitch';
import LoadingCircle from '../common/LoadingCircle';
import Button from '../common/input/controlled/Button';
import TwitchTabFormContextProvider from './twitchTab/context/TwitchFormContext';
import TwitchCredentials from './twitchTab/TwitchCredentials';
import TwitchAuthManager from './twitchTab/TwitchAuthManager';

export default function TwitchTab() {
  const { getTwitchConfig, getSaveTwitchConfig, getRevokeToken, getDeleteEventSub } = useTwitch();

  const { data: twitchConfig, isLoading: isLoadingTwitchConfig } = getTwitchConfig();
  const { deleteEventSub } = getDeleteEventSub();

  if (isLoadingTwitchConfig) {
    return <LoadingCircle />;
  }

  console.log('TWITCH', twitchConfig);

  let eventsubs = twitchConfig.eventsub;
  let subTable = [];
  for (let event in eventsubs) {
    for (let sub in eventsubs[event]) {
      let conditionTable = [];
      for (let c in eventsubs[event][sub].condition) {
        conditionTable.push(
          <label>
            {c}: {eventsubs[event][sub].condition[c]}
          </label>,
        );
      }
      subTable.push(
        <div className='flex-row'>
          <div className='stack-div'>
            {event}
            <div>ID: {eventsubs[event][sub].id}</div>
            <div>Conditions: {conditionTable}</div>
            <div
              className={
                eventsubs[event][sub].transport.callback ==
                twitchConfig['callback_url'] + '/webhooks/eventsub'
                  ? 'good'
                  : 'error'
              }
            >
              Callback:{' '}
              {eventsubs[event][sub].transport.callback ==
              twitchConfig['callback_url'] + '/webhooks/eventsub'
                ? 'OK'
                : "DOESN'T MATCH"}
            </div>
          </div>
          <Button label='DELETE' onClick={() => deleteEventSub(eventsubs[event][sub].id)} />
        </div>,
      );
    }
  }

  /*let oldEventSubs = null;
  if (twitchConfig.oldEventsubFile) {
    oldEventSubs = (
      <div className='stack-div warning'>
        <span>
          I found an obsolete eventsub.json file in your settings. Eventsubs are now managed by the
          Events tab in the Twitch trigger. We can convert these events to Spooder events or we can
          just delete the file.
        </span>
        <div className='flex-row'>
          <button
            type='button'
            className='command-button'
            onClick={this.convertEventsToSpooderEvents}
          >
            Convert EventSub File
          </button>
          <button type='button' className='delete-button' onClick={this.cleanupOldEventsubs}>
            Delete EventSub File
          </button>
        </div>
      </div>
    );
  }
  let eventsubSection = (
    <div className='config-element'>
      <div className='section-header'>
        Eventsubs{' '}
        <button type='button' className='command-button' onClick={this.refreshEventSubs}>
          Refresh EventSubs
        </button>
      </div>
      {oldEventSubs}
      {subTable}
    </div>
  );*/

  return (
    <form className='config-tab'>
      <TwitchTabFormContextProvider
        twitchConfig={{
          'client-id': twitchConfig['client-id'],
          'client-secret': twitchConfig['client-secret'],
        }}
      >
        <TwitchCredentials />
      </TwitchTabFormContextProvider>
      <div className='section-header'>Auth Management</div>
      <TwitchAuthManager />
    </form>
  );
}

/*class TwitchTab extends React.Component{

	constructor(props){
		super(props);
		twitchConfig = {
			stateLoaded:false,
			callback_url:"",
			discord:{},
		};
		
		_reoccuringMessageCount = 0;
		authMessageHidden = localStorage.getItem("authMessageHidden")!=null?localStorage.getItem("authMessageHidden"):false;
		
		this.handleChange = this.handleChange.bind(this);
		this.saveTwitchConfig = this.saveTwitchConfig.bind(this);
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
			data.stateLoaded = true;
			window.addEventListener("keydown", this.keyDown)
			this.setState(Object.assign(twitchConfig, data));
			this.getEventSubs();
		})
		
		this.getDiscordChannels();
	}

	componentWillUnmount(){
		window.removeEventListener("keydown", this.keyDown)
	}

	keyDown = e=>{
		if(e.ctrlKey==true && e.key == 's'){
			e.preventDefault();
			this.saveEventSubs();
		}
	}

	handleChange(s){
		
		let name = s.target.name;
		let value = s.target.value;

		let newConfig = Object.assign(twitchConfig);
			newConfig[name] = value;
			this.setState(newConfig);
	}

	getDiscordChannels(){
        fetch("/discord/get_channels")
        .then(response => response.json())
        .then(data => {
            this.setState(Object.assign(twitchConfig, {discord:data}));
        })
        .catch(e=>{
            console.log(e);
        })
    }
	
	saveTwitchConfig(){
		
		
		const requestOptions = {
			method: 'POST',
			headers: {'Content-Type': 'application/json', 'Accept':'application/json'},
			body: JSON.stringify({
				"client-id":twitchConfig["client-id"],
				"client-secret":twitchConfig["client-secret"]
			})
		};
		fetch('/twitch/saveConfig', requestOptions)
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
		console.log("GETTING EVENTSUBS")
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

		let events = Object.assign({},twitchConfig.events);
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
						<div className={eventsubs[event][sub].transport.callback==twitchConfig["callback_url"]+"/webhooks/eventsub"? "good":"error"}>Callback: {eventsubs[event][sub].transport.callback==twitchConfig["callback_url"]+"/webhooks/eventsub"?"OK":"DOESN'T MATCH"}</div>
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
		console.log(newEventState, events);
		this.setState(Object.assign(twitchConfig, {"eventsub":newEventState, "events":events}));
	}

	convertEventsToSpooderEvents = () => {
		fetch("/convertEventsubToSpooder")
		.then(response => response.json())
		.then(data => {
			if(data.status == "ok"){
				this.props.setToast("Convert complete!", "save");
			}else{
				this.props.setToast("Convert failed.", "error");
			}
		})
	}

	cleanupOldEventsubs = () => {
		let confirmation = window.confirm("This will delete the Eventsub file which is no longer used. Continue?");
		if (confirmation == false) { return; }
		fetch("/twitch/cleanupOldEventsubs")
		.then(response => response.json())
		.then(data => {
			if(data.status == "ok"){
				this.props.setToast("Cleanup complete!", "save");
			}else{
				this.props.setToast("Cleanup failed.", "error");
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
		
	}

	async revokeBroadcasterAuth(){
		let confirmation = window.confirm("This will disconnect your Twitch account(s) from Spooder. Is that ok?");
		if (confirmation == false) { return; }

		let saveStatus = await fetch('/twitch/revoke')
		.then(response => response.json());
		
	}

	async refreshEventSubs(){
		let confirmation = window.confirm("This will delete and add fresh subscriptions without affecting your settings. Ok?");
		if(confirmation == false){return;}

		let refreshStatus = await fetch('/twitch/refresh_eventsubs')
		.then(response => response.json());

		this.getEventSubs();
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
		if(twitchConfig.stateLoaded == false){
			return <LoadingCircle></LoadingCircle>
		}
		
		let chatAuthButton = null;
		if(twitchConfig.scopeList != null){
			chatAuthButton = <a className={window.location.hostname!="localhost"||twitchConfig["client-id"]==null||twitchConfig["client-id"]==""?"disabled":""} 
		key={twitchConfig["client-id"]+twitchConfig["client-secret"]}
		href={"https://id.twitch.tv/oauth2/authorize?client_id="+twitchConfig["client-id"]+"&redirect_uri=http://localhost:"+twitchConfig.host_port+"/twitch/authorize&response_type=code&scope="+twitchConfig.scopeList.join(" ")}><button type="button" className='command-button' disabled={window.location.hostname!="localhost"||twitchConfig["client-id"]==null||twitchConfig["client-id"]==""}>{twitchConfig["token"] != null ? "Replace" : "Authorize"}</button></a>;
		}

		let chatRevokeButton = <button className='delete-button' onClick={this.revokeBroadcasterAuth}>Revoke</button>
		let broadCopyButton = <button className='command-button' onClick={this.saveAuthToBroadcaster} disabled={window.location.hostname!="localhost"||twitchConfig["client-id"]==null||twitchConfig["client-id"]==""}>Copy from Chat Bot</button>;
		let broadRevokeButton = <a href="/twitch/revoke?broadcaster=true"><button className='command-button'>Revoke</button></a>
		let twitchManage = twitchConfig["token"] != null?<div key="twitchmanage" className="twitchmanage-form">
			<div className="twitch-bot">
				<label>CHAT BOT</label>
				<div className="twitch-pfp"><img height="150px" src={twitchConfig.botUser!=null?twitchConfig.botUser[0].profile_image_url:null}/></div>
				<div className="twitch-username">{twitchConfig.botUser!=null?twitchConfig.botUser[0].display_name : ""}</div>
				
				{chatAuthButton}
			</div>
			<div className="twitch-broadcaster">
				<label>BROADCASTER</label>
				<div className="twitch-pfp"><img height="150px" src={twitchConfig?.broadcasterUser!=null?twitchConfig.broadcasterUser[0].profile_image_url:null}/></div>
				<div className="twitch-username">{twitchConfig.broadcasterUser!=null?twitchConfig.broadcasterUser[0].display_name : ""}</div>
				
				{broadCopyButton}
			</div>
			{chatRevokeButton}
	</div>:<div>Save your ID and Secret before authorizing! {chatAuthButton}</div>;

	let eventsubs = twitchConfig.eventsub;
	let subTable = [];
	for(let event in eventsubs){
		for(let sub in eventsubs[event]){
			let conditionTable = [];
			for(let c in eventsubs[event][sub].condition){
				conditionTable.push(<label>{c}: {eventsubs[event][sub].condition[c]}</label>)
			}
			subTable.push(
				<div className="flex-row">
					<div className="stack-div">
						{event}
						<div>ID: {eventsubs[event][sub].id}</div>
						<div>Conditions: {conditionTable}</div>
						<div className={eventsubs[event][sub].transport.callback==twitchConfig["callback_url"]+"/webhooks/eventsub"? "good":"error"}>Callback: {eventsubs[event][sub].transport.callback==twitchConfig["callback_url"]+"/webhooks/eventsub"?"OK":"DOESN'T MATCH"}</div>
					</div>
					<button type="button" className="event-sub-delete-button" onClick={this.deleteEventSub} subid={eventsubs[event][sub].id}>DELETE</button>
				</div>
			);
		}
	}

	let oldEventSubs = null;
	if(twitchConfig.oldEventsubFile){
		oldEventSubs = <div className="stack-div warning">
			<span>I found an obsolete eventsub.json file in your settings. Eventsubs are now managed by the Events tab in the Twitch trigger. We can convert these events to Spooder events or we can just delete the file.</span>
			<div className="flex-row">
				<button type="button" className="command-button" onClick={this.convertEventsToSpooderEvents}>Convert EventSub File</button>
				<button type="button" className="delete-button" onClick={this.cleanupOldEventsubs}>Delete EventSub File</button>
			</div>
		</div>
	}
	let eventsubSection = <div className="config-element">
		<div className="section-header">Eventsubs <button type="button" className="command-button" onClick={this.refreshEventSubs}>Refresh EventSubs</button></div>
		{oldEventSubs}
		{subTable}
	</div>;
		
		return (
			<form className="config-tab">
				<div className="section-header">Auth Management</div>
				<div className="twitch-credentials">
					<label>Client ID
						<input name="client-id" defaultValue={twitchConfig["client-id"]} type="text" placeholder='Client ID' onChange={this.handleChange}/>
					</label>
					<label>Client Secret
						<input name="client-secret" defaultValue={twitchConfig["client-secret"]} type="password" placeholder='Client Secret' onChange={this.handleChange}/>
					</label>
					<div className="save-commands"><button type="button" id="convertEventSubsButton" className="save-button" onClick={this.saveTwitchConfig}>Save</button><div id="saveStatusText" className="save-status"></div></div>
				</div>
				{twitchManage}
				{eventsubSection}
			</form>
		);
	}
}

export {TwitchTab};*/
