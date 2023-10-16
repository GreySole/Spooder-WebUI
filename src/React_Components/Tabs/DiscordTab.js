import React from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import BoolSwitch from '../UI/BoolSwitch.js';
import LoadingCircle from '../UI/LoadingCircle';

class DiscordTab extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            stateLoaded:false
        }

        this.saveDiscord = this.saveDiscord.bind(this);
    }

    componentDidMount(){
        fetch("/discord/config")
        .then(response => response.json())
        .then(data => {
            console.log("Discord data", data);
            data.stateLoaded = true;
            window.addEventListener("keydown", this.keyDown)
            this.setState(Object.assign(this.state, data));
        });
    }

    componentWillUnmount(){
        window.removeEventListener("keydown", this.keyDown)
    }

    keyDown = e=>{
		console.log(e);
		if(e.ctrlKey==true && e.key == 's'){
			e.preventDefault();
			this.saveDiscord();
		}
	}

    handleDiscordChange(s){
		let name = s.target.name;
		let newDiscord = Object.assign({},this.state);
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
		this.setState(Object.assign(this.state, newDiscord))
	}

    saveDiscord(){
		let newDiscord = Object.assign({},this.state.config);
		
		const requestOptions = {
			method: 'POST',
			headers: {'Content-Type': 'application/json', 'Accept':'application/json'},
			body: JSON.stringify(newDiscord)
		};
		
		fetch('/discord/saveDiscordConfig', requestOptions)
		.then(response => response.json())
		.then(data => {
            this.props.setToast("DISCORD SAVED!", "save");
			document.querySelector("#discordSaveStatusText").textContent = data.status;
			setTimeout(()=>{
				document.querySelector("#discordSaveStatusText").textContent = "";
			}, 5000)
		});
	}

    render(){
        if(this.state.stateLoaded == false){
			return <LoadingCircle></LoadingCircle>
		}
        let guildOptions = [<option value={""}>Select Guild</option>];
        let channelOptions = [<option value={""}>Select Channel</option>];
        
        if(this.state.guilds != null){
            if(this.state.config.autosendngrok?.enabled){
                for(let g in this.state.guilds){
                    guildOptions.push(
                        <option value={g}>{this.state.guilds[g].name}</option>
                    )
                }
            }
            
            if(this.state.config.autosendngrok?.enabled){
                if(this.state.config.autosendngrok.destguild != null && this.state.config.autosendngrok.destguild != ""){
                    for(let c in this.state.guilds[this.state.config.autosendngrok.destguild].channels){
                        channelOptions.push(
                            <option value={c}>{this.state.guilds[this.state.config.autosendngrok.destguild].channels[c].name}</option>
                        )
                    }
                }
            }
        }
        
        let autoNgrokFields = this.state.config.autosendngrok?.enabled != null?<div className="config-variable">
                <label>
                    Server
                    <select name="autosendngrok-destguild" defaultValue={this.state.config.autosendngrok?.destguild} onChange={this.handleDiscordChange}>
                        {guildOptions}
                    </select>
                </label>
                <label>
                    Channel
                    <select name="autosendngrok-destchannel" defaultValue={this.state.config.autosendngrok?.destchannel} onChange={this.handleDiscordChange}>
                        {channelOptions}
                    </select>
                </label>
            </div>:null;

        let discord = <div className="config-discord">
                <div className="config-variable">
                    <label>
                        Master User
                        <input type="master" defaultValue={this.state.config.master} onChange={this.handleDiscordChange}/>
                    </label>
                </div>
                <div className="config-variable">
                    <label>
                        Bot token
                        <input type="password" defaultValue={this.state.config.token} onChange={this.handleDiscordChange}/>
                    </label>
                </div>
                {this.state.guilds!=null?<div className="config-variable">
                    <label>
                        Send Ngrok Link to Channel on Startup
                        <BoolSwitch name="autosendngrok-enabled" checked={this.state.config.autosendngrok?.enabled} onChange={this.handleDiscordChange}/>
                    </label>
                    <label>
                        Auto Share DM Notification
                        <BoolSwitch name="sharenotif" checked={this.state.config.sharenotif} onChange={this.handleDiscordChange}/>
                    </label>
                    <label>
                        DM Crash Report
                        <BoolSwitch name="crashreport" checked={this.state.config.crashreport} onChange={this.handleDiscordChange}/>
                    </label>
                </div>:<div class="config-variable">
                        Discord isn't logged in. Input your bot token and invite the bot to your server to assign a channel to auto send Ngrok links.
                    </div>}
                {autoNgrokFields}
                <div className="save-commands"><button type="button" id="saveDiscordButton" className="save-button" onClick={this.saveDiscord}>Save</button><div id="discordSaveStatusText" className="save-status"></div></div>
            </div>;

        return discord;
    }
}

export {DiscordTab}